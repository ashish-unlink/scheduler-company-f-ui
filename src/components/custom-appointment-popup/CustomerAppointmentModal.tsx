import { useState } from "react";
import { popupstyle } from "./style";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import "./appointmentStyle.css";
import CustomPopup from "../../custom-popup/CustomPopup";
import { useAppDispatch, useAppSelector } from "../../redux";
import CustomerSection from "./CustomerSection";
import { AppointmentSection } from "./AppointmentSection";
import { useTranslation } from "react-i18next";
import AddCustomer from "../custom-scheduler/components/CustomerDetails";
import AppointmentHistoryModal from "../appointment-history/AppointmentHistory";
import { selectAppointmentHistory } from "../../redux/appointment/selector";

const CustomerAppointmentModal = ({ open, onClose }: any) => {
  const { t } = useTranslation();
  const [errorState, setErrorState] = useState<string>("");
  const openAppointmentHistory = useAppSelector(selectAppointmentHistory);

  return (
    <>
      <CustomPopup open={open} onClose={onClose} style={popupstyle}>
        <AppointmentPopupHeader onClose={onClose}>
          <div className="date-picker-modal">
            <h3>Schedule an Appointment</h3>
          </div>
        </AppointmentPopupHeader>

        <div className="popup-wrapper">
          <div className="appointment-popup-fields-div">
            {/* left section */}
            <CustomerSection errorState={errorState} />

            {/* Right Section */}
            <AppointmentSection setErrorState={setErrorState} />
          </div>
        </div>
      </CustomPopup>

      {openAppointmentHistory && (
        <AppointmentHistoryModal open={openAppointmentHistory} />
      )}
      {/*  Add Customer  Popup */}
      {/* {openAddCustomerPopup &&  */}
      {/* <AddCustomer /> */}
      {/* } */}
    </>
  );
};

export default CustomerAppointmentModal;
