import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Users } from "../../utils/types/responseType";
import { userName } from "../../utils/general";

interface AppoinmentSelectBoxProps {
  name: string;
  onChange: (e: any) => void;
  options: any;
  label?: string;
  defaultValue?: string | number | object;
  multiple?: boolean;
  onBlur?: () => void;
  placeholder: string;
  error: string | undefined | boolean;
  // value: string | number | (string | number)[];
  disable: boolean;
  value: any;
}

export default function AppointmentSelectBox({
  name,
  onChange,
  value,
  options,
  label,
  defaultValue,
  multiple = false,
  onBlur,
  placeholder,
  disable,
  error,
}: AppoinmentSelectBoxProps) {
  return (
    <FormControl
      sx={{ minWidth: 120, position: "relative" }}
      fullWidth
      size="small"
    >
      {label != "" && <label>{label}</label>}

      <Select
        defaultValue={defaultValue}
        disabled={disable}
        sx={{
          color: "black",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "d4d4d4",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7469B6",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7469B6",
          },
          // "&.Mui-focused .MuiSvgIcon-root ": {
          //   fill: "#7469B6 !important",
          // },
        }}
        name={name}
        value={value || (multiple ? [] : "")}
        onChange={(e) => {
          onChange(e);
        }}
        placeholder={placeholder}
        multiple={multiple}
      >
        {options?.map((item: any, index: number) => {
          return (
            <MenuItem key={index} value={item} className="capitalize">
              {userName(item?.firstName, item?.lastName)}
            </MenuItem>
          );
        })}
      </Select>
      {error ? <p className="error-text">{error}</p> : null}
    </FormControl>
  );
}
