import React, { useEffect } from "react";
import "./stats.css";
import { ImStatsBars2 } from "react-icons/im";
import { FiUsers } from "react-icons/fi";
import { LuIndianRupee } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useAppSelector } from "../../redux";
import { selectAppointmentApiData } from "../../redux/appointment/selector";
import {
  ResponseAppointment,
  UserStaffs,
  Users,
} from "../../utils/types/responseType";
import { GrSchedules } from "react-icons/gr";
import { HiOutlineUsers } from "react-icons/hi2";
import { selectEmployeeList } from "../../redux/staff/selector";
import dayjs from "dayjs";
import { selectCustomerData } from "../../redux/users/selector";
import translateLabel from "../hooks/translationLable";
import { constantString } from "../../utils/constantString";
import { MdCurrencyYen } from "react-icons/md";

export default function Stats() {
  const appointmentData = useAppSelector(selectAppointmentApiData);
  const customerList = useAppSelector(selectCustomerData);

  const getTotalSales = () => {
    let count = 0;
    appointmentData?.map((i: ResponseAppointment) => {
      if (i?.status == "pending" || i?.status == "completed") {
        count = count + parseInt(i?.priceFinal);
      }
    });
    return count;
  };

  const getCancelPrice = () => {
    let count = 0;
    appointmentData?.map((i: ResponseAppointment) => {
      if (i?.status == "canceled") {
        count = count + parseInt(i?.priceFinal);
      }
    });
    return count;
  };

  const getNewCustomer = () => {
    let count = 0;
    customerList?.map((i: Users) => {
      if (i?.createdAt) {
        const isToday = dayjs(i?.createdAt).isSame(dayjs(), "day");
        if (isToday) {
          count = count + 1;
        }
      }
    });
    return count;
  };

  const dashboardData = [
    {
      icon: <MdCurrencyYen />,
      count: getTotalSales(),
      title: translateLabel(constantString.TODAYS_SALE),
      color: "green",
    },
    {
      icon: <MdCurrencyYen />,
      count: getCancelPrice(),
      title: translateLabel(constantString.TODAYS_CANCEL),
      color: "red",
    },
    {
      icon: <HiOutlineUsers />,
      count: getNewCustomer(),
      title: translateLabel(constantString.TODAYS_CUSTOMER),
      color: "orange",
    },
    {
      icon: <GrSchedules />,
      count: appointmentData?.length,
      title: translateLabel(constantString.TODAYS_APPOINTMENT),
      color: "blue",
    },
  ];

  return (
    <>
      <div className="stats-wrap">
        {dashboardData?.map((item) => {
          return (
            <div className="stats-list">
              <a className={`dashboard-stat ${item?.color}`} href="#">
                <div className="visual">{item?.icon}</div>
                <div className="details">
                  <div className="number">
                    <span>{item?.count}</span>
                  </div>
                  <div className="desc">{item?.title}</div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}
