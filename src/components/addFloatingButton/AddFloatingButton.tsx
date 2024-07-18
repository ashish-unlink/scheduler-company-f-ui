import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import "./floatingButtonStyle.css";

export const AddFloatingButton = ({
  onClick,
  type,
  title,
  width = "27px",
  height = "27px",
  disabled,
}: {
  onClick: () => void;
  type?: string;
  title: string;
  width?: string;
  height?: string;
  disabled?: boolean;
}) => {
  return (
    <Tooltip title={title} placement="bottom">
      <Button
        className={
         ` ${type == "border-btn"  ? "border-design-btn" : "add-btn-assign"} ${disabled && "float-btn-disable"}`
        }
        onClick={() => onClick()}
        sx={{
          width: { width },
          height: { height },
        }}
        disabled = {disabled}
      >
        +
      </Button>
    </Tooltip>
  );
};
