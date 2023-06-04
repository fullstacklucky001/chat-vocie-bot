import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

function UserMessage({ message, handleDelete, id }) {

  const handleDeleteMessage = (id) => {
    handleDelete(id)
  }

  return (
    <>
      <div className="flex items-end justify-end text-right">
        <div className="bubble bubble-right relative">
          <div className="cursor-pointer float-left mr-4 text-2xl lg:text-2xl" onClick={() => handleDeleteMessage(id)}><AiOutlineDelete /></div>
          {message.content}
        </div>
      </div>
    </>
  );
}

export default UserMessage;
