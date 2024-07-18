import React from "react";
import { Backdrop, Box, Slide, Modal } from "@mui/material";
import { customModalProps } from "./type";

const CustomPopup = (props:customModalProps) => {
  const { style, open, onClose, children } = props;
 
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      disableAutoFocus={true}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Slide in={open} direction="left" mountOnEnter unmountOnExit>
        <Box sx={style}>{children}</Box>
      </Slide>
    </Modal>
  );
};

export default CustomPopup;
