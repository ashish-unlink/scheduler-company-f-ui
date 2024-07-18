import React, { ReactNode, useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./groupSelectStyle.css";
import { ServiceListItem } from "../../utils/types/responseType";
import { Autocomplete, List, TextField, Typography } from "@mui/material";
import { capitilizeName } from "../../utils/general";

interface GroupSelectProps {
  name: string;
  onChange: (e: any, val: ServiceListItem) => void;
  value: any;
  options: any;
  label?: string;
  multiple?: boolean;
  onBlur?: () => void;
  mandatory?:boolean;
  placeholder:string;
  error?:string | boolean | undefined;
  renderOption? : (props: object, option: any) => ReactNode
}

export const GroupSelect = (props: GroupSelectProps) => {
  const { name, onChange, value, options, label, multiple, onBlur, mandatory,placeholder, error, renderOption } = props;
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [gropuedOptions, setGroupedOptions] = useState<any>([]);

  useEffect(() => {
    let temp: any = [];

    options?.forEach((element: any) => {
      element?.svcCtlgItems?.forEach((i: any) => {
        temp?.push({ ...i, categoryTitle: element?.title });
      });
    });

    setGroupedOptions(temp);
  }, [options]);


  return (
    <FormControl fullWidth size="small">
      {label != "" && <label>{label}{mandatory &&<span className="mandatory-field">*</span>}</label>}
      <Autocomplete
        id="grouped-demo"
        options={gropuedOptions}
        groupBy={(op: any) => capitilizeName(op?.categoryTitle)}
        getOptionLabel={(op) => capitilizeName(op?.title)}
        renderInput={(params) => <TextField {...params}  placeholder={placeholder} size="small" />}
        defaultValue={selectedPlan}
        onChange={(e: any, val: any) => {
          setSelectedPlan(val);
          onChange(e, val);
        }}
        renderGroup={(params) => (
          <li key={params.key}>
            <Typography fontWeight={600} sx={{ pl: 2 }}>
              {params.group}
            </Typography>
            <Typography sx={{ pl: 2 }}>{params.children}</Typography>
          </li>
        )}
        {...(renderOption  && {renderOption:(props, option)=>renderOption(props, option)})}
        sx={{
          color: "black",
          "&.MuiOutlinedInput-root ": {
            backgroundColor: "pink",
            width: "100%",
          },
        }}
      />
       {error ? <p className="error-text">{error}</p> : null}
    </FormControl>
  );
};
