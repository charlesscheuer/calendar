import React from "react";
import Loader from "react-loader-spinner";

// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export default function Spinner(props) {
  return (
    <div className="Spinner">
      <Loader
        type="Rings"
        color="#0c334d"
        height={50}
        width={50}
        timeout={10000} //10 secs
      />
    </div>
  );
}
