import React from "react";

function RickMessage({ message }) {
  return (
    <>
      <div className="flex items-start justify-start text-left">
        <div className="bubble bubble-left rick-message custom-cursor" >
          {message.message}
        </div>
      </div>
    </>
  );
}

export default RickMessage;
