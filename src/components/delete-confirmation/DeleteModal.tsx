import react from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import { useAppDispatch } from "../../redux";
import { Button } from "@mui/material";
import "./deleteModalStyle.css";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";

const DeleteModal = ({
  open,
  onClose,
  confirmDelete,
  selectedDeleteData,
  subtitle,
  heading,
  title,
}: {
  open: any;
  onClose: (a: boolean) => void;
  confirmDelete: () => void;
  selectedDeleteData?: any;
  subtitle?: string;
  heading: string;
  title: string;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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
      <CustomPopup open={open} style={customStyle}>
        <AppointmentPopupHeader onClose={() => onClose(false)}>
          <b>{heading}</b>
        </AppointmentPopupHeader>
        <div className="delete-container">
          <p className="delete-title">
            {title + " "}
            {selectedDeleteData && (
              <span className="delete-title-text">
                {selectedDeleteData?.title}
              </span>
            )}
            ?
          </p>
          {subtitle && <p className="delete-text"> {subtitle}</p>}
          <div className="btn-delete-popup">
            <Button
              variant="contained"
              className="contained-btn-design cancel"
              color="secondary"
              onClick={() => onClose(false)}
            >
              {t(constantString.CANCEL)}
            </Button>
            <Button
              variant="contained"
              className="contained-btn-design confirm"
              onClick={() => {
                confirmDelete();
              }}
            >
              {t(constantString.CONFIRM)}
            </Button>
          </div>
        </div>
      </CustomPopup>
    </>
  );
};

export default DeleteModal;
