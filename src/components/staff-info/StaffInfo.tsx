import React, { useEffect, useState } from "react";
import "./staffInfoStyle.css";
import { constantString, staffOptionsValue } from "../../utils/constantString";
import MenuTabs from "../tabs/MenuTabs";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  ResponseServiceList,
  ResponseServiceStaffRelation,
} from "../../utils/types/responseType";
import { StaffDetails } from "../staff-details/StaffDetails";
import { selectServiceList } from "../../redux/service/selector";
import AccordionList from "../accordian/Accordion";
import { useTranslation } from "react-i18next";
import { EmptyView } from "../empty-view/EmptyView";
import notFoundImage from "../assets/not-found.png";
import { setShowSubCategoryModal } from "../../redux/service/slice";
import {
  selectEmployeeList,
  selectSelectedStaffDetails,
  selectServiceEmployeeRelationList,
  selectShowAssignModal,
  selectStaffServiceDelete,
} from "../../redux/staff/selector";
import Button from "@mui/material/Button";
import { StaffServiceList } from "../staff-service-list/StaffServiceList";
import Tooltip from "@mui/material/Tooltip";
import {
  setShowAddStaffModal,
  setShowAssignServiceModal,
  setStaffServiceDelete,
} from "../../redux/staff/slice";
import AssignServiceModal from "../assign-service-modal/AssignServiceModal";
import DeleteModal from "../delete-confirmation/DeleteModal";
import { deleteServiceStaffRelation } from "../../redux/staff/action";
import { GuiderModal } from "../guider-modal/GuiderModal";
import {
  selectFirstTimeUserGuidence,
  selectGuidenceModal,
} from "../../redux/meta/selector";
import { firstStaffServiceAssignSuccessData } from "../guider-modal/data";
import {
  setFirstTimeUserGuide,
  setShowGuiderModal,
} from "../../redux/meta/slice";
import { StaffSchedule } from "../staff-schedule/StaffSchedule";
import { AddFloatingButton } from "../addFloatingButton/AddFloatingButton";
import { WeeklyDatePicker } from "../weekly-date/WeeklyDatePicker";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { getFormattedDate } from "../../utils/general";
import { useCurrentWeek } from "../hooks/useCurrentWeek";
import CommissionView from "../commission/Commission";
import translateLabel from "../hooks/translationLable";

export const StaffInfo = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const serviceData = useAppSelector(selectServiceList);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedStaff = useAppSelector(selectSelectedStaffDetails);
  const staffServiceList = useAppSelector(selectServiceEmployeeRelationList);
  const showModal = useAppSelector(selectShowAssignModal);
  const deleteStaffService = useAppSelector(selectStaffServiceDelete);
  const firstTimeUserGuide = useAppSelector(selectFirstTimeUserGuidence);
  const employeeList = useAppSelector(selectEmployeeList);
  const [searchParams] = useSearchParams();
  const { monday, sunday } = useCurrentWeek();

  

  useEffect(() => {
    if (
      employeeList?.length == 1 &&
      staffServiceList?.length == 1 &&
      firstTimeUserGuide.serviceAssign
    ) {
      dispatch(setShowGuiderModal(true));
      dispatch(
        setFirstTimeUserGuide({ ...firstTimeUserGuide, serviceAssign: false })
      );
    }
  }, [staffServiceList]);

  const options = [
    {
      label: t(staffOptionsValue.services),
      component: (
        <div className="wrap-services-staff-list">
          {staffServiceList?.length > 0 &&
            staffServiceList?.map(
              (item: ResponseServiceStaffRelation, index: number) => {
                return <StaffServiceList item={item} />;
              }
            )}
        </div>
      ),
      value: staffOptionsValue?.services,
    },
    {
      label: t(staffOptionsValue.schedule),
      component: <StaffSchedule />,
      value: staffOptionsValue?.scheduler,
    },
    // {
    //   label: t(staffOptionsValue.comissions),
    //   component: <CommissionView />,
    //   value: staffOptionsValue?.comissions,
    // },
  ];

  return (
    <div className="employee-info-wrap">
      {selectedStaff ? (
        <>
          <StaffDetails selectedStaff={selectedStaff} />
          <div className="menu-employee-wrap">
            <MenuTabs
              options={options}
              onChangeTab={(val: any) => {
                setSelectedTab(val);
              }}
            />

            {selectedTab == 0 && (
              <AddFloatingButton
                onClick={() => {
                  dispatch(setShowAssignServiceModal(true));
                }}
                title="Assign Service"
                width="35px"
                height="35px"
                disabled={selectedStaff?.status == "inactive"}
              />
            )}

            {selectedTab == 1 && (
              <div className="weekly-calender-wrap">
                <p className="date-text">{`[ ${getFormattedDate(
                  searchParams?.get("dtRange")?.slice(1, -1).split(",")[0] ??
                    monday
                )} - ${getFormattedDate(
                  searchParams?.get("dtRange")?.slice(1, -1).split(",")[1] ??
                    sunday
                )}  ] `}</p>

                <WeeklyDatePicker />
              </div>
            )}
          </div>
          {options[selectedTab]?.component}
        </>
      ) : (
        <div style={{ marginTop: "100px" }}>
          <EmptyView
            src={notFoundImage}
            text={t(constantString.ADD_STAFF)}
            title={translateLabel(constantString.NO_STAFF)}
            onHandleClick={() => {
              dispatch(setShowAddStaffModal(true));
            }}
          />
        </div>
      )}

      {showModal && <AssignServiceModal open={showModal} />}
      {deleteStaffService && (
        <DeleteModal
          open={deleteStaffService}
          onClose={() => dispatch(setStaffServiceDelete(null))}
          confirmDelete={() => {
            dispatch(deleteServiceStaffRelation(deleteStaffService?.id));
          }}
          selectedDeleteData={deleteStaffService?.svcCtlgItems}
          heading="UnAssign Services"
          title="Are you sure you want to unassign "
        />
      )}
    </div>
  );
};
