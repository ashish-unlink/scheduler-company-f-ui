import React, { useState } from "react";
import notFoundImage from "../assets/not-found.png";
import { useAppDispatch, useAppSelector } from "../../redux";
import { UserListDropDown } from "../user-list-dropdown";
import { constantString } from "../../utils/constantString";
import { selectOwnerData } from "../../redux/auth/selector";
import {
  setAppointmentHistory,
  setSelectedCalenderAppointmentDate,
  setSelectedClient,
  setShowCustomerAppointmentModal,
} from "../../redux/appointment/slice";
import {
  selectCalenderAppointmentDate,
  selectEditAppointmentForm,
  selectSelectedClient,
  selectUpdateAppointmentId,
} from "../../redux/appointment/selector";
import { Comments, Users } from "../../utils/types/responseType";
import { useTranslation } from "react-i18next";
import "./appointmentStyle.css";
import { CustomerProfile } from "../customer-profile/CustomerProfile";
import { DatePick } from "../date-pick";
import { setOpenAddCustomerPopup } from "../../redux/users/slice";
import dayjs from "dayjs";
import { List, ListItemText, Typography } from "@mui/material";
import { useCompanyData } from "../hooks/useCompanyData";
import { selectCustomerData } from "../../redux/users/selector";
import { getFormattedDate, sortComments, userName } from "../../utils/general";
import translateLabel from "../hooks/translationLable";
import AddCustomer from "../custom-scheduler/components/CustomerDetails";
import { Link } from "react-router-dom";

const CustomerSection = ({ errorState }: { errorState: string }) => {
  const customerUserData: any = useAppSelector(selectCustomerData);
  const selectedClientData = useAppSelector(selectSelectedClient);
  const selectedUpdateAppointmetId = useAppSelector(selectUpdateAppointmentId);
  const selectedDate = useAppSelector(selectCalenderAppointmentDate);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const editForm = useAppSelector(selectEditAppointmentForm);
  const ownerData = useAppSelector(selectOwnerData);
  const [openStatusPopup, setOpenStatusPopup] = useState(false);

  const companyId = useCompanyData();

  const handleCustomer = (event: any, value: any) => {
    dispatch(setSelectedClient(value));
  };

  return (
    <div className="common-appointment-popup-2-section border-right">
      <DatePick
        name="date"
        placeholder="Date"
        onChange={(e: any) => {
          dispatch(setSelectedCalenderAppointmentDate(e));
        }}
        disablePast={true}
        value={dayjs(selectedDate)}
        format="DD MMMM YYYY, dddd"
        // onBlur={handleBlur}
        // error={touched.date && errors.date && errors.date}
      />
      {selectedClientData ? (
        <>
          <CustomerProfile
            selectedClientData={selectedClientData}
            isClose={selectedUpdateAppointmetId == "" ? true : false}
          />
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ textAlign: "center", color:'#5345a1 ', cursor:'pointer', textDecoration:'underline' }}
            onClick={() => {
              dispatch(setAppointmentHistory(selectedClientData));
              // dispatch(setShowCustomerAppointmentModal(false));
            }}
          >
             View Past Appointments for {selectedClientData?.lastName}{" "}
            {selectedClientData?.firstName}
          </Typography>

          {editForm && (
            <>
              {editForm?.comments?.length > 0 && (
                <List sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {t(constantString.COMMENTS)}:
                  </Typography>
                  <div className="comments-wrap">
                    {sortComments(editForm?.comments)?.map(
                      (item: Comments, index: number) => {
                        return (
                          <ListItemText sx={{ marginBottom: "5px" }}>
                            <Typography
                              variant="body2"
                              color="#000"
                              fontWeight={500}
                              key={`comment-${index}`}
                              sx={{ textTransform: "capitalize" }}
                            >
                              {item?.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              fontWeight={500}
                              sx={{ mt: 1, ml: 1, textTransform: "capitalize" }}
                            >
                              <i>
                                {`- ${ownerData?.firstName} ${ownerData?.lastName}`}
                                ,{" "}
                                <span className="comment-date">
                                  {getFormattedDate(item?.createdAt)}
                                </span>{" "}
                              </i>
                            </Typography>
                          </ListItemText>
                        );
                      }
                    )}
                  </div>
                </List>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="customer-search-section">
            <UserListDropDown
              label={translateLabel(constantString.CUSTOMER)}
              option={customerUserData}
              icon={"/assets/search.png"}
              placeholder={"Type Name / Email / Phone"}
              value={selectedClientData?.firstName}
              mandatory
              error={errorState}
              renderOption={(props, options) => {
                return (
                  <div
                    className="wrap"
                    onClick={(event) => handleCustomer(event, options)}
                  >
                    <h5 className="dropdown-options-heading">
                      {userName(options?.firstName, options?.lastName)}
                    </h5>
                    <p className="dropdown-options-text">
                      {options?.phoneNumber}
                    </p>
                    <p className="dropdown-options-text">{options?.email}</p>
                  </div>
                );
              }}
              renderFilterOptions={(options, params) => {
                const { inputValue } = params;
                const inputValueLowerCase = inputValue.toLowerCase();
                return customerUserData?.filter((op: Users) => {
                  const searchFields = [
                    op?.firstName,
                    op?.email,
                    op?.phoneNumber,
                  ].join(" ");
                  const searchFieldsLowerCase = searchFields.toLowerCase();
                  return searchFieldsLowerCase?.includes(inputValueLowerCase);
                });
              }}
            />
          </div>
          {/* <center>{t(constantString.NO_CLIENT_SELECTED)}</center> */}
          <div className="customer-search-section">
            <AddCustomer />
            {/* <center>
              <img className="not-found" src={notFoundImage} alt="not found" />
            </center>
            <button
              className="orange-button button add-new-customer-button"
              onClick={() => dispatch(setOpenAddCustomerPopup(true))}
            >
              {t(constantString.ADD_NEW_CUSTOMER)}
            </button> */}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerSection;
