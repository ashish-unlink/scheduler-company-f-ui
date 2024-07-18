import { formateTime } from "../../utils/general";
import dayjs from "dayjs";

export const rows = [
  {
    id: 1,
    day: "Monday",
    time: [
      {
        // id: 1,
        startTime: dayjs(),
        endTime: dayjs(),
      },
      {
        // id: 2,
        startTime: dayjs(),
        endTime: dayjs(),
      },
    ],
  },
  {
    id: 2,
    day: "Tuesday",
    time: [
      {
        // id: 1,
        startTime: dayjs(),
        endTime: dayjs(),
      },
    ],
  },
  {
    id: 3,
    day: "Wednesday",
    time: [],
  },
  {
    id: 4,
    day: "Thursday",
    time: [],
  },
  {
    id: 5,
    day: "Friday",
    time: [],
  },
  {
    id: 6,
    day: "Saturday",
    time: [],
  },
  {
    id: 7,
    day: "Sunday",
    time: [],
  },
];
