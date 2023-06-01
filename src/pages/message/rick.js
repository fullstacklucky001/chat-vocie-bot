import React from "react";
import './style.css'

function RickMessage({ message, handleClick }) {
  return (
    <>
      <div className="flex items-start justify-start text-left" onClick={() => handleClick(message)}>
        <div className="bubble bubble-left rick-message custom-cursor" >
          {message.message}
        </div>
      </div>
    </>
  );
}

export default RickMessage;
