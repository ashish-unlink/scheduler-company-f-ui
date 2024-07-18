import { useAppDispatch, useAppSelector } from "../../redux";
import { EmailOutlined, Person2Outlined, Phone } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { setSelectedClient } from "../../redux/appointment/slice";
import { Users } from "../../utils/types/responseType";
import "./customerProfileStyle.css";
import { Tooltip, Typography } from "@mui/material";
import { CircularProgressBar } from "../loading/CircularLoader";
import RefreshIcon from "@mui/icons-material/Refresh";
import { userName } from "../../utils/general";
import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { rows } from "../staff-schedule/schema";
import { isUserVerify } from "../../redux/users/action";
import { selectCustomerLoading } from "../../redux/users/selector";


export const CustomerProfile = ({
  selectedClientData,
  isClose,
}: {
  selectedClientData: Users;
  isClose?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isLoading = useAppSelector(selectCustomerLoading);
  const isEmailVerify = selectedClientData?.isEmailVerified === true;
  return (
    selectedClientData && (
      <div>
        <div className="user-profile-detail">
          <div className="profile-user">
            <div className="customer-image">
              <Typography className="color-orange fw-600" variant="h6">
                {selectedClientData?.firstName.charAt(0)?.toUpperCase()}
                {selectedClientData?.lastName.charAt(0)?.toUpperCase()}
              </Typography>
            </div>
            <Typography className="profile-text">
              {`${selectedClientData?.firstName}  ${selectedClientData?.lastName}`}
            </Typography>
          </div>
          {isClose && (
            <Tooltip title="Close" placement="top"><CloseIcon
              onClick={() => {
                dispatch(setSelectedClient(null));
              }}
            />
            </Tooltip>
          )}
        </div>
        <div>
          <div className="profile-box">
            <Person2Outlined />
            <Typography className="profile-text">
              {userName( selectedClientData?.firstName, selectedClientData?.lastName)}
            </Typography>

            {selectedClientData && (
              <>
                <div
                  className={`user-status ${
                    isEmailVerify && "user-active"
                  }`}
                >
                  {isEmailVerify
                    ? "Verified"
                    : "UnVerified"}
                </div>
               {!isEmailVerify && <div className="refresh-wrap">
                  {isLoading ? (
                    <CircularProgressBar size={16} />
                  ) : ( 
                    <Tooltip title="Refresh" placement="top">
                    <RefreshIcon
                      fontSize="small"
                      color="info"
                      onClick={() => {
                        dispatch(isUserVerify(selectedClientData?.email));
                      }}
                    />
                    </Tooltip>
                  )}
                </div>}
              </>
            )}
          </div>
          <div className="profile-box">
            <EmailOutlined />
            <Typography className="profile-text email-text">
              {selectedClientData?.email}
            </Typography>
          </div>
          <div className="profile-box">
            <Phone />
            <Typography className="profile-text">
              {selectedClientData?.phoneNumber}
            </Typography>
          </div>
        </div>
      </div>
    )
  );
};
