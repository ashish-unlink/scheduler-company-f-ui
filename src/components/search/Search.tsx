import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { serachProps } from "./type";

export const Search = (props: serachProps) => {
  const { placeholder, handleOnChange, name,value } = props;
  return (
    <TextField
      placeholder={placeholder}
      type="search"
      name={name}
      variant="outlined"
      onFocus={(e)=>e.stopPropagation()}
      fullWidth
      value={value}
      size="small"
      onChange={handleOnChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
             <img src={"/assets/search.png"} alt="icon" width={19} height={19} />
            {/* <SearchIcon /> */}
          </InputAdornment>
        ),
      }}
    />
  );
};
