import React, { useState } from "react";
import "./staffDetailsStyle.css";
import Editing from "../staff-details/aseest/editing.png";
import Delate from "../staff-details/aseest/delate.png";
import IconUser from "../staff-details/aseest/iconUser.png";
import { UserStaffs } from "../../utils/types/responseType";
import { Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  setSelectedStaffDetail,
  setShowAddStaffModal,
  setShowStaffDelete,
  setStaffEditable,
} from "../../redux/staff/slice";
import IconButton from "@mui/material/IconButton";
import AddStaffModal from "../add-staff/AddStaffModal";
import {
  selectEmployeeLoading,
  selectShowStaffDeleteModal,
  selectshowAddStaffModal,
} from "../../redux/staff/selector";
import dayjs from "dayjs";
import { SwitchBar } from "../switch/Switch";
import {
  deleteEmployeeAPI,
  updateEmployeStatus,
} from "../../redux/staff/action";
import CircularLoader from "../loading/CircularLoader";
import { getFormattedDate, userName } from "../../utils/general";
import DeleteModal from "../delete-confirmation/DeleteModal";
import {
  appointmentSuccessColumns,
  constantString,
} from "../../utils/constantString";
import { useCompanyData } from "../hooks/useCompanyData";
import translateLabel from "../hooks/translationLable";

export const StaffDetails = ({
  selectedStaff,
}: {
  selectedStaff: UserStaffs | null;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const showAddStaffModal = useAppSelector(selectshowAddStaffModal);
  const showStaffDelete = useAppSelector(selectShowStaffDeleteModal);
  const isLoading = useAppSelector(selectEmployeeLoading);
  const companyId = useCompanyData();
  const address = selectedStaff?.billingAddresses ?? [];
  const permanentAddress = `${address?.[0]?.street}, ${address?.[0]?.city}, ${address?.[0]?.postal}, ${address?.[0]?.state}, ${address?.[0]?.country?.title}`;
  // const currentAddress = `${address?.[1]?.street}, ${address?.[1]?.city}, ${address?.[1]?.postal}, ${address?.[1]?.state}, ${address?.[1]?.country?.label}`;

  const products = [
    {
      name: translateLabel(constantString.GENDER),
      value: selectedStaff?.gender,
    },
    {
      name: translateLabel(constantString.DOB),
      value: getFormattedDate(selectedStaff?.dateOfBirth ?? ""),
    },
    {
      name: translateLabel(constantString.ENABLE_APPOINTMENT),
      value: selectedStaff?.isEmplPermanent ? "yes" : "No",
    },
    {
      name: translateLabel(appointmentSuccessColumns.START_TIME),
      value:
        selectedStaff?.emplStartDate != null
          ? getFormattedDate(selectedStaff?.emplStartDate)
          : "-",
    },
    {
      name: translateLabel(constantString.END_DATE),
      value:
        selectedStaff?.emplEndDate != null
          ? getFormattedDate(selectedStaff?.emplEndDate)
          : "-",
    },
    {
      name: translateLabel(constantString.EMPLOYEE_STATUS),
      value: selectedStaff?.status == "active" ? "Available" : "Not Available",
    },

    {
      name: translateLabel(constantString.ADDRESS),
      value: address ? permanentAddress : "-",
    },
    {
      name: translateLabel(constantString.DESCRIPTION),
      value: selectedStaff?.emplDesc != "" ? selectedStaff?.emplDesc : "-",
    },
  ];

  const RenderIconButton = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => {
    return (
      <IconButton aria-label="delete" onClick={() => onClick()}>
        {children}
      </IconButton>
    );
  };

  return (
    <div className="container-details">
      {isLoading && <CircularLoader />}
      <div className="costumer-desing-details">
        <img src={IconUser} alt="IconUser" />
        <div className="title-text-right-div">
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ textTransform: "capitalize", marginTop: "10px" }}
          >
            {selectedStaff &&
              userName(selectedStaff?.firstName, selectedStaff?.lastName)}
          </Typography>
          {!selectedStaff?.email.endsWith('@dummy.com') && (
            <Typography className="sub-heading email-text">
              {" "}
              {selectedStaff?.email}
            </Typography>
          )}
          <Typography className="sub-heading">
            {" "}
            {selectedStaff?.phoneNumber}
          </Typography>

          <div className="profile-info">
            <div className="profilte-text-wrap">
              <Typography variant="body2" fontWeight={600}>
                {t(constantString.TITLE)}
              </Typography>
              <Typography className="sub-heading">
                {selectedStaff?.emplDesig}
              </Typography>
            </div>
            <div className="profilte-text-wrap">
              <Typography variant="body2" fontWeight={600}>
                {t(constantString.EMPLOYEE_CODE)}
              </Typography>
              <Typography className="sub-heading">
                {selectedStaff?.emplCode}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="details-main-div">
        <div className="delete-img-div">
          {/* TODO remove in future */}
          {/* switch  */}
          {/* <SwitchBar
            onChange={(e: any) => {
              const body = { status: e.target.checked ? "active" : "inactive" };
              const id = selectedStaff?.id;
              if (id) {
                dispatch(updateEmployeStatus({ body: body, id: id }));
              }
            }}
            data={selectedStaff}
          /> */}

          {/* edit icon */}

          <RenderIconButton
            onClick={() => {
              dispatch(setShowAddStaffModal(true));
              dispatch(setSelectedStaffDetail(selectedStaff));
              dispatch(setStaffEditable(true));
            }}
          >
            <img src={Editing} alt="editing" className="edit-img" />
          </RenderIconButton>

          {/* delete icon */}

          <RenderIconButton
            onClick={() => {
              dispatch(setShowStaffDelete(true));
            }}
          >
            <img src={Delate} alt="delete" className="edit-img" />
          </RenderIconButton>
        </div>
        <div className="right-top-div1">
          {products.map((products, index: any) => (
            <div key={index} className="wrap-propfile-info-test">
              <Typography variant="body2" fontWeight={600}>
                {products.name}
              </Typography>
              <Typography className="sub-heading">{products?.value}</Typography>
            </div>
          ))}
        </div>
      </div>

      {showAddStaffModal && <AddStaffModal open={showAddStaffModal} />}

      {showStaffDelete && selectedStaff && (
        <DeleteModal
          open={showStaffDelete}
          onClose={() => dispatch(setShowStaffDelete(false))}
          selectedDeleteData={{
            ...selectedStaff,
            title: userName(selectedStaff.firstName, selectedStaff.lastName),
          }}
          confirmDelete={() => {
            if (selectedStaff) {
              dispatch(
                deleteEmployeeAPI({
                  id: selectedStaff.id,
                  companyId: companyId,
                })
              );
            }
          }}
          heading={t(constantString.CONFIRM_DELETE)}
          title={t(constantString.DELETE)}
        />
      )}
    </div>
  );
};
