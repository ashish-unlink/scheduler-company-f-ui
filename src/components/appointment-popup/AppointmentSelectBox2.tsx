import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

interface AppoinmentSelectBoxProps {
  name:string;
  onChange:(e:any)=>void;
  options:any;
  label?:string;
  defaultValue?:string | number;
  multiple?:boolean;
  onBlur?:()=>void;
  placeholder:string;
  error?:any ;
  value: any;
  mandatory?:boolean;
}

export default function AppointmentSelectBox2({
  name,
  onChange,
  value,
  options,
  label,
  defaultValue,
  multiple = false,
  onBlur,
  placeholder,
  error,
  mandatory,
}:AppoinmentSelectBoxProps) {
  
  return (
    <FormControl
      sx={{minWidth: 120, position: "relative" }}
      fullWidth
      size="small"
    >
     {label != "" && <label>{label}{mandatory &&<span className="mandatory-field">*</span>}</label>}

      <Select
        defaultValue={defaultValue}
        sx={{
          color: "black",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "d4d4d4",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FF9D0B",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FF9D0B",
          },
          // "&.Mui-focused .MuiSvgIcon-root ": {
          //   fill: "#FF9D0B !important",
          // },
        }}
        name={name}
        value={value}
        onChange={(e) => {          
          onChange(e);
        }}
        placeholder={placeholder}
        multiple={multiple}
      >
        {options?.map((item:any, index:number) => {
          return (
            <MenuItem key={index} value={item?.value}>
              {item?.label}
            </MenuItem>
          );
        })}
      </Select>
      {error ? <p className="error-text">{error}</p> : null}
    </FormControl>
  );
}
