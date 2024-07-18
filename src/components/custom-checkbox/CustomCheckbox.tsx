import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import { Typography, FormControl } from "@mui/material";
import { CustomCheckboxProps } from "./type";
import './checkboxStyle.css';

export default function CustomCheckbox({
  label,
  handleChange,
  value,
  checkboxText,
  name,
}: CustomCheckboxProps) {

  return (
    <FormControl fullWidth size="small">
      <label className="checkbox-input-label">{label}</label>
      <div className="checkbox-text-field">
        <Checkbox
          edge="start"
          name={name}
          tabIndex={-1}
          checked={value}
          onChange={handleChange}
        />
        <Typography>{checkboxText} </Typography>
      </div>
    </FormControl>
  );
}
