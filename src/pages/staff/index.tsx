import React, { useState } from "react";
import { constantString, staffOptionsValue } from "../../utils/constantString";
import ManageStaff from "../../components/manage-staff/ManageStaff";
import { SchedulerData } from "../../components/scheduler/SchedulerData";
import "./staffStyle.css";
import { Button } from "@mui/material";
import {
  setShowAddStaffModal,
} from "../../redux/staff/slice";
import { useAppDispatch, useAppSelector } from "../../redux";
import AddStaffModal from "../../components/add-staff/AddStaffModal";
import {
  selectshowAddStaffModal,
} from "../../redux/staff/selector";
import { useTranslation } from "react-i18next";
import { NavBar } from "../../components/nav-bar/NavBar";

const Staff = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useAppDispatch();
  const showAddStaffModal = useAppSelector(selectshowAddStaffModal);
  const { t } = useTranslation();
  const options = [
    {
      label: "Manage Team",
      component: <ManageStaff />,
      value: staffOptionsValue?.manage_staff,
    },
    {
      label: "Team Schedule",
      component: <SchedulerData />,
      value: staffOptionsValue?.scheduler,
    },
  ];

  return (
    <>
      <div className="container">
        <NavBar
          leftPart={
            <div style={{ width: "80%" }}>
              {/* <MenuTabs
                options={options}
                onChangeTab={(val) => {
                  setSelectedTab(val);
                }}
              /> */}
              <p className="tab-text">{t(constantString.MANAGE_STAFF)}</p>
            </div>
          }
          rightPart={
            <div className="staff-btn">
              <Button
                variant="outlined"
                className="outline-btn"
                onClick={() => {
                  dispatch(setShowAddStaffModal(true));
                }}
              >
                {t(constantString.ADD_STAFF)}
              </Button>
            </div>
          }
          callingFrom="staff"
        />

        {/* {options[selectedTab]?.component} */}
        <ManageStaff />
      </div>
      {showAddStaffModal && <AddStaffModal open={showAddStaffModal} />}
    </>
  );
};

export default Staff;
