import React, { useEffect, useState } from "react";
import { constantString } from "../../utils/constantString";
import CustomerAppointmentModal from "../custom-appointment-popup/CustomerAppointmentModal";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  resetAppointment,
  setEmployeeLeaveStatus,
  setSelectedAppointmentEditData,
  setSelectedCalenderAppointmentDate,
  setShowCustomerAppointmentModal,
} from "../../redux/appointment/slice";
import { SideDateCalender } from "../side-date-calender/SideDateCalender";
import { useTranslation } from "react-i18next";
import {
  selectAppointmentApiData,
  selectCalenderAppointmentDate,
  selectEmployeeLeaveStatus,
  selectShowCustomerAppointmnetModal,
  selectSuccessedAppointmentData,
  selectTotalAppointmentCount,
} from "../../redux/appointment/selector";
import {
  fetchAppointmentAPI,
  fetchAppointmentCountAPI,
  fetchAppointmentTimeBlockAPI,
} from "../../redux/appointment/action";

import dayjs from "dayjs";
import { AppointmentCountProps } from "../../utils/types/responseType";
import { useNavigate } from "react-router-dom";
import { useCompanyData } from "../hooks/useCompanyData";
import { PrivatePath } from "../constants/routes.c";
import { appointmentStatus } from "../../utils/primtive/status";

export const SideCalender = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const companyId = useCompanyData();
  const appointmentCountData = useAppSelector(selectTotalAppointmentCount);
  const showCustomerAppModal = useAppSelector(
    selectShowCustomerAppointmnetModal
  );
  const navigate = useNavigate();
  const dateValue = useAppSelector(selectCalenderAppointmentDate);
  const currentMonthStartDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const currentMonthEndDate = dayjs().endOf("month").format("YYYY-MM-DD");
  const appointmentCompleted = useAppSelector(selectSuccessedAppointmentData);

  const [currentDateStatus, setCurrentDateStatus] =
    useState<AppointmentCountProps>();

  useEffect(() => {
    const currentStatus = appointmentCountData?.find(
      (i: AppointmentCountProps) =>
        i?.appointmentDate == dayjs(dateValue).format("YYYY-MM-DD")
    );

    setCurrentDateStatus(currentStatus);
  }, [dateValue, appointmentCountData]);

  useEffect(() => {
    onMonthChangeData(currentMonthStartDate, currentMonthEndDate);
  }, [appointmentCompleted]);

  const onMonthChangeData = (startDate: string, endDate: string) => {
    dispatch(
      fetchAppointmentCountAPI({
        companyId,
        appointmentStartDate: startDate,
        appointmentEndDate: endDate,
      })
    );
  };

  return (
    <>
      <button
        className="add-appointment"
        onClick={() => {
          dispatch(setSelectedAppointmentEditData(null));
          dispatch(setShowCustomerAppointmentModal(true));
        }}
      >
        {t(constantString.ADD_NEW)}
      </button>

      <SideDateCalender
        onChange={(val) => {
          dispatch(setEmployeeLeaveStatus([]));
          dispatch(setSelectedCalenderAppointmentDate(val));
          dispatch(
            fetchAppointmentAPI({
              companyId: companyId,
              appointmentDate: dayjs(val).format("YYYY-MM-DD"),
            })
          );
          dispatch(
            fetchAppointmentTimeBlockAPI({
              companyId: companyId,
              date: dayjs(val).format("YYYY-MM-DD"),
            })
          );
        }}
        dateValue={dateValue}
        onMonthChangeData={onMonthChangeData}
      />

      <div className="appointment-status-list">
        <h3>{t(constantString.APPOINTMENT_STATUS)}</h3>
        <ul>
          {currentDateStatus &&
            Object?.entries(currentDateStatus)
              ?.slice(2)
              ?.map(([key, val], index) => {
                return (
                  parseInt(val) > 0 && (
                    <li>
                      <strong>{appointmentStatus[key]?.toUpperCase()}</strong>
                      <span
                        onClick={() => {
                          navigate(
                            `${PrivatePath?.analytics}?dt=${dayjs(
                              dateValue
                            ).format("YYYY-MM-DD")}&status=${key}`
                          );
                        }}
                      >
                        {val}
                      </span>
                    </li>
                  )
                );
              })}
        </ul>
      </div>

      {showCustomerAppModal && (
        <CustomerAppointmentModal
          open={showCustomerAppModal}
          onClose={() => {
            dispatch(resetAppointment());
            dispatch(setShowCustomerAppointmentModal(false));
          }}
        />
      )}
    </>
  );
};
