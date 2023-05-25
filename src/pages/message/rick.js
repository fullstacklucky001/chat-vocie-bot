import React from "react";

function RickMessage({ dir, message }) {
  return (
    <>
      <div className="flex items-start justify-start text-left" >
        <div className="bubble bubble-left">
          {message}
        </div>
      </div>
    </>
  );
}

export default RickMessage;
