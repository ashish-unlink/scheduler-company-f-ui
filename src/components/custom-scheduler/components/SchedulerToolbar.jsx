import React from "react";
import StyledToolbarFlexibleSpace from "./StyledToolbarFlexibleSpace";
import { classes } from "./classes";
import "./style.css";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import CustomDatePicker from "../../date-picker/CustomDatePicker";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { constantString } from "../../../utils/constantString";

const SchedulerToolbar = ({
  setOpenPopup,
  props,
  currentDate,
  setCurrentDate,
}) => {
  const { t } = useTranslation();
  return (
    <div className="toolbar-div">
      <div className="flex-box">
        <button className="add-new gray-border">
          {" "}
          TODAY
        </button>
        <button className="add-new gray-border color-black">
          {" "}
          <KeyboardArrowLeft
            onClick={() => {
              setCurrentDate(dayjs(currentDate).subtract(1, "day"));
            }}
          />{" "}
        </button>
        <CustomDatePicker
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
        <button className="add-new gray-border color-black">
          {" "}
          <KeyboardArrowRight
            onClick={() => {
              setCurrentDate(dayjs(currentDate).add(1, "day"));
            }}
          />{" "}
        </button>
      </div>
      <StyledToolbarFlexibleSpace {...props} className={classes.flexibleSpace}>
        <div className={classes.flexContainer}>
          <img src={"/assets/search.png"} alt="search-icon" />
          <button className="add-new" onClick={() => setOpenPopup(true)}>
            {t(constantString.ADD_NEW)}
          </button>
        </div>
      </StyledToolbarFlexibleSpace>
    </div>
  );
};

export default SchedulerToolbar;
