import * as React from "react";
import Popover from "@mui/material/Popover";
import "./basicPopoverStyle.css";

export default function BasicPopover({ children, content ,setOpenStatus,direction }: any) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenStatus(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenStatus(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <button aria-describedby={id} className="profile-button" onClick={handleClick}>
        {children}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction,
        }}
      >
        <div  className="logout-div">{content}</div >
      </Popover>
    </div>
  );
}
