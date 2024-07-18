import dayjs from "dayjs";

export const useCurrentYear = () => {
  const currentDate = dayjs();
  const currentYearStartDate = currentDate.startOf("year").format("YYYY-MM-DD");
  const currentYearEndDate = currentDate.endOf("year").format("YYYY-MM-DD");

  return { currentYearStartDate, currentYearEndDate };
};
