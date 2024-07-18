import React from "react";
import TextField from "@mui/material/TextField";
import "./phoneStyle.css";

// interface PhoneInputProps {
//     label:string,  name :string, onChange=()=>{},  onBlur =()=>{}, value:string, error:string
// }

export const MobileInput = ({
  label,
  name,
  onChange,
  onBlur,
  value,
  error,
  countryCode,
  mandatory,
  ...rest
}: any) => {
  return (
    <div className="custom-input-container">
      <label className="custom-input-label">
        {label}
        {mandatory && <span className="mandatory-field">*</span>}
      </label>
      <div className="custom-input-div">
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
              border: 0,
              borderRadius: "50px",
              color: "#000",
              height: "50px",
              //   paddingLeft: "15px !important",

              "&:MuiInputBase-input": {
                border: 0,
              },
              "&:hover fieldset": {
                border: 0,
                height: "60px",
              },
              "&.Mui-focused fieldset": {
                border: 0,
                height: "60px",
              },
            },
          }}
          id="outlined-basic"
          variant="outlined"
          //   type="number"
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          InputProps={{
            startAdornment: (
              <>
                <button
                  className="design-country-code"
                  disabled={countryCode != ""}
                >
                  {countryCode}
                </button>
              </>
            ),
          }}
          value={value}
          {...rest}
        />
      </div>
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
};
