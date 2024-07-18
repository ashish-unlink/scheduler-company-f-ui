import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CustomPopup from "../../custom-popup/CustomPopup";
import { popupstyle } from "../custom-appointment-popup/style";

export default function CircularLoader() {
  const loaderPopupstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "auto",
    border: "none",
    borderRadius: "1rem",
    p: "0px",
  };

  return (
    <CustomPopup open={true} onClose={() => {}} style={loaderPopupstyle}>
      <CircularProgressBar size={42} />
    </CustomPopup>
  );
}

export const CircularProgressBar = ({ size = 42 }: { size?: number }) => {
  return (
    <CircularProgress
      sx={{
        "&.MuiCircularProgress-colorPrimary": {
          color: "#AD88C6",
        },
      }}
      size={size}
    />
  );
};
