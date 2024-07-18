import React from "react";
import "./navbarStyle.css";

export const NavBar = ({
  leftPart,
  rightPart,
  callingFrom,
}: {
  leftPart?: React.ReactNode;
  rightPart?: React.ReactNode;
  callingFrom?:string;
}) => {
  return (
    <div className={`nav-bar-conatiner ${callingFrom == "staff" && 'staffStyle'}`}>
      {leftPart}
      {rightPart}
    </div>
  );
};
