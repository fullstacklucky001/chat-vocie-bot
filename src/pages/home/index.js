import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { pushMessage, fetchMessages, deleteMessage } from "../../actions/messageAction";
import ScaleLoader from "../../components/ScaleLoader"
import RickMessage from "../message/rick";
import UserMessage from "../message/user"

import desktopBgLeft from '../../assets/images/bg_desktop1.webp';
import desktopBgRight from '../../assets/images/bg_desktop3.webp';
import textbox from '../../assets/images/textbox.webp';
import button from '../../assets/images/button.webp';
import speakButton from '../../assets/images/pause.webp';
import muteButton from '../../assets/images/play.webp';

// const SERVER_URL = 'https://rick-chat-bot.onrender.com'
const SERVER_URL = 'http://localhost:5001'

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

  const messageObj = useSelector(state => state.messageObj)
  const messages = messageObj.messages

  let auth = localStorage.getItem("login")

  if (auth !== "success") {
    navigate('/')
  }

  let bgLeftStyles = {
    width: '30%',
    backgroundImage: `url(${desktopBgLeft})`,
    backgroundSize: '100% 100%',
  };

  let bgRightStyles = {
    width: '30%',
    backgroundImage: `url(${desktopBgRight})`,
    backgroundSize: '100% 100%',
  };

  let textboxStyles = {
    backgroundImage: `url(${textbox})`,
    backgroundSize: '100% 100%',
  };

  let buttonStyles = {
    backgroundImage: `url(${button})`,
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
      let res = await axios.get(SERVER_URL + '/get_messages')
      dispatch(fetchMessages(res.data))
    })();

    // init tts modules
    toast.success("TTS module is loading...");
    setLoading(true);
    axios.post(SERVER_URL + '/tts_init', {
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

  // useEffect(() => {
  //   const audio = new Audio(audioPath);
  //   if (play)
  //     audio.play();
  //   audio.addEventListener('ended', () => setPlay(false));
  //   return () => {
  //     audio.removeEventListener('ended', () => setPlay(false));
  //   };
  // }, [toggle]);

  useEffect(() => {
    audioPlayerRef.current.play().catch(err => {
      console.log("Autoplay error:", err)
    })
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

    axios.post(SERVER_URL + '/insert_user_message', {
      userMessage
    })
      .then((res) => {
        if (res.data.status === 'success') {
          setScrollDown(true)
          // display latest user message 
          dispatch(pushMessage(res.data.data))

          // generate rick message
          axios.post(SERVER_URL + '/insert_rick_message', {
          })
            .then((res) => {
              let rickMessageData = res.data
              if (rickMessageData.status === 'success') {

                let ttsText = rickMessageData.data.message.content;
                userInputRef.current.value = ''

                if (!mute) {
                  if (ttsState) {
                    axios.post(SERVER_URL + '/get_tts', {
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
                toast.error("Generate chat failed!")
              }
            })
            .catch((err) => {
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
    axios.post(SERVER_URL + '/delete_message', {
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

  return (
    <div className="h-full">
      <ToastContainer position="top-left" theme="dark" />
      <div className="flex h-full min-h-full m-auto max-w-full" >
        <div className="h-full">
          < div className="bottom-12 lg:bottom-16 absolute w-full left-2 lg:left-[11%]" >
            {
              mute ?
                <img className="mic" src={speakButton} alt="speak" onClick={() => setMute(false)} /> :
                <img className="mic" src={muteButton} alt="mute" onClick={() => setMute(true)} />
            }
          </div>
        </div>
        <div className="h-full hidden lg:block" style={bgLeftStyles}>
        </div>
        <div className="h-full border-black lg:border-l-8 lg:border-r-8 bg-middle w-full">
        </div>
        <div className="h-full relative hidden lg:block" style={bgRightStyles}>
        </div>
        <div className="absolute w-full lg:w-[30%] px-4 lg:right-0 overflow-y-scroll border-solid message-list text-xl lg:text-2xl" id="message-list">
          {
            messages.length > 0 && messages.map((item, index) => (
              item.owner === 1 ?
                <UserMessage key={index} message={item.message} id={item._id} handleDelete={handleDelete}></UserMessage> :
                <RickMessage key={index} message={item.message} id={item._id} handleDelete={handleDelete}></RickMessage>
            ))
          }
        </div>
        <div className="bottom-0 right-2 lg:right-0 absolute flex w-[80%] lg:w-[30%]">
          <div className="block w-11/12 lg:py-10 pl-14 pr-16 lg:pl-24 lg:pr-24 textbox-container" style={textboxStyles} >
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
          <div className="absolute pt-16 right-0 lg:right-3">
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
      </div>
      <div className="hidden">
        <audio
          autoPlay={true}
          src={audioPath}
          ref={audioPlayerRef}
        />
      </div>
    </div>
  );
}

export default Home;