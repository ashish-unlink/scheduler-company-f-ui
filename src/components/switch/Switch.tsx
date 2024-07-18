import React from "react";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { UserStaffs } from "../../utils/types/responseType";
import FormControlLabel from "@mui/material/FormControlLabel";

export const SwitchBar = ({
  onChange,
  data,
}: {
  onChange: (e: any) => void;
  data: UserStaffs | null;
}) => {
  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 22,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "green",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 18,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "gray",
      opacity: 1,
      transition: {
        duration: 500,
      },
    },
  }));

  return (
    <div>
      <IOSSwitch
        checked={data?.status == "active"}
        name="gilad"
        onChange={(e) => onChange(e)}
      />
    </div>
  );
};
