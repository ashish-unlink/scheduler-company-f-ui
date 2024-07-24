import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { useAppDispatch, useAppSelector } from "../../redux";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import SearchPopup from "../search-popup/SearchPopup";
import {
  selectShowBusinessSetpModal,
  selectShowSearch,
  selectUserGuidenceModal,
} from "../../redux/meta/selector";
import { UserGuidence } from "../user-guidence/UserGuidence";
import SideBarDrawer from "./SideBarDrawer";
import Header from "./AppBar";
import "./layoutStyle.css";
import { AddFloatingButton } from "../addFloatingButton/AddFloatingButton";
import { setShowCustomerAppointmentModal } from "../../redux/appointment/slice";
import { useNavigate } from "react-router-dom";
import { PrivatePath } from "../constants/routes.c";
import { setSettingBussinessSetUP } from "../../redux/meta/slice";
import { selectServiceList } from "../../redux/service/selector";
import { selectEmployeeList } from "../../redux/staff/selector";
import SetUpBussinessModal from "../set-up-bussiness/SetUpBussinessModal";
import { selectChangeStoreModal } from "../../redux/multi-store/selector";
import { StoreListModal } from "./StoreListModal";

const drawerWidth = 80;

export default function Layout({
  children,
  label,
}: {
  children: React.ReactElement;
  label: string;
}) {
  const userGuidanceModal = useAppSelector(selectUserGuidenceModal);
  const showSearch = useAppSelector(selectShowSearch);
  const settingBussinessSetUp = useAppSelector(selectShowBusinessSetpModal);
  const serviseList = useAppSelector(selectServiceList);
  const employeeList = useAppSelector(selectEmployeeList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const open = useAppSelector(selectChangeStoreModal);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />
      <SideBarDrawer setSettingBussinessSetUP={setSettingBussinessSetUP} />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: "calc(100% - 80px)" }}
      >
        <Toolbar />
        <Typography
          variant="body1"
          fontWeight={500}
          className="action-bar-service-text"
        >
          {label?.toUpperCase()}
        </Typography>
        {children}
      </Box>

      <div className="service-flating-point">
        <AddFloatingButton
          onClick={() => {
            dispatch(setShowCustomerAppointmentModal(true));
            navigate(PrivatePath?.create);
          }}
          title="Add Appointment"
          disabled={serviseList?.length == 0 || employeeList?.length == 0}
        />
        {(serviseList?.length != 0 || employeeList?.length != 0) && (
          <span
            onClick={() => {
              dispatch(setShowCustomerAppointmentModal(true));
              navigate(PrivatePath?.create);
            }}
            className="add-app-span"
          >
            Add Appointment
          </span>
        )}
      </div>

      {showSearch && <SearchPopup open={showSearch} />}

      {userGuidanceModal && <UserGuidence open={userGuidanceModal} />}

      {settingBussinessSetUp && <SetUpBussinessModal open={settingBussinessSetUp} />}
      {open && <StoreListModal />}
    </Box>
  );
}
