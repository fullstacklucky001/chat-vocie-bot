import React from "react";

function UserMessage({ message, handleClick }) {

  return (
    <>
      <div className="flex items-end justify-end text-right" onClick={() => handleClick(message)} >
        <div className="bubble bubble-right">
          {message.message}
        </div>
      </div>
    </>
  );
}

export default UserMessage;
