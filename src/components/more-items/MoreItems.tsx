import { IconButton, Menu, MenuItem } from "@mui/material";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import React from "react";
import { MoreActionProps } from "./type";
import { ResponseServiceList } from "../../utils/types/responseType";

const MoreItems = ({
  options,
  item,
  icon = <GridMoreVertIcon />,
  disabled,
}: {
  options: MoreActionProps[];
  item: any;
  icon?: React.ReactElement;
  disabled?: boolean;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {icon}
      </IconButton>
      <Menu
        id="long-menu"
        className="menu-items"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "20ch",
          },
        }}
      >
        {options?.map((option: MoreActionProps, index) => (
          <MenuItem
            key={index}
            // selected={option === "Pyxis"}
            className="action-list-item"
            onClick={(e) => {
              e.stopPropagation();
              option?.onClickHandle(item);
            }}
            // disabled={option?.disabled}
          >
            {option?.icon}
            <p style={{marginLeft:"10px"}}>{option?.name}</p>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreItems;
