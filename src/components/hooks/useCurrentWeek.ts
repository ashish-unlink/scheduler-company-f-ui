import dayjs from "dayjs";

export const useCurrentWeek = () => {
  const currentDate = dayjs();
  const monday = currentDate.startOf("week").format("YYYY-MM-DD");
  const sunday = currentDate.endOf("week").format("YYYY-MM-DD");

  return { monday, sunday };
};
