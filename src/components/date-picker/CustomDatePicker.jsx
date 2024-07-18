import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarIcon } from "@mui/x-date-pickers";

export default function CustomDatePicker({ currentDate,setCurrentDate }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div onClick={() => setOpen(!open)}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          slotProps={{
            textField: {
              size: "small",
              InputProps: {
                endAdornment: <></>,
                startAdornment: (
                  <CalendarIcon
                    style={{ color: "gray", marginRight: "3rem" }}
                  />
                ),
              },
            },
          }}
          label=""
          value={currentDate}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          onChange={(newValue) => {
            // onChange(newValue);
            setCurrentDate(newValue);
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
