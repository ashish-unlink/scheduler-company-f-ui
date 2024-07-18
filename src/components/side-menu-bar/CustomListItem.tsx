import React from "react";
import { Button, ListItem, ListItemButton, ListItemIcon, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import translateLabel from "../hooks/translationLable";

const CustomListItem = ({
  text,
  icon,
  to,
  label,
}: {
  text: string;
  icon: React.ReactElement;
  to: string;
  label: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <ListItem
      onClick={() => {
        navigate(to);
      }}
      disablePadding
      sx={{ display: "block" }}
      className={`menu-item ${window.location.pathname === to ? "active" : ""}`}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: "initial",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 3,
            justifyContent: "center",
            color: window.location.pathname === to ? "#AD88C6" : "white",
          }}
        >
          <Tooltip
            title={translateLabel(text)}
            placement="right"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "#AD88C6",
                  "& .MuiTooltip-arrow": {
                    color: "#AD88C6",
                  },
                },
              },
            }}
          >
            <span>
            {icon}
            </span>
          </Tooltip>
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
};

export default CustomListItem;
