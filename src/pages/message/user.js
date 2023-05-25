import React from "react";
// import './style.css'

function UserMessage({ dir, message }) {
  return (
    <>
      <div className="flex items-end justify-end text-right" >
        <div className="bubble bubble-right">
          {message}
        </div>
      </div>
    </>
  );
}

export default UserMessage;
