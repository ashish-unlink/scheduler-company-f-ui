import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {  constantString, } from "../../utils/constantString";
import { useTranslation } from 'react-i18next';
export default function CustomSelect({ theropist, selectedTheropist, setSelectedThreopist }) {

  const handleChange = (event) => {
    setSelectedThreopist(event.target.value);
    const { t } = useTranslation();
  };

  return (
    <FormControl
      sx={{ m: 1, minWidth: 120, position: "relative" }}
      size="small"
    >
      {!selectedTheropist && (
        <label
          style={{ position: "absolute", top: 12, left: 10, fontSize: "10px" }}
        >
        {t(constantString.SELECT_THERAPIST)}
        </label>
      )}
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={selectedTheropist}
        onChange={handleChange}
      >
        <MenuItem value="">
        </MenuItem>
        {theropist?.map((item, index) => {
          return (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
