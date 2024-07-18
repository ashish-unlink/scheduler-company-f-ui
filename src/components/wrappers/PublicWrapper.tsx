import React from "react";
import "./publicWrapperStyle.css";
import whiteSmallLogo from "../../assets/main-logo.png";
// import whiteTextLogo from "../assets/main-logo.svg";
// import schedule from "../../assets/schedule.mp4";
const PublicWrapper = ({ children }: any) => {

  return (
    <div className="login-bg">
      <div className="login-bg-wrap">
      <div className="bg-left">
      <div className="wrapper-logo">
        <div className="left-wrapper-container">
          <div className="logo-div public-wrapper">
            <img src={whiteSmallLogo} alt={"white-small-logo"} />
            <h3>{process.env.REACT_APP_APPLICATION_NAME}</h3>
          </div>
        </div>
      </div>
      </div>
     <div className={window.location.pathname === "/login"? "main-auth-wrap login-wrap": "main-auth-wrap"}>
      <div className="auth-form-container">{children}</div>
     </div>
    </div>
    </div>
  );
};

export default PublicWrapper;
