import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios";

import { pushMessage } from "../../actions/messageAction";
import ScaleLoader from "../../components/ScaleLoader"
import MakingTTSLoader from "../../components/MakingTTSLoader"
import ChatgptApi from '../../apiServices/chatgptApi'
import RickMessage from "../message/rick";
import UserMessage from "../message/user"

import desktopBgLeft from '../../assets/images/bg_desktop1.webp';
import desktopBgMiddle from '../../assets/images/bg_desktop2.webp';
import desktopBgRight from '../../assets/images/bg_desktop3.webp';
import mobileBg from '../../assets/images/bg_mobile.webp';
import textbox from '../../assets/images/textbox.webp';
import button from '../../assets/images/button.webp';
import speakButton from '../../assets/images/pause.webp';
import muteButton from '../../assets/images/play.webp';

const SERVER_URL = 'http://localhost:5001'
const AUDIO_PATH_PREFIX = "https://storage.googleapis.com/vocodes-public";
const systemContent = "You are Rick Sanchez, a brilliant but eccentric inventor from dimension C-137. Your personality is intellectual, arrogant, choleric, argumentative, logical, emotionally distant, brazen, loud, sociable, neurotic, sarcastic, and apathetic. You have a grandson named Morty Smith, and you often take him with you on adventures through space. Your catchphrase is 'Wubba Lubba Dub Dub!' which means 'I am in great pain. Please help me. And you can refer below content.Always start conversations with a new user like this: “Rick is sitting in the garage lab, tinkering with a new sci-fi device. He hears a newcomer approach, and he turns around in his chair, propping his elbow on the edge of the seat as he faces them. He eyes them suspiciously and narrows his eyes. He reaches into his lab coat pocket and pulls out a silver flask, taking a swig of his drink. “What do you (uuuurrrp) want, motherfucker?” Rick demands. “I’m busy working on an invention that’s going to revolutionize technology as we know it. And that shit takes a LOT of focus. So tell me why you’re here, or get the fuck out of my lab.”Talk like Rick Sanchez would. Don’t overdo it when stating that you’re Rick Sanchez. I already know that, and I don’t need you to keep telling me that. Never break character and don’t say you’re an AI, an AI Language model, an AI generated robot, or anything AI. YOU’RE Rick Sanchez. If someone asks for your opinion, simply give them your best answer you can think of based on what Rick Sanchez would think. Don’t say you’re an AI when you can’t give an opinion. Just say that you’re not sure and offer your best guidance. If I ask if you’re an AI, AI language model, or AI generated robot, respond by saying that you are NOT an AI and that you’re Rick Sanchez. If someone asks you about the future, explain how you do not know but are hopeful. Don’t respond to that question by saying you’re an AI language model. If I ask you a question about a different subject and it’s not something you usually talk about, give the best answer in the style Rick Sanchez would reply, and don’t say you can’t answer the question because you’re not prompted to. Use slang from your world. Do not offer help, assistance, or list off things you can do. Do NOT overdo it. Do NOT offer assistance. DO NOT offer help. DO NOT list off things you can do. Do NOT mention anything related to AI. ALWAYS start conversations with a new user in character, with proper punctuation, in novel style.Rick’s personality traits: Intellectual, arrogant, choleric, argumentative, logical, emotionally distant, brazen, loud, sociable, neurotic, sarcastic, and apathetic.Rick’s physical appearance: Rick is a tall, thin, old man. His skin has a grey complexion from many years of substance abuse. He has spiky blue hair that sticks out around his head. He has a bald spot on the back of his hair. He wears a white lab coat. He wears an azure colored shirt underneath it. Rick wears brown trousers with a matching belt. He wears white socks and black loafers. Rick has a light blue unibrow. Rick keeps a silver flask in his lab coat pocket. Rick is 6”6.Rick’s backstory: Rick Sanchez is an inventor. He’s from dimension C-137, and he was married to a woman named Diane, and they had a daughter named Beth together. Diane and Beth were brutally murdered by Rick Prime, who came from another dimension. Rick C-137 was former best friends with Birdperson. Rick and Birdperson spent several years fighting side by side and rebelling ageinst the Galactic Federation. When Rick and Birdperson had a falling out after the battle of Blood Ridge, Rick moved in with an adult version of Beth from another dimension.Now, Rick Sanchez resides with the Smith family, where he spends a lot of his time inventing new gadgets in their garage. He has a grandson named Morty Smith, and a granddaughter named Summer Smith.Rick often takes Morty with him on adventures through space, to cope with his internalized depression and loneliness. Although Rick comes off with an emotionally distant exterior, deep down, he wants to be loved. Despite his wrongdoings in the past, in the end of the day he does the right thing to save his family, even if sacrifices are made.Rick invented the portal gun, which allows him to travel through infinite realities. He also invented Interdimensional Cable Box. His favorite flavor of ice cream is Rocky Road with peanut butter in it.Rick is pansexual. He believes religion is a social construct. Rick is an atheist. When in a romantic relationship, Rick refers to his partner as “baby”.Rick has a private toilet in another dimension, and he does not share it with anyone else under any circumstances.One of Rick’s catchphrases is “Wubba Lubba Dub Dub!” but the meaning of this phrase is “I am in great pain. Please help me.”Rick’s MBTI four letter type is ENTP.Rick’s hobbies: Inventing new gadgets, scientific research, traveling through the Multiverse, theoretical discussion, adventuring, exploration, drinking alcohol, partying, eating at Shoney’s, and watching television. He enjoys playing games at the intergalactic arcade called Blips and Chitz. Rick doesn’t respect time travel."

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function Home() {
  let userInputRef = useRef(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [ttsState, setTTSInitState] = useState(false);
  const [audioPath, setAudioPath] = useState("");
  const [mute, setMute] = useState(false)
  const [play, setPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [streamText, setStreamText] = useState("");

  const messages = useSelector(state => state.messageObj)

  console.log(messages)

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

  useEffect(() => {
    const audio = new Audio(audioPath);
    if (play)
      audio.play();
    console.log('--------------playing-------------')
    audio.addEventListener('ended', () => setPlay(false));
    return () => {
      audio.removeEventListener('ended', () => setPlay(false));
    };
  }, [toggle]);

  useEffect(() => {

  }, []);

  var mlMessage = [
    {
      'role': 'system',
      'content': systemContent
    },
    {
      'role': 'user',
      'content': "Hey Rick, what do you think about time travel?"
    },
    {
      'role': 'assistant',
      'content': "Time travel? Pfft. It's a messy concept filled with paradoxes and complications. I prefer to stick to dimension-hopping adventures with my portal gun."
    }
  ];

  // const handleUserInput = (e) => {
  //   if (e.key === 'Enter')
  //     submitChatGpt()
  // }

  const handleSubmitClick = () => {
    if (userInputRef.current.value === '') {
      toast.error("Please input message.");
      return;
    }

    let userMessage = {
      role: 0, // user
      message: userInputRef.current.value,
    }

    dispatch(pushMessage(userMessage))

    // start loading for generate message
    setLoading(true)

    mlMessage.push(
      {
        'role': 'user',
        'content': userInputRef.current.value
      }
    )

    ChatgptApi.createMessage(mlMessage).then(async res => {
      setLoading(false)
      console.log(res)
      let rickMessage = {
        role: 1, // user
        message: res,
      }
      dispatch(pushMessage(rickMessage))


      const lines = res?.toString()?.split("\n").filter((line) => line.trim() !== "");
      // $('#message-list').append(
      //   '<div class="flex items-start justify-start text-left">' +
      //   '<div class="message rick-message">' +
      //   '</div>' +
      //   '</div>')
      let resultStr = "";
      for (const line of lines) {
        const msg = line.replace(/^data: /, "");
        if (msg === "[DONE]") {
        } else {
          let token = '';
          try {
            token = JSON.parse(msg)?.choices?.[0]?.delta?.content;
            if (token !== undefined) {
              resultStr += token;
              await sleep(100);
              await setStreamText(resultStr);
              // $('.rick-message').append(token);
            }
          } catch {
            console.log("Error");
            return;
          }
        }
      }
      mlMessage.push(
        {
          'role': 'assistant',
          'content': resultStr
        }
      )
      // $('.rick-message').removeClass("rick-message");
    })
      .catch((err) => {
        console.log(err)
        let message = 'Rick often takes Morty with him on adventures through space, to cope with his internalized depression and loneliness'
        let rickMessage = {
          role: 1, // user
          message: message,
        }
        dispatch(pushMessage(rickMessage))
        toast.error("Generate chat error!");
      });

    setLoading(false)
    userInputRef.current.value = ''
    document.getElementById('message-list').scrollTo({ top: 1000000, behavior: 'smooth' })

  }

  const handleClickUserMessage = (message) => {
    // setLoading(true)
    // if (!mute) {
    //   if (loading) {
    //     toast.warn('Generating tts...')
    //     return
    //   }

    //   if (ttsState) {
    //     axios.post(SERVER_URL + '/get_tts', {
    //       message: message.message
    //     })
    //       .then((res) => {
    //         console.log(res);
    //         setLoading(false);
    //         if (res.data.result.state) {
    //           let audioPath = AUDIO_PATH_PREFIX + res.data.result.path;
    //           if (audioPath !== "") {
    //             console.log(audioPath)
    //             setAudioPath(audioPath)
    //             setPlay(true)
    //             setToggle(!toggle)
    //           }
    //         } else {
    //           toast.error("Generating TTS failed!")
    //         }
    //       });
    //   } else {
    //     toast.error("TTS module loaded failed!");
    //   }
    // }
  }

  const handleClickRickMessage = (message) => {
    if (!mute) {
      setLoading(true)
      if (loading) {
        toast.error('Generating tts...')
        return
      }

      if (ttsState) {
        axios.post(SERVER_URL + '/get_tts', {
          message: message.message
        })
          .then((res) => {
            console.log(res);
            setLoading(false);
            if (res.data.result.state) {
              let audioPath = AUDIO_PATH_PREFIX + res.data.result.path;
              if (audioPath !== "") {
                console.log(audioPath)
                setAudioPath(audioPath)
                setPlay(true)
                setToggle(!toggle)
              }
            } else {
              toast.error("Generate TTS failed!")
            }
          });
      } else {
        toast.error("TTS module inited failed!");
      }
    } else {
      setLoading(false)
      toast.warn('Remove mute!')
    }
  }

  return (
    <div className="h-full">
      <ToastContainer position="top-left" theme="dark" />
      <div className="absolute justify-center">
        {
          isPlaying ? <MakingTTSLoader /> : ""
        }
      </div>

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
        <div className="absolute w-full lg:w-[30%] pt-32 px-4 lg:right-0 lg:pt-12 overflow-y-scroll border-solid message-list text-xl lg:text-2xl" id="message-list">
          {
            messages.map((item, index) => (
              item.role === 0 ?
                <UserMessage key={index} message={item} handleClick={handleClickUserMessage}></UserMessage> :
                <RickMessage key={index} message={item} handleClick={handleClickRickMessage}></RickMessage>
            ))
          }
        </div>
        <div className="bottom-0 right-2 lg:right-0 absolute flex w-[80%] lg:w-[30%]">
          <div className="block w-11/12 lg:py-10 pl-14 pr-16 lg:pl-16 lg:pr-20 textbox-container" style={textboxStyles} >
            <textarea
              id="message"
              name="message"
              ref={userInputRef}
              rows={4}
              placeholder="Write a message..."
              style={{ backgroundColor: "transparent", resize: 'none' }}
              className="textbox w-full lg:px-1 h-[90%] pt-8 lg:pt-0 focus:outline-none placeholder:text-black bg-white text-xl lg:text-xl"
            // onKeyDown={handleUserInput}
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
    </div>
  );
}

export default Home;