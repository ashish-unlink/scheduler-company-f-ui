import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FormControl } from "@mui/material";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import { TimePickerProps } from "@mui/x-date-pickers/TimePicker";

interface AppointmentTimePickerProps {
  name: string;
  label: string;
  value: object;
  onChange: (value: any) => void;
  error?: string;
  disable?: boolean;
  appointmentData: any;
}

const AppointmentTimepicker = ({
  name,
  label,
  value,
  onChange,
  error,
  disable,
  appointmentData,
}: AppointmentTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl fullWidth size="small">
        <label>{label}</label>
        <TimePicker
          ampm={false}
          timeSteps={{ minutes: 30 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#d4d4d4",
              },
              "&:hover fieldset": {
                borderColor: "#7469B6",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#7469B6",
              },
            },
          }}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
          disabled={disable}
          name={name}
          // value={dayjs(value)}
          value={value}

          onChange={(newValue: any) => onChange(newValue)}
         
        />
        {error ? <p className="error-text">{error}</p> : null}
      </FormControl>
    </LocalizationProvider>
  );
};

export default AppointmentTimepicker;
