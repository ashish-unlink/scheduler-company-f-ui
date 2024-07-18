import React, { useEffect, useState } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import AppointmentTextField from "../appointment-popup/AppointmentTextField";
import { Button } from "@mui/material";
import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { TimePicker } from "../time-picker/TimePicker";
import "./bussinesSetupStyle.css";
import { requiredSchema } from "../../utils/validation";
import { setSettingBussinessSetUP } from "../../redux/meta/slice";
import { useAppDispatch, useAppSelector } from "../../redux";
import { useCompanyData } from "../hooks/useCompanyData";
import {
  selectBusinessSeteTime,
  selectBusinessSetpData,
  selectBussinessLoading,
} from "../../redux/meta/selector";
import CircularLoader from "../loading/CircularLoader";
import { setUpBussinessAPI } from "../../redux/meta/action";
import { bussinessSetupRequest } from "../../utils/types/requestType";
import { selectOwnerData } from "../../redux/auth/selector";
import { BsShop } from "react-icons/bs";
import { LuUser } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";
import { TbStatusChange } from "react-icons/tb";
import { MdOutlinePhone } from "react-icons/md";
import translateLabel from "../hooks/translationLable";

const SetUpBussinessModal = ({ open }: { open: boolean }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const company_id = useCompanyData();
  const bussinessSetupTime = useAppSelector(selectBusinessSeteTime);
  const bussinessSetData = useAppSelector(selectBusinessSetpData);
  const bussinessSetOwnerDetails = useAppSelector(selectOwnerData);
  const isLoading = useAppSelector(selectBussinessLoading);

  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    transform: "translate(-50%, -50%)",
    width: "32%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    height: "100vh",
    boxShadow: 24,
    overflowY: "scroll",
    // p: 4,
  };

  const validationSchema = Yup.object({
    startTime: requiredSchema("Start Time"),
    endTime: requiredSchema("End Time"),
    // dasmid: requiredSchema("Das mid"),
    // secret_key: requiredSchema("Secret key"),
    // currency: requiredSchema("Currency"),
    // gatewayUrl:requiredSchema("Gateway url"),
    // xApiKey:requiredSchema("X-API-KEY"),
  });

  const bussinessData = {
    BUSSINESS_GATEWAY_URL:
      "https=//2d1uj551b4.execute-api.ap-southeast-1.amazonaws.com/dev/api/v1/hpp/generate/link",
    DASMID: "JP00000328",
    CURRENCY: "JPY",
    SECRET_KEY: "MkxYMTVYcFFfMy1ObkhEemcyVXVZY20zUWRibG9WSUg6",
    X_API_KEY: "bLm8c1C0fL3FtPzrjSr0",
  };

  const initialValues = {
    startTime: dayjs(bussinessSetData?.startTime?.value, "HH:mm") ?? "",
    endTime: dayjs(bussinessSetData?.endTime?.value, "HH:mm") ?? "",
    dasmid: bussinessSetData?.dasmid?.value ?? bussinessData?.DASMID,
    secret_key: bussinessSetData?.secretKey?.value ?? bussinessData?.SECRET_KEY,
    currency: bussinessSetData?.currency?.value ?? bussinessData?.CURRENCY,
    gatewayUrl:
      bussinessSetData?.gatewayurl?.value ??
      bussinessData?.BUSSINESS_GATEWAY_URL,
    xApiKey: bussinessSetData?.xapikey?.value ?? bussinessData?.X_API_KEY,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let companyPreferences = [];

      companyPreferences.push({
        ...(bussinessSetData?.startTime?.id && {
          id: bussinessSetData?.startTime?.id,
        }),
        companyId: company_id,
        prefKey: "startTime",
        prefValue: dayjs(values?.startTime).format("HH:mm"),
      });

      companyPreferences.push({
        ...(bussinessSetData?.endTime?.id && {
          id: bussinessSetData?.endTime?.id,
        }),
        companyId: company_id,
        prefKey: "endTime",
        prefValue: dayjs(values?.endTime).format("HH:mm"),
      });

      if (values?.dasmid != "") {
        companyPreferences.push({
          ...(bussinessSetData?.dasmid?.id && {
            id: bussinessSetData?.dasmid?.id,
          }),
          companyId: company_id,
          prefKey: "dasmid",
          prefValue: values?.dasmid,
        });
      }

      if (values?.secret_key != "") {
        companyPreferences.push({
          ...(bussinessSetData?.secretKey?.id && {
            id: bussinessSetData?.secretKey?.id,
          }),
          companyId: company_id,
          prefKey: "secret key",
          prefValue: values?.secret_key,
        });
      }

      if (values?.currency != "") {
        companyPreferences.push({
          ...(bussinessSetData && {
            id: bussinessSetData?.currency?.id,
          }),
          companyId: company_id,
          prefKey: "currency",
          prefValue: values?.currency,
        });
      }

      if (values?.gatewayUrl != "") {
        companyPreferences.push({
          ...(bussinessSetData && {
            id: bussinessSetData?.gatewayurl?.id,
          }),
          companyId: company_id,
          prefKey: "gatewayurl",
          prefValue: values?.gatewayUrl,
        });
      }

      if (values?.xApiKey != "") {
        companyPreferences.push({
          ...(bussinessSetData && {
            id: bussinessSetData?.xapikey?.id,
          }),
          companyId: company_id,
          prefKey: "xapikey",
          prefValue: values?.xApiKey,
        });
      }

      const body: bussinessSetupRequest = {
        companyPreferences,
      };
      console.log("body", body);

      dispatch(setUpBussinessAPI(body));
    },
  });

  const {
    handleSubmit,
    handleChange,
    values,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formik;

  return (
    <>
      {isLoading && <CircularLoader />}
      <CustomPopup open={open} style={customStyle}>
        <AppointmentPopupHeader
          onClose={() => {
            dispatch(setSettingBussinessSetUP(false));
          }}
        >
          <b>{t(constantString.SET_BUSINESS_PREFERENCE)}</b>
        </AppointmentPopupHeader>
        <div className="user-details-div">
          <div className="user-d-listing">
            <h2>
              <BsShop /> {bussinessSetOwnerDetails.company[0].title}
            </h2>
            <h3>
              <LuUser />
              {bussinessSetOwnerDetails.firstName}{" "}
              {bussinessSetOwnerDetails.lastName}
            </h3>
            <h4>
              <HiOutlineMail />
              {bussinessSetOwnerDetails.email}
            </h4>
            <h4>
              <MdOutlinePhone />
              {bussinessSetOwnerDetails.phoneNumber}
            </h4>
            {/* <h5>
              <TbStatusChange />
              {bussinessSetOwnerDetails.status}
            </h5> */}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="wrap-category">
            <div className="bussiness-input-wrap">
              <TimePicker
                value={dayjs(values?.startTime)}
                name="startTime"
                onChange={(value) => {
                  setFieldValue("startTime", value, true);
                }}
                label={t(constantString.OPEN_TIME)}
                onBlur={handleBlur}
                error={
                  touched.startTime && errors.startTime && errors.startTime
                }
                mandatory
              />
            </div>

            <div className="bussiness-input-wrap">
              <TimePicker
                value={dayjs(values?.endTime)}
                name="endTime"
                onChange={(value) => {
                  setFieldValue("endTime", value, true);
                }}
                label={t(constantString.CLOSE_TIME)}
                mandatory
                onBlur={handleBlur}
                error={touched.endTime && errors.endTime && errors.endTime}
                minTime={dayjs(values?.startTime)}
              />
            </div>

            <div className="bussiness-input-wrap">
              <AppointmentTextField
                name="dasmid"
                label={translateLabel(constantString.DASMID)}
                placeholder={translateLabel(constantString.DASMID)}
                onChange={(e: any) => {
                  handleChange(e);
                }}
                value={values.dasmid}
                onBlur={handleBlur}
                error={touched.dasmid && errors.dasmid}
                maxLength={150}
              />
            </div>

            <div className="bussiness-input-wrap">
              <AppointmentTextField
                name="secret_key"
                label={translateLabel(constantString.SECRET_KEY)}
                placeholder={translateLabel(constantString.SECRET_KEY)}
                onChange={(e: any) => {
                  handleChange(e);
                }}
                value={values.secret_key}
                onBlur={handleBlur}
                error={touched.secret_key && errors.secret_key}
                maxLength={150}
              />
            </div>

            <div className="bussiness-input-wrap">
              <AppointmentTextField
                name="currency"
                label={translateLabel(constantString.CURRENCY)}
                placeholder={translateLabel(constantString.CURRENCY)}
                onChange={(e: any) => {
                  handleChange(e);
                }}
                value={values.currency}
                onBlur={handleBlur}
                error={touched.currency && errors.currency}
                maxLength={150}
              />
            </div>

            <div className="bussiness-input-wrap">
              <AppointmentTextField
                name="gatewayUrl"
                label={translateLabel(constantString.GATE_WAY_URL)}
                placeholder={translateLabel(constantString.GATE_WAY_URL)}
                onChange={(e: any) => {
                  handleChange(e);
                }}
                value={values.gatewayUrl}
                onBlur={handleBlur}
                error={touched.gatewayUrl && errors.gatewayUrl}
                maxLength={150}
              />
            </div>

            <div className="bussiness-input-wrap">
              <AppointmentTextField
                name="xApiKey"
                label={translateLabel(constantString.X_API_KEY)}
                placeholder={translateLabel(constantString.X_API_KEY)}
                onChange={(e: any) => {
                  handleChange(e);
                }}
                value={values.xApiKey}
                onBlur={handleBlur}
                error={touched.xApiKey && errors.xApiKey}
                maxLength={150}
              />
            </div>

            <div className="btn-div">
              <Button
                variant="contained"
                className="contained-btn"
                type="submit"
              >
                {t(constantString.SAVE)}
              </Button>
            </div>
          </div>
        </form>
      </CustomPopup>
    </>
  );
};

export default SetUpBussinessModal;
