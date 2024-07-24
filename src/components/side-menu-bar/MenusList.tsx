import React from "react";
import CreateAppointment from "../../pages/create-appointment";
import Home from "../../pages/home";
import Services from "../../pages/services";
import Staff from "../../pages/staff";
import { PrivatePath } from "../constants/routes.c";
import { constantString } from "../../utils/constantString";
import { RxDashboard } from "react-icons/rx";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineUsers } from "react-icons/hi2";
import { RiUserSettingsLine } from "react-icons/ri";
import { AiOutlineSchedule } from "react-icons/ai";
import { GrSchedules } from "react-icons/gr";
import { SlGraph } from "react-icons/sl";
import { GrCatalog } from "react-icons/gr";
import AnalyticsReport from "../../pages/analytic-report";
import { Attendence } from "../../pages/attendence";
import translateLabel from "../hooks/translationLable";
import CustomerDetails from "../../pages/customer-details";
import { LuUserPlus2 } from "react-icons/lu";
import PosIframe from "../../pages/pos";
import { TbDeviceDesktopDollar } from "react-icons/tb";
import { LiaStoreSolid } from "react-icons/lia";
import ManageStores from "../../pages/manage-stores";

interface MenuListProps {
  text: string;
  icon: React.ReactElement;
  to: string;
  Component: any;
  label: string;
}

const MenusList: MenuListProps[] = [
  {
    text:constantString?.SCHEDULER_DASHBOARD,
    icon: <RxDashboard />,
    to: PrivatePath.home,
    Component: Home,
    label:constantString?.SCHEDULER_DASHBOARD,
  },
  {
    text: constantString.CALENDER,
    icon: <GrSchedules />,
    to: PrivatePath.create,
    Component: CreateAppointment,
    label: constantString.CALENDER,
  },
  {
    text:  constantString.CATALOGUE,
    icon: <GrCatalog />,
    to: PrivatePath.services,
    Component: Services,
    label:  constantString.CATALOGUE,
  },

  {
    text: constantString.TEAM,
    icon: <HiOutlineUsers />,
    to: PrivatePath.staff,
    Component: Staff,
    label: constantString.TEAM,
  },
  {
    text: constantString.CUSTOMER_DETAILS,
    icon: <LuUserPlus2 />,
    to: PrivatePath.customerDetails,
    Component: CustomerDetails,
    label: constantString.CUSTOMER_DETAILS,
  },
  {
    text: constantString.ATTENDENCE,
    icon: <AiOutlineSchedule />,
    to: PrivatePath.attendence,
    Component: Attendence,
    label: constantString.ATTENDENCE,
  },
  {
    text:constantString.ANALYTICS_REPORT,
    icon: <SlGraph />,
    to: PrivatePath.analytics,
    Component: AnalyticsReport,
    label:constantString.ANALYTICS_REPORT,
  },
  {
    text: constantString.MULTI_STORE,
    icon: <LiaStoreSolid />,
    to: PrivatePath.manageStores,
    Component: ManageStores,
    label: constantString.MULTI_STORE,
  },
  // {
  //   text: "Point of Sale",
  //   icon: <TbDeviceDesktopDollar />,
  //   to: PrivatePath.pos,
  //   Component: PosIframe,
  //   label: "Point of Sale",
  // },
];

export default MenusList;
