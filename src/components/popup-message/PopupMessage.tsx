import React from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import { customerSendSuccessfully } from "../custom-appointment-popup/style";
import { Button, Typography } from "@mui/material";

export const PopupMessage = ({
  open,
  onClose,
  heading,
  title,
}: {
  open: boolean;
  onClose: () => void;
  heading: string;
  title: string;
}) => {
  return (
    <CustomPopup
      open={open}
      onClose={() => onClose()}
      style={customerSendSuccessfully}
    >
      <div className="welcome-wrap">
        <Typography variant="h4">{heading}</Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          {title}
        </Typography>
        <Button
          onClick={() => {
            onClose();
          }}
          variant="contained"
          className="done-btn"
        >
          Done
        </Button>
      </div>
    </CustomPopup>
  );
};
