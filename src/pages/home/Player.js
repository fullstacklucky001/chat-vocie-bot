import React, { useState, useEffect } from "react";
import pauseButton from '../../assets/images/pause.webp';
import playButton from '../../assets/images/play.webp';

// const useAudio = url => {


//     return [playing, toggle];
//     // return [playing];
// };

const Player = ({ url, play }) => {
    // const [playing, toggle] = useAudio(url);

    const [audio] = useState(new Audio(url));

    if (play) {
        audio.play()
    }
    // const [playing, setPlaying] = useState(false);

    // const toggle = () => setPlaying(!playing);

    // useEffect(() => {
    //     playing ? audio.play() : audio.pause();
    // }, [playing]);

    useEffect(() => {
        audio.play();
    }, [url]);

    // useEffect(() => {
    //     audio.addEventListener('ended', () => setPlaying(false));
    //     return () => {
    //         audio.removeEventListener('ended', () => setPlaying(false));
    //     };
    // }, []);



    // const [playing, setPlaying] = useAudio(url);

    // useEffect(() => {
    //     // toggle();
    //     // setPlaying(true)
    // }, [url, play]);

    return (
        < div className="bottom-16 absolute w-full" >
            {
                // console.log(playing)
            }
            {/* <button onClick={toggle}>{playing ? "Pause" : "Play"}</button> */}
            {
                play ?
                    <img className="mic m-auto" src={playButton} alt="play" /> : <img className="mic m-auto" src={pauseButton} alt="pause" />
            }
        </div >
    );
};

export default Player;