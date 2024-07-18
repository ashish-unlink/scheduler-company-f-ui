import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import "./datePickStyle.css";
import { DOBProps } from "./type";
import dayjs from "dayjs";

export const DatePick = ({
  name,
  label,
  placeholder,
  onChange,
  value,
  onBlur,
  disablePast,
  disableFuture,
  error,
  minDate,
  disabled,
  mandatory,
  format="DD/MM/YYYY"
}: DOBProps) => {
  
  return (
    <div className="dob-container">
      <label className="dob-label">{label}{mandatory &&<span className="mandatory-field">*</span>}</label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          format={format}
          slotProps={{ textField: { size: "small" } }}
          disableFuture = {disableFuture}
          disablePast={disablePast}
          onChange={(e) => {
            onChange(e);
          }}
          disabled={disabled}
          minDate={minDate}
          sx={{
            width:"100%",
            "&.myDatePicker fieldset.MuiOutlinedInput-notchedOutline": {
              paddingRight: "0px",
            },
          }}
          name={name}
          value={value}
        />
      </LocalizationProvider>
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
};
