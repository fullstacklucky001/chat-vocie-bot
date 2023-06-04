import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

function RickMessage({ message, handleDelete, id }) {
  const handleDeleteMessage = (id) => {
    handleDelete(id)
  }

  return (
    <>
      <div className="flex items-start justify-start text-left">
        <div className="bubble bubble-left rick-message custom-cursor">
          <div className="cursor-pointer float-right text-2xl" onClick={() => handleDeleteMessage(id)}><AiOutlineDelete /></div>
          {message.content}
        </div>
      </div>
    </>
  );
}

export default RickMessage;
