import React, { useEffect, useState, useMemo } from "react";

import "./manageStaffStyle.css";
import { StaffStatus } from "../staff-status/StaffStatus";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  fetchEmployeeData,
  fetchEmployeeServiceRelationData,
} from "../../redux/staff/action";
import { StaffInfo } from "../staff-info/StaffInfo";
import {
  selectEmployeeList,
  selectEmployeeLoading,
  selectServiceEmployeeRelationList,
} from "../../redux/staff/selector";
import {
  setSelectedStaffDetail,
  setShowViewStaffModal,
} from "../../redux/staff/slice";
import {
  setFirstTimeUserGuide,
  setShowGuiderModal,
} from "../../redux/meta/slice";
import { GuiderModal } from "../guider-modal/GuiderModal";
import {
  selectFirstTimeUserGuidence,
  selectGuidenceModal,
} from "../../redux/meta/selector";
import {
  firstStaffServiceAssignSuccessData,
  firstStaffSuccessData,
} from "../guider-modal/data";
import { selectShowCustomerAppointmnetModal } from "../../redux/appointment/selector";
import AddCategoryModal from "../add-category/AddCategoryModal";
import CustomerAppointmentModal from "../custom-appointment-popup/CustomerAppointmentModal";
import {
  resetAppointment,
  setShowCustomerAppointmentModal,
} from "../../redux/appointment/slice";
import { useCompanyData } from "../hooks/useCompanyData";
import { useSearchParams } from "react-router-dom";
import { UserStaffs } from "../../utils/types/responseType";

export default function ManageStaff() {
  const employeeList = useAppSelector(selectEmployeeList);
  const company_id = useCompanyData();
  const showGuidenceModal = useAppSelector(selectGuidenceModal);
  const staffServiceList = useAppSelector(selectServiceEmployeeRelationList);
  const showAppointmentModal = useAppSelector(
    selectShowCustomerAppointmnetModal
  );
  const isLoading = useAppSelector(selectEmployeeLoading);
  const dispatch = useAppDispatch();
  const firstTimeUserGuide = useAppSelector(selectFirstTimeUserGuidence);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("employee")) {
      const data = employeeList?.find((i: UserStaffs) => {
        return i?.id == searchParams?.get("employee");
      });
      dispatch(setShowViewStaffModal(null));
      dispatch(setSelectedStaffDetail(data));
      dispatch(
        fetchEmployeeServiceRelationData({
          companyId: company_id,
          employeeId: data?.id,
        })
      );
    } else {
      dispatch(setSelectedStaffDetail(employeeList?.[0]));
      dispatch(
        fetchEmployeeServiceRelationData({
          companyId: company_id,
          employeeId: employeeList?.[0]?.id,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (
      !isLoading &&
      employeeList?.length == 1 &&
      (staffServiceList?.length == 0 ||
        staffServiceList?.length == undefined) &&
      firstTimeUserGuide.staff
    ) {
      dispatch(setShowGuiderModal(true));
      dispatch(setFirstTimeUserGuide({ ...firstTimeUserGuide, staff: false }));
      dispatch(setSelectedStaffDetail(employeeList?.[0]));
    }
  }, [isLoading, employeeList, staffServiceList]);

  return (
    <div className="manage-staff-container">
      <StaffStatus />
      <StaffInfo />

      {showGuidenceModal && (
        <GuiderModal
          open={showGuidenceModal}
          data={
            firstTimeUserGuide.serviceAssign
              ? firstStaffSuccessData
              : firstStaffServiceAssignSuccessData
          }
        />
      )}

      {showAppointmentModal && (
        <CustomerAppointmentModal
          open={showAppointmentModal}
          onClose={() => {
            dispatch(resetAppointment());
            dispatch(setShowCustomerAppointmentModal(false));
          }}
        />
      )}
    </div>
  );
}
