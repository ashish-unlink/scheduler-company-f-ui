import React from "react";
import "./textAreaStyle.css";
import { TextareaAutosize } from "@mui/material";
import { Input as BaseInput, InputProps } from '@mui/base/Input';
import { TextAreaProps } from "./type";

const TextArea = ({
  label,
  id,
  name,
  onChange,
  onBlur,
  value,
  rows,
  cols,
  error,
  placeholder,
  style,
  maxLength,
  ...rest
}: TextAreaProps) => {
  return (
    <div className="custom-textarea-container">
      <label className="custom-textarea-label">{label}</label>
      <div className="custom-textarea-div">
        <textarea
          rows={rows}
          cols={cols}
          placeholder={placeholder}
          className="text-area"
          id={id}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          style={style}
          maxLength={maxLength}
          {...rest}
        />
      </div>
      {error ? <div>{error}</div> : null}
    </div>
  );
};

export default TextArea;