import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl } from "@mui/material";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";

interface TimePickerProps {
  label?: string;
  value: Dayjs;
  name: string;
  onChange: (e: any) => void;
  disable?: boolean;
  minTime?: Dayjs;
  maxTime?:Dayjs;
  mandatory?: boolean;
  onBlur?: (e: any) => void;
  error?: any;
  timeSteps?: boolean;
  ampm?:boolean;
}

export const TimePicker = ({
  value,
  name,
  onChange,
  disable,
  label,
  minTime,
  maxTime,
  mandatory,
  error,
  onBlur,
  ampm=false,
  timeSteps
}: TimePickerProps) => {
  
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormControl fullWidth size="small">
          {label && (
            <label>
              {label}
              {mandatory && <span className="mandatory-field">*</span>}
            </label>
          )}

          <DesktopTimePicker
            ampmInClock={false}
            ampm={ampm}
            name={name}
            disabled={disable}
            onChange={onChange}
            value={dayjs(value)}
            minTime={minTime}
            maxTime={maxTime}
            slotProps={{ textField: { size: "small", fullWidth: true }, field:{readOnly: true} }}
            {...timeSteps && {timeSteps:{minutes : 5}}}
          />

          {error ? <p className="error-text">{error}</p> : null}
        </FormControl>
      </LocalizationProvider>
    </>
  );
};
