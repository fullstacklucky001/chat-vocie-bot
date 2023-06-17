import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

function RickMessage({ message, handleDelete, id, handleClick }) {
  const handleDeleteMessage = (id) => {
    handleDelete(id)
  }

  const handleClickForAudioPlay = () => {
    handleClick()
  }

  return (
    <>
      <div className="flex items-start justify-start text-left">
        <div className="bubble bubble-left rick-message custom-cursor" onClick={handleClickForAudioPlay}>
          <div className="cursor-pointer float-right text-2xl" onClick={() => handleDeleteMessage(id)}><AiOutlineDelete /></div>
          {message.content}
        </div>
      </div>
    </>
  );
}

export default RickMessage;
