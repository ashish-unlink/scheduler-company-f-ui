import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import ListSubheader from "@mui/material/ListSubheader";
import { ServiceListItem } from "../../utils/types/responseType";

export const MultiSelectInput = ({
  name,
  onChange,
  value,
  options,
}: {
  name: string;
  onChange: (e: any) => void;
  value: ServiceListItem[];
  options: string[];
}) => {
  

  const renderSelectGroup = (product: any) => {
    const items = product?.svcCtlgItems?.map((p: any, index: number) => {
      return (
        <MenuItem key={index} value={p} className="menu-option-text">
          {p.title}
        </MenuItem>
      );
    });

    return [
      <ListSubheader className="option-grp">
        {product.title.toUpperCase()}
      </ListSubheader>,
      items,
    ];
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        name={name}
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value, index) => (
              <Chip key={index} label={value?.title} />
            ))}
          </Box>
        )}
      >
        {options?.map((p: any) => renderSelectGroup(p))}
      </Select>
    </FormControl>
  );
};
