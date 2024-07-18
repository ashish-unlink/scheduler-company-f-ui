import React from "react";
import "./customInputStyle.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

const CustomInput = ({
  label,
  id,
  name,
  onChange,
  password,
  onBlur,
  value,
  infoIcon,
  error,
  startIcon,
  endIcon,
  maxLength,
  mandatory,
  rest,
}: any) => {
  
  const longText = `Password should be 8 char long, have one special char, have one digit and one capital letter. `;

  return (
    <div className="custom-input-container">
      <label className="custom-input-label">
        {label}{mandatory &&<span className="mandatory-field">*</span>}
        <Tooltip title={longText} placement="right">
          {infoIcon && (
            <InfoOutlinedIcon fontSize="small" className="info-icon" />
          )}
        </Tooltip>
      </label>
      <div className="custom-input-div">
        {startIcon && (
          <img
            className="custom-input-start-icon"
            src={startIcon}
            alt="startIcon"
          />
        )}
        <input
          type={password ? "password" : "text"}
          autoComplete="off"
          id={id}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          maxlength={maxLength}
          className={`custom-input ${startIcon != undefined && "cursor-pointer"}`}
          {...rest}
        />
        {endIcon && (
          endIcon
        )}
      </div>
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
};

export default CustomInput;
