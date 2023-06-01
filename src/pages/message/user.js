import React from "react";

function UserMessage({ message }) {

  return (
    <>
      <div className="flex items-end justify-end text-right">
        <div className="bubble bubble-right">
          {message.message}
        </div>
      </div>
    </>
  );
}

export default UserMessage;
