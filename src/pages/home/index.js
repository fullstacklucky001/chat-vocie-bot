import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import { AiOutlineFieldTime } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

import { pushMessage, fetchMessages, deleteMessage } from "../../actions/messageAction";
import { fetchPrompts } from "../../actions/promptAction";
import { fetchSchedules } from "../../actions/scheduleAction";

import ScaleLoader from "../../components/ScaleLoader"
import RickMessage from "../message/rick";
import UserMessage from "../message/user"
import PromptItem from "../../components/PromptItem";
import SchedulelItem from "../../components/ScheduleItem";

import desktopBgLeft from '../../assets/images/bg_desktop1.webp';
import desktopBgRight from '../../assets/images/bg_desktop3.webp';

import desktopEventBgLeft from '../../assets/images/bg_event_desktop1.webp';
import desktopEventBgRight from '../../assets/images/bg_event_desktop3.webp';

import textbox from '../../assets/images/textbox.webp';
import eventTextbox from '../../assets/images/event_box.webp';
import button from '../../assets/images/button.webp';
import eventButton from '../../assets/images/event_button.webp';
import speakButton from '../../assets/images/pause.webp';
import muteButton from '../../assets/images/play.webp';
import eventSpeakButton from '../../assets/images/pause_e.webp';
import eventMuteButton from '../../assets/images/play_e.webp';
import rickIcon from '../../assets/images/rick-icon.webp'

import Http from "../../service/http";
import io from 'socket.io-client';

const socket = io.connect('/')

const AUDIO_PATH_PREFIX = "https://storage.googleapis.com/vocodes-public";

function Home() {
  const navigate = useNavigate();
  let userInputRef = useRef(null)
  let audioPlayerRef = useRef(null)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [ttsState, setTTSInitState] = useState(false);
  const [audioPath, setAudioPath] = useState("");
  const [mute, setMute] = useState(false)
  const [scrollDown, setScrollDown] = useState(true)
  const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState(false)
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false)
  const [isUnderPlaying, setIsUnderPlaying] = useState(false)
  const [isAlarm, setIsAlarm] = useState(false)

  // Fetch all chat histories
  const messageObj = useSelector(state => state.messageObj)
  const messages = messageObj.messages

  // Fetch all prompts
  const promptObj = useSelector(state => state.promptObj)
  const prompts = promptObj.prompts

  let totalPromptLength = 0
  for (let i = 0; i < prompts.length; i++) {
    totalPromptLength += prompts[i].prompt.length
  }

  // Fetch all schedules
  const scheduleObj = useSelector(state => state.scheduleObj)
  const schedules = scheduleObj.schedules

  // console.log(schedules)

  let auth = localStorage.getItem("login")

  if (auth !== "success") {
    navigate('/')
  }

  let bgLeftStyles = {
    width: '30%',
    backgroundImage: isAlarm ? `url(${desktopEventBgLeft})` : `url(${desktopBgLeft})`,
    backgroundSize: '100% 100%',
  };

  let bgRightStyles = {
    width: '30%',
    backgroundImage: isAlarm ? `url(${desktopEventBgRight})` : `url(${desktopBgRight})`,
    backgroundSize: '100% 100%',
  };

  let textboxStyles = {
    backgroundImage: isAlarm ? `url(${eventTextbox})` : `url(${textbox})`,
    backgroundSize: '100% 100%',
  };

  let buttonStyles = {
    backgroundImage: isAlarm ? `url(${eventButton})` : `url(${button})`,
    backgroundSize: '100% 100%',
    width: '50px',
    height: '50px',
    verticalAlign: 'middle'
  };

  useEffect(() => {
    if (scrollDown)
      document.getElementById('message-list').scrollTo({ top: 1000000, behavior: 'smooth' })
  }, [messages.length])


  useEffect(() => {
    // init chat histories
    (async () => {
      let messages = await Http.get('/get_messages')
      dispatch(fetchMessages(messages.data))

      let prompts = await Http.get('/get_prompts')
      dispatch(fetchPrompts(prompts.data))

      let schedules = await Http.get('/get_schedules')
      dispatch(fetchSchedules(schedules.data))

    })();

    // init tts modules
    toast.success("TTS module is loading...");
    setLoading(true);
    Http.post('/tts_init', {
    })
      .then((res) => {
        setLoading(false);
        if (res.status !== 200 || !res.data.result) {
          setTTSInitState(false);
          toast.error("TTS module init error!");
        } else {
          setTTSInitState(true);
          toast.success("TTS module loaded successfully!");
        }
      })
      .catch((err) => {
        setLoading(false);
        setTTSInitState(false);
        toast.error("TTS module init error!");
      })
  }, []);


  // Get alarm
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data)
      if (data.status === 'start') {
        setIsAlarm(true)

        // generate rick message
        Http.post('/insert_rick_static_message', {
          message: data.schedule.message
        }).then((res) => {
          let rickMessageData = res.data
          if (rickMessageData.status === 'success') {

            let ttsText = data.schedule.message

            if (!mute) {
              console.log(ttsState)
              if (ttsState) {
                Http.post('/get_tts', {
                  message: ttsText
                })
                  .then((res) => {
                    let ttsGenerateResult = res.data.result
                    if (ttsGenerateResult.state) {
                      let audioPath = AUDIO_PATH_PREFIX + ttsGenerateResult.path;
                      if (audioPath !== "") {

                        // scroll down
                        setScrollDown(true)

                        // display rick's latest message 
                        dispatch(pushMessage(rickMessageData.data))

                        // set audio path
                        setAudioPath(audioPath)
                      }
                      setLoading(false);
                    } else {
                      setLoading(false)
                      toast.error("Generate TTS failed.")
                    }
                  });
              } else {
                toast.error("TTS module inited failed.");
              }
            } else {
              setLoading(false)
              dispatch(pushMessage(rickMessageData.data))
            }
          } else {
            setLoading(false)
            toast.error("Generate chat failed!")
          }

        }).catch((err) => {
          console.log(err)
          toast.error("Generate chat failed!");
          setLoading(false)
        });
      } else if (data.status === 'end') {
        setLoading(false)
        setIsAlarm(false)
      }
    });

    // Remove event listener on component unmount
    return () => socket.off('receive_message');
  }, [socket]);

  useEffect(() => {
    let audioPlayer = audioPlayerRef.current
    audioPlayerRef.current.play().catch(err => {
      console.log("Autoplay error:", err)
    })
    audioPlayerRef.current.addEventListener('ended', () => setIsUnderPlaying(false));
    return () => {
      audioPlayer.removeEventListener('ended', () => setIsUnderPlaying(false));
    };
  }, [audioPath]);

  const handleSubmitClick = () => {
    if (userInputRef.current.value === '') {
      toast.error("Please input message.");
      return;
    }

    let userMessage = {
      'role': 'user',
      'content': userInputRef.current.value
    }

    // start loading for generate message
    setLoading(true)

    Http.post('/insert_user_message', {
      userMessage
    })
      .then((res) => {
        if (res.data.status === 'success') {
          setScrollDown(true)
          // display latest user message 
          dispatch(pushMessage(res.data.data))

          // generate rick message
          Http.post('/insert_rick_message', {
          }).then((res) => {
            let rickMessageData = res.data
            if (rickMessageData.status === 'success') {

              let ttsText = rickMessageData.data.message.content;
              userInputRef.current.value = ''

              // scroll down
              // setScrollDown(true)

              // display rick's latest message 
              // dispatch(pushMessage(rickMessageData.data))

              if (!mute) {
                if (ttsState) {
                  Http.post('/get_tts', {
                    message: ttsText
                  })
                    .then((res) => {
                      let ttsGenerateResult = res.data.result
                      if (ttsGenerateResult.state) {
                        let audioPath = AUDIO_PATH_PREFIX + ttsGenerateResult.path;
                        if (audioPath !== "") {
                          // scroll down
                          setScrollDown(true)

                          // display rick's latest message 
                          dispatch(pushMessage(rickMessageData.data))

                          // set audio path
                          setAudioPath(audioPath)
                        }
                        setLoading(false);
                      } else {
                        setLoading(false)
                        toast.error("Generate TTS failed.")
                      }
                    });
                } else {
                  toast.error("TTS module inited failed.");
                }
              } else {
                setLoading(false)
                dispatch(pushMessage(rickMessageData.data))
              }
            } else {
              setLoading(false)
              toast.error("Generate chat failed!")
            }

          }).catch((err) => {
            console.log(err)
            toast.error("Generate chat failed!");
            setLoading(false)
          });
        } else {
          toast.error("Network connection error.")
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error("Generate chat failed!");
        setLoading(false)
      });
  }

  const handleDelete = (id) => {
    Http.post('/delete_message', {
      messageId: id
    })
      .then((res) => {
        let result = res.data
        if (result.msg === 'success') {
          setScrollDown(false)
          dispatch(deleteMessage(id))
        }
      });
  }

  const handleRickMessageClick = (message) => {
    if (mute) {
      toast.warn('Can not play audio in mute mode.')
      return
    }
    setIsUnderPlaying(true)
    if (isUnderPlaying) {
      toast.warn('Can not play while one is playing.')
      return
    }
    setLoading(true)
    if (ttsState) {
      Http.post('/get_tts', {
        message: message.content
      }).then((res) => {
        let ttsGenerateResult = res.data.result
        if (ttsGenerateResult.state) {
          let audioPath = AUDIO_PATH_PREFIX + ttsGenerateResult.path;
          if (audioPath !== "") {
            // set audio path
            setAudioPath(audioPath)
          }
          setLoading(false);
        } else {
          toast.error("Generate TTS failed.")
        }
      }).catch((err => {
        console.log(err)
        setLoading(false)
      }));
    } else {
      toast.error("TTS module inited failed.");
    }
  }

  /*
    START PROMPT HANDLING
  */
  useEffect(() => {
    if (isPromptDrawerOpen) {
      Http.get('/get_prompts')
        .then((res) => {
          let result = res.data
          if (result.msg === 'success') {
            fetchPrompts(result.data)
          }
        });
    }
  }, [isPromptDrawerOpen])

  const togglePromptDrawer = () => {
    setIsPromptDrawerOpen(!isPromptDrawerOpen)
  }

  const handleEditPrompt = () => {
    setIsPromptDrawerOpen(false)
  }
  /*
    END PROMPT HANDLING
  */

  /*
    START SCHEDULE HANDLING
  */
  useEffect(() => {
    if (isScheduleDrawerOpen) {
      Http.get('/get_schedules')
        .then((res) => {
          let result = res.data
          if (result.status === 'success') {
            fetchSchedules(result)
          }
        });
    }
  }, [isScheduleDrawerOpen])

  const toggleScheduleDrawer = () => {
    setIsScheduleDrawerOpen(!isScheduleDrawerOpen)
  }

  const handleEditSchedule = () => {
    setIsScheduleDrawerOpen(false)
  }
  /*
    END SCHEDULE HANDLING
  */

  return (
    <div className="relative h-full">
      <ToastContainer position="top-center" theme="dark" />
      <div className="absolute cursor-pointer right-4 top-4 lg:left-4" onClick={togglePromptDrawer} title="Prompt Editor">
        <span className="inline-flex items-center justify-center p-2 bg-[#16acc9] rounded-md shadow-lg">
          <AiOutlineMessage className="w-6 h-6 text-white" />
        </span>
      </div>

      <Drawer
        open={isPromptDrawerOpen}
        onClose={togglePromptDrawer}
        direction='left'
        size={300}
        className="px-4 py-8 text-white"
        style={{ backgroundColor: '#27272ae6' }}
      >
        <div className="flex text-xl my-8 pb-2 border-b border-b-[#555]">
          <img src={rickIcon} alt="Rick avatar" className="w-12 h-12 rounded-full" />
          <p className="mt-2 ml-4">Rick Sanchez</p>
        </div>
        <div className="text-base pb-2 border-b border-b-[#555]">
          <p>Prompt Editor</p>
        </div>
        {
          prompts.length > 0 && prompts.map((item, index) => (
            <PromptItem key={index} totalLength={totalPromptLength} title={item.title} maxLength={item.maxLength} active={item.active} prompt={item.prompt} _id={item._id} handleEdit={handleEditPrompt} />
          ))
        }

      </Drawer>

      <div className="absolute cursor-pointer right-4 top-16 lg:left-4" onClick={toggleScheduleDrawer} title="Schedule Editor">
        <span className="inline-flex items-center justify-center p-2 bg-[#16acc9] rounded-md shadow-lg">
          <AiOutlineFieldTime className="w-6 h-6 text-white" />
        </span>
      </div>
      <Drawer
        open={isScheduleDrawerOpen}
        onClose={toggleScheduleDrawer}
        direction='left'
        size={300}
        className="px-4 py-8 text-white"
        style={{ backgroundColor: '#27272ae6' }}
      >
        <div className="flex text-xl my-8 pb-2 border-b border-b-[#555]">
          <img src={rickIcon} alt="Rick avatar" className="w-12 h-12 rounded-full" />
          <p className="mt-2 ml-4">Rick Sanchez</p>
        </div>
        <div className="flex justify-between text-base border-b border-b-[#555]">
          <p className="mt-2">Schedule Editor</p>
          {/* <span className="inline-flex mb-1 items-center justify-center p-2 bg-[#16acc9] rounded-md shadow-lg" onClick={handleEditSchedule}>
            <AiOutlinePlus className="w-4 h-4 text-white" />
          </span> */}
        </div>
        {
          schedules.length > 0 && schedules.map((item, index) => (
            <SchedulelItem key={index} title={item.title} _id={item._id} startAt={item.startAt} active={item.active} message={item.message} duration={item.duration} handleEdit={handleEditSchedule} />
          ))
        }
      </Drawer>

      <div className="flex h-full max-w-full min-h-full m-auto" >
        <div className="h-full">
          < div className="bottom-10 lg:bottom-16 absolute w-full left-2 lg:left-[11%]" >
            {
              mute ?
                <img className="mic" src={isAlarm ? eventSpeakButton : speakButton} alt="speak" onClick={() => setMute(false)} /> :
                <img className="mic" src={isAlarm ? eventMuteButton : muteButton} alt="mute" onClick={() => setMute(true)} />
            }
          </div>
        </div>
        <div className="hidden h-full lg:block" style={bgLeftStyles}>
        </div>
        {
          isAlarm ?
            <div className="w-full h-full border-black lg:border-l-8 lg:border-r-8 bg-event-middle">
            </div>
            : <div className="w-full h-full border-black lg:border-l-8 lg:border-r-8 bg-middle">
            </div>
        }

        <div className="relative hidden h-full lg:block" style={bgRightStyles}>
        </div>
        <div className="absolute w-full lg:w-[30%] px-4 lg:right-0 overflow-y-scroll border-solid message-list text-xl lg:text-2xl" id="message-list">
          {
            messages.length > 0 && messages.map((item, index) => (
              item.owner === 1 ?
                <UserMessage key={index} message={item.message} id={item._id} handleDelete={handleDelete}></UserMessage> :
                <RickMessage key={index} message={item.message} id={item._id} handleDelete={handleDelete} handleClick={(text) => handleRickMessageClick(item.message)}></RickMessage>
            ))
          }
        </div>
        <div className="bottom-2 lg:bottom-0 right-2 lg:right-0 absolute flex w-[80%] lg:w-[30%]">
          <div className="block w-11/12 pr-16 lg:py-10 pl-14 lg:pl-24 lg:pr-24 textbox-container" style={textboxStyles} >
            <textarea
              id="message"
              name="message"
              ref={userInputRef}
              rows={4}
              placeholder="Write a message..."
              style={{ backgroundColor: "transparent", resize: 'none' }}
              className="textbox w-full lg:px-1 h-[90%] pt-8 lg:pt-0 focus:outline-none placeholder:text-black bg-white text-xl lg:text-xl"
            />
          </div>
          <div className="absolute right-0 pt-10 lg:pt-16 lg:right-3">
            {
              loading ?
                <span><ScaleLoader /></span> :
                <button
                  onClick={handleSubmitClick}
                  style={buttonStyles}
                >
                </button>
            }
          </div>
        </div>
        <div className="hidden">
          <audio
            autoPlay={true}
            src={audioPath}
            ref={audioPlayerRef}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;