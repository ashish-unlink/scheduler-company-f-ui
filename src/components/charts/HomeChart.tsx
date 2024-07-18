import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import translateLabel from "../hooks/translationLable";
import { constantString } from "../../utils/constantString";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const optionsA = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: translateLabel(constantString.TEAM_ENGAGE),
    },
  },
};

export const optionsB = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: translateLabel(constantString.TEAM_SERVICE),
    },
  },
};


export function HomeChart({ data, options }: any) {
  return <Bar options={options} data={data} />;
}
