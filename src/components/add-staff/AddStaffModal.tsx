import React, { useEffect } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import AppointmentTextField from "../../components/appointment-popup/AppointmentTextField";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../redux";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  commissionSchema,
  customerPhoneSchema,
  emailSchema,
  genderSchema,
  nameSchema,
  phoneSchema,
  requiredSchema,
  zipCodeSchema,
} from "../../utils/validation";
import { selectServiceCategoryItem } from "../../redux/service/selector";
import "./addSttafStyle.css";
import { Checkbox } from "@mui/material";
import TextArea from "../text-area";
import {
  setShowAddStaffModal,
  setStaffEditable,
} from "../../redux/staff/slice";
import AppointmentSelectBox2 from "../appointment-popup/AppointmentSelectBox2";
import { genderOptions } from "../custom-scheduler/data";
import { DatePick } from "../date-pick";
import { selectCountryList } from "../../redux/meta/selector";
import { fetchCountryList } from "../../redux/meta/action";
import { AddStaffProps } from "./type";
import { addEmployee, updateEmployee } from "../../redux/staff/action";
import { MobilePhoneInput } from "../mobile-input/MobileInput";
import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import CircularLoader from "../loading/CircularLoader";
import {
  selectEmployeeLoading,
  selectSelectedStaffDetails,
  selectStaffEditable,
} from "../../redux/staff/selector";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import { useCompanyData } from "../hooks/useCompanyData";
import CustomCheckbox from "../custom-checkbox/CustomCheckbox";

const AddStaffModal = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const company_id = useCompanyData();
  const countryList = useAppSelector(selectCountryList) ?? [];
  const { t } = useTranslation();
  const isLoading = useAppSelector(selectEmployeeLoading);
  const selectedStaff = useAppSelector(selectSelectedStaffDetails);
  const isStaffEditable = useAppSelector(selectStaffEditable);
  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    boxShadow: 24,
    height: "100vh",
    // p: 4,
  };

  const validationSchema = Yup.object({
    first_name: nameSchema("First Name"),
    last_name: nameSchema("Last Name"),
    // email: emailSchema(),
    mobile: customerPhoneSchema(),
    // employee_code: requiredSchema("Employee Code"),
    gender: genderSchema(),
    dob: requiredSchema("DOB"),
    permanent_street: requiredSchema("Current street"),
    permanent_city: requiredSchema("Current City"),
    permanent_state: requiredSchema("Current State"),
    permanent_zipcode: zipCodeSchema(),
    permanent_country: requiredSchema("Current Country"),
  });

  const initialValues = {
    first_name: isStaffEditable ? selectedStaff?.firstName : "",
    // aadharCard: isStaffEditable ? selectedStaff?.aadharCard : "",
    // panCard: isStaffEditable ? selectedStaff?.panCard : "",
    last_name: isStaffEditable ? selectedStaff?.lastName : "",
    email: isStaffEditable ? selectedStaff?.email : "",
    mobile: isStaffEditable ? selectedStaff?.phoneNumber : "",
    employee_code: isStaffEditable ? selectedStaff?.emplCode : "",
    gender: isStaffEditable ? selectedStaff?.gender : "",
    dob: isStaffEditable
      ? selectedStaff?.dateOfBirth
        ? dayjs(selectedStaff?.dateOfBirth)
        : null
      : null,
    start_date: isStaffEditable
      ? selectedStaff?.emplStartDate
        ? dayjs(selectedStaff?.emplStartDate)
        : null
      : null,
    end_date: isStaffEditable
      ? selectedStaff?.emplEndDate
        ? dayjs(selectedStaff?.emplEndDate)
        : null
      : null,
    designation: isStaffEditable ? selectedStaff?.emplDesig : "",
    permanent_street: isStaffEditable
      ? selectedStaff?.billingAddresses?.[0]?.street
      : "",
    permanent_city: isStaffEditable
      ? selectedStaff?.billingAddresses?.[0]?.city
      : "",
    permanent_state: isStaffEditable
      ? selectedStaff?.billingAddresses?.[0]?.state
      : "",
    permanent_zipcode: isStaffEditable
      ? selectedStaff?.billingAddresses?.[0]?.postal
      : "",
    permanent_country: isStaffEditable
      ? selectedStaff?.billingAddresses?.[0]?.country?.id
      : "",

    description: isStaffEditable ? selectedStaff?.emplDesc : "",
    appointment: isStaffEditable ? selectedStaff?.isEmplPermanent : true,
    status: isStaffEditable
      ? selectedStaff?.status == "inactive"
        ? false
        : true
      : true,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body: AddStaffProps = {
        ...(isStaffEditable && { id: selectedStaff?.id }),
        firstName: values?.first_name,
        lastName: values?.last_name,
        ...(values?.email && { email: values?.email }),
        gender: values?.gender,
        phoneNumber: values?.mobile,
        // ...(values?.aadharCard != "" && { aadharCard: values?.aadharCard }),
        // ...(values?.panCard != "" && { panCard: values?.panCard }),
        dateOfBirth: dayjs(values.dob).format("YYYY-MM-DD"),
        ...(values?.start_date != null && {
          emplStartDate: dayjs(values?.start_date).format("YYYY-MM-DD"),
        }),
        ...(values?.end_date != null && {
          emplEndDate: dayjs(values?.end_date).format("YYYY-MM-DD"),
        }),
        emplDesig: values?.designation,
        emplCode: values?.employee_code,
        emplDesc: values?.description,
        isEmplPermanent: values?.appointment,
        status: values?.status ? "active" : "inactive",

        primaryAddress: {
          ...(isStaffEditable && {
            addressId: selectedStaff?.billingAddresses?.[0]?.id,
          }),
          isMainAddress: true,
          city: values?.permanent_city,
          postal: values?.permanent_zipcode,
          region: values?.permanent_state,
          state: values?.permanent_state,
          street: values?.permanent_street,
          addressType: "residential",
          countryId: values?.permanent_country,
        },
      };

      isStaffEditable
        ? dispatch(updateEmployee({ body, id: company_id }))
        : dispatch(addEmployee({ body, id: company_id }));
    },
  });

  const {
    handleSubmit,
    setFieldValue,
    handleChange,
    values,
    handleBlur,
    errors,
    touched,
  } = formik;

  return (
    <>
      {isLoading && <CircularLoader />}
      <CustomPopup open={open} style={customStyle}>
        <AppointmentPopupHeader
          onClose={() => {
            dispatch(setShowAddStaffModal(false));
            dispatch(setStaffEditable(false));
          }}
        >
          <b>{t(constantString.ADD_STAFF)}</b>
        </AppointmentPopupHeader>
        <form onSubmit={handleSubmit}>
          <div className="wrap-staff">
            <p className="staff-form-label-text">
              {t(constantString.PERSONAL_DETAILS)}
            </p>
            <div className="wrap-staff-field">
              <div className="staff-input-wrap">
                <AppointmentTextField
                  name="last_name"
                  label={t(constantString.LAST_NAME)}
                  placeholder="Ex. Nutt"
                  onChange={handleChange}
                  value={values.last_name}
                  onBlur={handleBlur}
                  error={touched.last_name && errors.last_name}
                  mandatory
                />
              </div>
              <div className="staff-input-wrap">
                <AppointmentTextField
                  name="first_name"
                  label={t(constantString.FIRST_NAME)}
                  placeholder="Ex. Hazel"
                  onChange={handleChange}
                  value={values.first_name}
                  onBlur={handleBlur}
                  error={touched.first_name && errors.first_name}
                  mandatory
                />
              </div>

              <div className="staff-input-wrap">
                <AppointmentTextField
                  name="email"
                  label={t(constantString.EMAIL)}
                  placeholder="Ex. hazel.nutt@gmail.com"
                  onChange={handleChange}
                  value={values.email}
                  onBlur={handleBlur}
                  maxLength={50}
                  // error={touched.email && errors.email}
                  // mandatory
                />
              </div>
              <div className="staff-input-wrap">
                <MobilePhoneInput
                  name="mobile"
                  label={t(constantString.PHONE_NUMBER)}
                  placeholder="+81 75 180 4043"
                  onChange={(val: string) => {
                    setFieldValue("mobile", val, true);
                  }}
                  onBlur={handleBlur}
                  value={values.mobile}
                  error={touched.mobile && errors.mobile}
                  mandatory
                />
              </div>
              <div className="staff-input-wrap">
                <AppointmentSelectBox2
                  name="gender"
                  options={genderOptions}
                  onChange={handleChange}
                  defaultValue="male"
                  label={t(constantString.GENDER)}
                  value={values.gender}
                  error={touched.gender && errors.gender}
                  placeholder="Male"
                  mandatory
                />
              </div>
              <div className="staff-input-wrap">
                <DatePick
                  name="dob"
                  label={t(constantString.DOB)}
                  placeholder="DOB"
                  onChange={(e: any) => {
                    setFieldValue("dob", e, true);
                  }}
                  disableFuture
                  value={dayjs(values.dob)}
                  onBlur={handleBlur}
                  error={touched.dob && errors.dob && errors.dob}
                  mandatory
                />
              </div>
              {/* <div className="staff-input-wrap top-margin">
                <AppointmentTextField
                  name="aadharCard"
                  label="Adhaar Card Number"
                  placeholder="************"
                  onChange={handleChange}
                  value={values.aadharCard}
                  onBlur={handleBlur}
                  error={touched.aadharCard && errors.aadharCard}
                />
              </div>
              <div className="staff-input-wrap top-margin">
                <AppointmentTextField
                  name="panCard"
                  label="Pan Card Number"
                  placeholder="**********"
                  onChange={handleChange}
                  value={values.panCard}
                  onBlur={handleBlur}
                  error={touched.panCard && errors.panCard}
                />
              </div> */}
            </div>

            <p className="staff-form-label-text">
              {t(constantString.JOB_DETAILS)}
            </p>
            <div className="wrap-staff-field">
              <div className="staff-input-wrap">
                <AppointmentTextField
                  name="employee_code"
                  label={t(constantString.EMPLOYEE_CODE)}
                  placeholder="Ex. 5623"
                  onChange={handleChange}
                  value={values.employee_code}
                  onBlur={handleBlur}
                  error={touched.employee_code && errors.employee_code}
                />
              </div>
              <div className="staff-input-wrap">
                <AppointmentTextField
                  name="designation"
                  label={t(constantString.DESCRIPTION)}
                  placeholder="Ex. Hairdresser"
                  onChange={handleChange}
                  value={values.designation}
                  onBlur={handleBlur}
                  error={touched.designation && errors.designation}
                />
              </div>
              <div className="staff-input-wrap">
                <DatePick
                  name="start_date"
                  label={t(constantString.START_DATE)}
                  placeholder="Start Date"
                  onChange={(e: any) => {
                    setFieldValue("start_date", e, true);
                  }}
                  // disableFuture
                  value={dayjs(values.start_date)}
                  onBlur={handleBlur}
                  error={touched.start_date && errors.start_date}
                />
              </div>
              <div className="staff-input-wrap">
                <DatePick
                  name="end_date"
                  label={t(constantString.END_DATE)}
                  placeholder="End Date"
                  onChange={(e: any) => {
                    setFieldValue("end_date", e, true);
                  }}
                  minDate={dayjs(values.start_date)}
                  value={dayjs(values.end_date)}
                  onBlur={handleBlur}
                  error={touched.end_date && errors.end_date}
                />
              </div>

              <div className="wrap-checkbox">
                <div className="wrap-staff-checkbox-field">
                  <CustomCheckbox
                    name="appointment"
                    label={t(constantString.ENABLE_APPOINTMENT)}
                    value={values?.appointment}
                    handleChange={handleChange}
                    checkboxText="Yes"
                  />
                </div>
                <div className="wrap-staff-checkbox-field">
                  <CustomCheckbox
                    name="status"
                    label={t(constantString.EMPLOYEE_STATUS)}
                    value={values?.status}
                    handleChange={handleChange}
                    checkboxText="Available"
                  />
                </div>
              </div>
            </div>

            <p className="staff-form-label-text">{t(constantString.ADDRESS)}</p>
            <div className="wrap-staff-field">
              <div className="staff-input-wrap">
                <AppointmentTextField
                  name="permanent_street"
                  label={t(constantString.STREET)}
                  placeholder="Street"
                  onChange={handleChange}
                  value={values.permanent_street}
                  onBlur={handleBlur}
                  error={touched.permanent_street && errors.permanent_street}
                  mandatory
                />
              </div>
              <div className="staff-input-wrap">
                <AppointmentTextField
                  name="permanent_city"
                  label={t(constantString.CITY)}
                  placeholder="City"
                  onChange={handleChange}
                  value={values.permanent_city}
                  onBlur={handleBlur}
                  error={touched.permanent_city && errors.permanent_city}
                  mandatory
                />
              </div>
              <div className="staff-input-wrap">
                <AppointmentTextField
                  name="permanent_state"
                  label={t(constantString.STATE)}
                  placeholder="State"
                  onChange={handleChange}
                  value={values.permanent_state}
                  onBlur={handleBlur}
                  error={touched.permanent_state && errors.permanent_state}
                  mandatory
                />
              </div>
              <div className="staff-input-wrap">
                <AppointmentTextField
                  name="permanent_zipcode"
                  label={t(constantString.POSTAL_CODE)}
                  placeholder="Postal Code"
                  onChange={handleChange}
                  value={values.permanent_zipcode}
                  onBlur={handleBlur}
                  maxLength={7}
                  error={touched.permanent_zipcode && errors.permanent_zipcode}
                  mandatory
                />
              </div>
              <div className="staff-input-wrap">
                <AppointmentSelectBox2
                  options={countryList}
                  name="permanent_country"
                  label={t(constantString.COUNTRY)}
                  placeholder="Country"
                  onChange={handleChange}
                  value={values.permanent_country}
                  error={touched.permanent_country && errors.permanent_country}
                  mandatory
                />
              </div>
            </div>

            <div className="wrap-staff-field">
              <TextArea
                label={t(constantString.NOTE)}
                rows={4}
                cols={50}
                placeholder="Notes"
                onChange={handleChange}
                id="description"
                name="description"
                onBlur={handleBlur}
                value={values.description}
                style={{
                  paddingLeft: "2rem",
                  paddingTop: "1.2rem",
                  paddingRight: "1rem",
                }}
                maxLength={150}
              />
            </div>

            <div className="btn-div header-popup-button">
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

export default AddStaffModal;
