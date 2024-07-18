import React from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import QRCode from "react-qr-code";
import { setOpenQrModal } from "../../redux/appointment/slice";
import { useAppDispatch } from "../../redux";
import "./QrCodeStyle.css";
import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

const QrCode = ({ QrCodeLink }: { QrCodeLink: string }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const customStyle = {
    position: "absolute",
    top: "18vh",
    left: "33%",
    transform: "translate(-50%, -50%)",
    width: "35%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "1rem",
    boxShadow: 24,
    overFlowY: "scroll",
    // p: 4,
  };

  return (
    <CustomPopup open={QrCodeLink ? true : false} style={customStyle}>
      <AppointmentPopupHeader
        onClose={() => {
          dispatch(setOpenQrModal(null));
        }}
      >
        <b>{t(constantString.QR_CODE)}</b>
      </AppointmentPopupHeader>

      <div className="qr-code-wrap">
        <QRCode
          value={QrCodeLink}
          className="qr-code"
        />
        <h4>Payment link has been sent successfully on the customer's email.</h4>

        <div className="qr-btn-wrap">
          <Button
            variant="contained"
            onClick={() => {
              // dispatch(resendPaymentLinkAPI({appointmentId:''}));
            }}
            className="payment_btn"
          >
            {t(constantString.RESEND_LINK)}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(QrCodeLink);
            }}
            className="payment_btn"
          >
            {t(constantString.COPY_LINK)}
          </Button>
        </div>
      </div>
    </CustomPopup>
  );
};
export default QrCode;
