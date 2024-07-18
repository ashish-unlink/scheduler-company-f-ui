import React,{useEffect} from "react";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Badge } from "@mui/material";
import { useAppSelector } from "../../redux";
import { selectTotalAppointmentCount } from "../../redux/appointment/selector";
import { AppointmentCountProps } from "../../utils/types/responseType";

export const SideDateCalender = ({
  onChange,
  dateValue,
  onMonthChangeData,
}: {
  onChange: (val: any) => void;
  dateValue: any;
  onMonthChangeData: (startDate: string, endDate: string) => void;
}) => {
  const appointmentCountData = useAppSelector(selectTotalAppointmentCount);
  const nextMonthStartDate = dayjs()
    .add(1, "month")
    .startOf("month")
    .format("YYYY-MM-DD");
  const nextMonthEndDate = dayjs()
    .add(1, "month")
    .endOf("month")
    .format("YYYY-MM-DD");
  interface ServerDayProps extends PickersDayProps<Dayjs> {
    data: AppointmentCountProps[];
  }

  const ServerDay: React.FC<ServerDayProps> = ({ data, ...props }) => {
    const dateString = props.day.format("YYYY-MM-DD");
    const appointment = data?.find(
      (item) => item.appointmentDate === dateString
    );

    const count = !props?.outsideCurrentMonth
      ? appointment
        ? parseInt(appointment.count)
        : undefined
      : undefined;

    return (
      <Badge
        badgeContent={count}
        color={
          count != undefined ? (count > 0 ? "primary" : "default") : "default"
        }
      >
        <PickersDay {...props} />
      </Badge>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoItem>
        <DateCalendar
          defaultValue={dayjs(new Date())}
          value={dayjs(dateValue)}
          // views={["year", "month", "day"]}
          // disablePast
          onMonthChange={() => {
            // onMonthChangeData(nextMonthStartDate, nextMonthEndDate);
          }}
          sx={{
            "&.MuiDateCalendar-root": {
              width: "100%",

              "&.Mui-disabled": {
                backgroundColor: "#fff",
              },
            },
          }}
          onChange={(val) => {
            onChange(val);
          }}
          slots={{
            day: (props:any) => (
              <ServerDay {...props} data={appointmentCountData} />
            ),
          }}
          showDaysOutsideCurrentMonth={false}
        />
      </DemoItem>
    </LocalizationProvider>
  );
};
