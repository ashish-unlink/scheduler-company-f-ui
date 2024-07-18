import dayjs from "dayjs";
import React from "react";

export const useCurrentMonth = () => {
  const currentDate = dayjs();
  const currentMonthStartDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const currentMonthEndDate = dayjs().endOf("month").format("YYYY-MM-DD");

  return { currentMonthStartDate, currentMonthEndDate };
};
