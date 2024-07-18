import { useState } from "react";
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
} from "@mui/icons-material";
import BasicPopover from "../custom-popover/BasicPopover";
import "./profileStyle.css";

const MenuRightItems = ({ title, icon, content,direction }: any) => {
  const [openStatus, setOpenStatus] = useState<any>(false);

  return (
    <BasicPopover content={content} setOpenStatus={setOpenStatus} direction={direction}>
      {icon}
      <span className="profile-name">
        {title}
      </span>
      <div className="keyboard-down-arrow-icon">
        {openStatus ? (
          <KeyboardArrowUpOutlined />
        ) : (
          <KeyboardArrowDownOutlined />
        )}
      </div>
    </BasicPopover>
  );
};

export default MenuRightItems;
