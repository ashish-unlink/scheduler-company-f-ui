import React from "react";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import CustomPopup from "../../custom-popup/CustomPopup";
import { setShowGuiderModal } from "../../redux/meta/slice";
import { useAppDispatch } from "../../redux";
import { GuiderProps } from "./type";
import { Button, Typography } from "@mui/material";
import "./guiderModalStyle.css";
import tick from "../../assets/tick-icon-png-20.png";
import { useNavigate } from "react-router-dom";

export const GuiderModal = ({ open, data }: GuiderProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const customStyle = {
    position: "absolute",
    top: "22vh",
    left: "29%",
    transform: "translate(-50%, -50%)",
    width: "41%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "1rem",
    boxShadow: 24,
  };

  return (
    <CustomPopup open={open} style={customStyle}>
      <AppointmentPopupHeader
        onClose={() => {
          dispatch(setShowGuiderModal(false));
        }}
      >
        <b>{data?.title}</b>
      </AppointmentPopupHeader>
      <div className="guidance-wrap">
        <img src={tick} className="tick-icon-img" alt="" />
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: "center" }}>
          Great Job!
        </Typography>
        <Typography
          sx={{ textAlign: "center", marginTop: "10px", padding: "0px 15px" }}
        >
          {data?.text}
        </Typography>
        {data?.note && (
          <Typography
            sx={{ textAlign: "center", marginTop: "10px", padding: "0px 15px" }}
          >
            <span className="note">Note : </span>
            {data?.note}
          </Typography>
        )}
        <div className="btn-group-wrap">
          {data?.btnGroup?.repeat && (
            <Button
              variant="contained"
              color="warning"
              onClick={() => data?.btnGroup?.["repeat"]?.onClick(navigate)}
              sx={{ width: "40%" }}
            >
              {data.btnGroup?.["repeat"]?.name}
            </Button>
          )}
          <Button
            variant="contained"
            color="warning"
            sx={{ width: "40%" }}
            onClick={() => data?.btnGroup?.["procced"]?.onClick(navigate)}
          >
            {data.btnGroup?.["procced"]?.name}
          </Button>
        </div>
      </div>
    </CustomPopup>
  );
};
