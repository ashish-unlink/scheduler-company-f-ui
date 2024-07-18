import React, { useEffect, useState } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import {
  setSettingBussinessSetUP,
  setShowTourGuidence,
} from "../../redux/meta/slice";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
  styled,
} from "@mui/material";
import "./toorGuideStyle.css";
import { GrCatalog, GrSchedules } from "react-icons/gr";
import { RiChatSettingsLine } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { PrivatePath } from "../constants/routes.c";
import "./toorGuideStyle.css";
import { selectServiceList } from "../../redux/service/selector";
import { selectEmployeeList } from "../../redux/staff/selector";
import { setShowCategoryModal } from "../../redux/service/slice";
import { setShowAddStaffModal } from "../../redux/staff/slice";
import { setShowCustomerAppointmentModal } from "../../redux/appointment/slice";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { selectDataCounts } from "../../redux/auth/selector";
import translateLabel from "../hooks/translationLable";
import { constantString } from "../../utils/constantString";

const TourGuide = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const serviceList = useAppSelector(selectServiceList);
  const employeeList = useAppSelector(selectEmployeeList);
  const countData = useAppSelector(selectDataCounts);

  useEffect(() => {
    if (countData?.bussinessSetUpDataCount == 0) {
      setCurrent(0);
    } else if (countData?.serviceCount == 0) {
      setCurrent(1);
    } else if (countData?.employeeCount == 0) {
      setCurrent(2);
    } else if (countData?.appointmentCount == 0) {
      setCurrent(3);
    }
  }, [serviceList, employeeList, countData]);

  const customStyle = {
    position: "absolute",
    top: "20vh",
    left: "27%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "none !important",
    borderRadius: "1rem",
    boxShadow: 24,
    height: "auto",
    paddingBottom: "40px",
  };

  const steps = [
    {
      text: "Set up business Profiles",
      onSelect: () => {
        dispatch(setSettingBussinessSetUP(true));
      },
      path: PrivatePath.services,
    },
    {
      text: "Create a category",
      onSelect: () => {
        navigate(PrivatePath.services);
        dispatch(setShowCategoryModal(true));
      },
      path: PrivatePath.services,
    },
    {
      text: "Create a team",
      onSelect: () => {
        navigate(PrivatePath.staff);
        dispatch(setShowAddStaffModal(true));
      },
      path: PrivatePath.staff,
    },
    {
      text: "Create an appointment",
      onSelect: () => {
        navigate(PrivatePath.create);
        dispatch(setShowCustomerAppointmentModal(true));
        dispatch(setShowTourGuidence(false));
      },
      path: PrivatePath.create,
    },
  ];

  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: "#bab7b2",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    ...(ownerState.active && {
      backgroundImage:
        "linear-gradient(136deg, rgb(242, 113, 33) 0%, #FF9800 50%, #FFC107 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundColor: "#25b125",
      // backgroundImage:
      //   'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1:
        countData?.bussinessSetUpDataCount > 0 ? (
          <DoneAllIcon />
        ) : (
          <RiChatSettingsLine fontSize="x-large" />
        ),
      2:
        countData?.serviceCount > 0 ? (
          <DoneAllIcon />
        ) : (
          <GrCatalog fontSize="x-large" />
        ),
      3:
        countData?.employeeCount > 0 ? (
          <DoneAllIcon />
        ) : (
          <HiOutlineUsers fontSize="x-large" />
        ),
      4:
        countData?.appointmentCount > 0 ? (
          <DoneAllIcon />
        ) : (
          <GrSchedules fontSize="x-large" />
        ),
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  return (
    <CustomPopup open={open} style={customStyle}>
      <AppointmentPopupHeader
        onClose={() => {
          dispatch(setShowTourGuidence(false));
        }}
      >
        <b>{translateLabel(constantString.SET_UP_WIZARD)}</b>
      </AppointmentPopupHeader>
      <div className="toor-guidance-wrap">
        <h3 className="tour-title-context">
          Please click on <strong>{steps[current].text.toLowerCase()}</strong>{" "}
          to continue
        </h3>
        <Stepper activeStep={current} alternativeLabel>
          {steps.map(({ text, onSelect }, index) => {
            return (
              <Step
                key={text + "-" + index}
                disabled={current != index}
                onClick={() => (current != index ? {} : onSelect())}
              >
                <StepLabel
                  className="steps-icons"
                  StepIconComponent={ColorlibStepIcon}
                >
                  <Typography className="heading-title" fontWeight={600}>
                    {text}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
    </CustomPopup>
  );
};
export default TourGuide;
