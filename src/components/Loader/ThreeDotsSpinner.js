import React from "react";
import { ThreeDots } from "react-loader-spinner";

//npm i react-loader-spinner
function ThreeDotsSpinner() {
  return (
    <div className="d-flex justify-content-center ">
      <ThreeDots
        height="40"
        width="40"
        radius="9"
        color="#4fa94d"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
}

export default ThreeDotsSpinner;

// https://www.youtube.com/watch?v=Id7GbGUOlFs
