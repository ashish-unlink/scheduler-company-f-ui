import React from "react";
import "./mobileInputStyle.css";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { MobilePhoneInputProps } from "./type";


export const MobilePhoneInput = ({
  label,
  name,
  placeholder,
  onChange,
  onBlur,
  value,
  error,
  mandatory,
  ...rest
}: MobilePhoneInputProps) => {
  return (
    <div className="text-wrap">
      <label >{label}{mandatory &&<span className="mandatory-field">*</span>}</label>
      <div>
        <PhoneInput
          international
          // defaultCountry="RU"
          value={value}
          placeholder={placeholder}
          onChange={(val)=>{val != undefined && onChange(val)}}
          onBlur={onBlur}
        />
      </div>
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
};
