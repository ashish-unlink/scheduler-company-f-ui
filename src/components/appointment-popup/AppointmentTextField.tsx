import { FormControl, InputAdornment, TextField } from "@mui/material";
import React from "react";

const AppointmentTextField = ({
  name,
  id,
  label,
  placeholder,
  value,
  onChange,
  startAdornment,
  onBlur,
  maxLength=30,
  error,
  mandatory,
}: any) => {
  return (
    <div className="appointment-text-field">
      <FormControl fullWidth size="small">
        <label className="appointment-input-label">{label}{mandatory &&<span className="mandatory-field">*</span>}</label>
        <TextField
          id="outlined-start-adornment"
          autoComplete="off"
          name={name}
          size="small"
          placeholder={placeholder}
          value={value}
          className="place-text"
          onChange={onChange}
          onBlur={onBlur}
          sx={{
            "& .MuiOutlinedInput-root": {
              marginTop: "0px",

              "& fieldset": {
                border: "1px solid #d4d4d4",
              },
              "&:hover fieldset": {
                borderColor: "#7469B6",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#7469B6",
              },
              "&.MuiOutlinedInput-input": {
                textIndent: "0px !important",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {startAdornment && (
                  <img
                    className="appointment-text-field-start-adornment"
                    src={startAdornment}
                    alt="start-icon"
                  />
                )}
              </InputAdornment>
            ),
          }}
          inputProps={{
            maxLength:maxLength
          }}
        />
        {error ? <p className="error-text">{error}</p> : null}
      </FormControl>
    </div>
  );
};

export default AppointmentTextField;
