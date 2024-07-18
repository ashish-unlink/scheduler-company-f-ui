import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { DropDownProps } from "./type";
import InputAdornment from "@mui/material/InputAdornment";
import "./dropDownStyle.css";

export const DropDown = (props: DropDownProps) => {
  const { label, icon, option, onSelectedValue,id, name, value,mandatory, ...rest } =
    props;

  return (
    <div className="country-list-dropdown">
      <Autocomplete
        freeSolo
        id="free-solo-with-demo-text-demo"
        disableClearable
        options={option}
        sx={{
          width: 300,
          border: 0,
          "& .MuiInputBase-input": {
            backgroundColor: "#fff",
            borderRadius: "50px",
            height: "45px",
            border: "none",
            outline: "0px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            color: "#000",
            height: "30px",
          },
          "& .MuiAutocomplete-inputRoot": {
            padding: "0px !important",
            borderRadius: "100px",
            border: 0,
          },
        }}
        onChange={(e, value) => onSelectedValue?.(e,value)}
        renderInput={(params) => (
          <>
            <label className="input-label">{label}{mandatory &&<span className="mandatory-field">*</span>}</label>
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: 0,
                  },
                  "&:hover fieldset": {
                    border: 0,
                  },
                  "&.Mui-focused fieldset": {
                    border: 0,
                  },
                },
              }}
              {...params}
            />
          </>
        )}
        size="small"
      />
    </div>
  );
};
