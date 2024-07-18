import react from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import { useAppDispatch, useAppSelector } from "../../redux";
import { Button } from "@mui/material";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import { selectDoubleAppointmentPopup } from "../../redux/appointment/selector";
import { setDoubleAppointmentPopup } from "../../redux/appointment/slice";

const DoubleBookingAllowModal = ({
  onCreateAppointment,
}: {
  onCreateAppointment: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const doubleBooking = useAppSelector(selectDoubleAppointmentPopup);
  const customStyle = {
    position: "absolute",
    top: "20vh",
    left: "37%",
    width: "25%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "1rem",
    boxShadow: 24,
    height: "auto",
    outline: 0,
    padding: "0px 0px 0px 0px",
  };

  return (
    <>
      <CustomPopup open={doubleBooking ? true : false} style={customStyle}>
        <AppointmentPopupHeader
          onClose={() => dispatch(setDoubleAppointmentPopup(null))}
        >
          <b>{doubleBooking?.heading}</b>
        </AppointmentPopupHeader>
        <div className="delete-container">
          <p className="delete-title">
            <span className="delete-title-text">{doubleBooking?.title}</span>
          </p>
      
          <div className="btn-delete-popup">
            <Button
              variant="contained"
              className="contained-btn-design cancel"
              color="secondary"
              onClick={() => dispatch(setDoubleAppointmentPopup(null))}
            >
              Adjust Details
            </Button>
            <Button
              variant="contained"
              className="contained-btn-design confirm"
              onClick={() => {
                onCreateAppointment();
              }}
            >
              Proceed Anyway
            </Button>
          </div>
        </div>
      </CustomPopup>
    </>
  );
};

export default DoubleBookingAllowModal;
