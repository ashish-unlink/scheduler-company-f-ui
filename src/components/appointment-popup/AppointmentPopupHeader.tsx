import React from "react";
import "./appointMentHeaderStyle.css";
import CloseIcon from "@mui/icons-material/Close";
const AppointmentPopupHeader = ({ children, onClose, className = "" }: any) => {
  return (
    <div className={`appointment-popup-header ${className}`}>
      {children}

      {onClose && (
        <button className="cancel-button button" onClick={onClose}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default AppointmentPopupHeader;
