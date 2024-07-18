import React from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import {  setShowUserGuidence } from "../../redux/meta/slice";
import { useAppDispatch } from "../../redux";
import "./userGuidenceStyle.css";
import Group61 from "../assets/Group61.png";
import Group62 from "../assets/Group62.png";
import Group63 from "../assets/Group63.png";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PrivatePath } from "../constants/routes.c";

export const UserGuidence = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const customStyle = {
    position: "absolute",
    top: "11vh",
    left: "18%",
    bottom: "5vh",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "none !important",
    borderRadius: "1rem",
    boxShadow: 24,
    // p: 4,
  };

  return (
    <CustomPopup open={open} style={customStyle}>
      <AppointmentPopupHeader
        onClose={() => {
          dispatch(setShowUserGuidence(false));
        }}
      >
        <b>Setup Companion: Your Detailed Instruction Manual</b>
      </AppointmentPopupHeader>
      <div className="user-guidance-wrap">
        <img src={Group61} />
        <img src={Group62} />
        <img src={Group63} />
      </div>
    </CustomPopup>
  );
};
