import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { DropDownUserProps, MultiSelectAutoCompleteProps } from "./type";
import InputAdornment from "@mui/material/InputAdornment";
import "./userListDropdownStyle.css";
import Checkbox from "@mui/material/Checkbox";
import { capitilizeName } from "../../utils/general";

export const UserListDropDown = (props: DropDownUserProps) => {
  const {
    label,
    icon,
    option,
    placeholder,
    value,
    renderOption,
    renderFilterOptions,
    mandatory,
    error,
  } = props;

  return (
    <div>
      {label && (
        <p className="label-text">
          {label}
          {mandatory && <span className="mandatory-field">*</span>}
        </p>
      )}
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={option}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            InputProps={{
              ...params.InputProps,
              type: "search",
              startAdornment: (
                <InputAdornment position="start">
                  <img src={icon} alt="icon" width={19} height={19} />
                </InputAdornment>
              ),
            }}
            placeholder={placeholder}
          />
        )}
        renderOption={(props, options) => renderOption(props, options)}
        filterOptions={(options, params) =>
          renderFilterOptions(options, params)
        }
      />
        {error ? <p className="search-error-text">{error}</p> : null}
    </div>
  );
};

export const MultiSelectAutoComplete = (
  props: MultiSelectAutoCompleteProps
) => {
  const {
    label,
    option,
    placeholder,
    value,
    id,
    defaultValue,
    multiple,
    onChange,
    disabled,
    mandatory,
    onBlur,
    error,
  } = props;

  return (
    <React.Fragment>
      {label && (
        <label className="appointment-input-label">
          {label}
          {mandatory && <span className="mandatory-field">*</span>}
        </label>
      )}
      <Autocomplete
        sx={{
          color: "black",
          "&.MuiOutlinedInput-root ": {
            backgroundColor: "pink",
            width: "100%",
          },
        }}
        value={value}
        // defaultValue={defaultValue}
        multiple={multiple}
        // id="checkboxes-tags-demo"
        id={id}
        disableCloseOnSelect={multiple}
        options={option}
        disabled={disabled}
        onChange={onChange}
        getOptionLabel={(option) => capitilizeName(option.title)}
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} size="small" />
        )}
        onBlur={onBlur}
        {...(multiple && {
          renderOption: (props, op: any, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {capitilizeName(op.title)}
            </li>
          ),
        })}
       
      />
      {error ? <p className="error-text">{error}</p> : null}
    </React.Fragment>
  );
};
