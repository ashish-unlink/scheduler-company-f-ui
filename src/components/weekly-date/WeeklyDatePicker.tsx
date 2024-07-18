import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { useNavigate } from "react-router-dom";
import { PrivatePath } from "../constants/routes.c";
import { getNextPreviousWeekDate } from "../../utils/general";
import { DatePicker } from "@mui/x-date-pickers";
import "./weeklyDatePickerStyle.css";

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isSelected: boolean;
  isHovered: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary[theme.palette.mode],
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary[theme.palette.mode],
    },
  }),
  ...(day.day() === 0 && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(day.day() === 6 && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
})) as React.ComponentType<CustomPickerDayProps>;

const isInSameWeek = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isSame(dayB, "week");
};

function Day(
  props: PickersDayProps<Dayjs> & {
    selectedDay?: Dayjs | null;
    hoveredDay?: Dayjs | null;
  }
) {
  const { day, selectedDay, hoveredDay, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

export const WeeklyDatePicker = () => {
  const [hoveredDay, setHoveredDay] = React.useState<Dayjs | null>(null);
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [selectedWeekDates, setSelectedWeekDates] = React.useState<Dayjs>(
    dayjs()
  );

  const navigate = useNavigate();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        slotProps={{
          day: (ownerState: any) =>
            ({
              selectedDay: selectedWeekDates,
              hoveredDay,
              onPointerEnter: () => setHoveredDay(ownerState.day),
              onPointerLeave: () => setHoveredDay(null),
            } as any),
        }}
        slots={{ day: Day }}
        showDaysOutsideCurrentMonth
        onChange={(newValue: any) => {
          if (newValue) {
            const { monday, sunday } = getNextPreviousWeekDate(newValue);
            navigate(`${PrivatePath?.staff}?dtRange=[${monday},${sunday}]`);
            setSelectedWeekDates(newValue);
          }
        }}
        displayWeekNumber
        openTo="day"
        className="weekly-date-picker"
      />
    </LocalizationProvider>
  );
};
