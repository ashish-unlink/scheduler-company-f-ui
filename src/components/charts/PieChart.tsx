import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useAppSelector } from "../../redux";
import {
  selectAppointmentApiData,
  selectCreateAppData,
} from "../../redux/appointment/selector";
import translateLabel from "../hooks/translationLable";
import { constantString } from "../../utils/constantString";

let appStatusG: any = [];

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: translateLabel(constantString.TODAYS_APPOINTMENT),
    },
  },
};

const showAppointmentStatus = (appointmentData: any) => {
  let appStatus: any = { completed: 0, pending: 0, canceled: 0 };

  appointmentData?.map((item: any, key: any) => {
    appStatus[item?.status] = appStatus[item?.status] + 1;
  });

  appStatusG = appStatus;
};

export const PieChart = () => {  
  const appointmentData = useAppSelector(selectAppointmentApiData);

  useEffect(() => {
    showAppointmentStatus(appointmentData);
  }, [appointmentData]);

  const PieData = {
    labels: [translateLabel(constantString.COMPLETED), translateLabel(constantString.UPCOMING), translateLabel(constantString.CANCELLED)],
    datasets: [
      {
        label: "# of Appointments",
        data: [
          appStatusG["completed"],
          appStatusG["pending"],
          appStatusG["canceled"],
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return  <Pie options={options} data={PieData} />  
};
