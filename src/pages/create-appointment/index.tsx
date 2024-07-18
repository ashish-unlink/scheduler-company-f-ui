import React, { useState, Suspense, lazy, useEffect } from "react";
import Loader from "../../components/loader/Loader";
import "./createAppointmentStyle.css";
import { SideCalender } from "../../components/side-calender/SideCalender";
import { useAppDispatch, useAppSelector } from "../../redux";
import { selectFirstTimeUserGuidence } from "../../redux/meta/selector";
import { setFirstTimeUserGuide } from "../../redux/meta/slice";
import { constantString } from "../../utils/constantString";
import { PrivatePath } from "../../components/constants/routes.c";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppointmentCountProps } from "../../utils/types/responseType";
import { selectCalenderAppointmentDate } from "../../redux/appointment/selector";

const CustomScheduler = lazy(
  () => import("../../components/custom-scheduler/CustomScheduler")
);

const CreateAppointment = () => {
  const firstTimeUserGuide = useAppSelector(selectFirstTimeUserGuidence);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (firstTimeUserGuide?.appointment) {
      dispatch(
        setFirstTimeUserGuide({ ...firstTimeUserGuide, appointment: false })
      );
    }
  }, []);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const dateValue = useAppSelector(selectCalenderAppointmentDate);
  return (
    <Suspense fallback={<Loader />}>
      <div className="calender-wrap">
        <div className="side-calender">
          <SideCalender />
        </div>

        <div className="scheduler-container">
          <CustomScheduler />
        </div>
      </div>
    </Suspense>
  );
};

export default CreateAppointment;
