import React, { useEffect } from "react";
import AppointmentTextField from "../../appointment-popup/AppointmentTextField";
import { genderOptions } from "../data";
import AppointmentSelectBox2 from "../../appointment-popup/AppointmentSelectBox2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addCustomer, updateCusomer } from "../../../redux/users/action";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { constantString } from "../../../utils/constantString";
import {
  customerPhoneSchema,
  emailSchema,
  genderSchema,
  nameSchema,
} from "../../../utils/validation";
import { MobilePhoneInput } from "../../mobile-input/MobileInput";
import {
  selectLoading,
  selectOpenAddCustomerPopup,
} from "../../../redux/users/selector";
import { useTranslation } from "react-i18next";
import "./style.css";
import { useCompanyData } from "../../hooks/useCompanyData";
import CircularLoader from "../../loading/CircularLoader";

const AddCustomer = () => {
  const dispatch = useAppDispatch();
  const company_id = useCompanyData();
  const editCustomer = useAppSelector(selectOpenAddCustomerPopup);
  const isLoading = useAppSelector(selectLoading);
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    // email: emailSchema(),
    firstName: nameSchema("First Name"),
    lastName: nameSchema("Last Name"),
    phoneNumber: customerPhoneSchema(),
    gender: genderSchema(),
  });

  const initialValues = {
    firstName: editCustomer?.firstName ?? "",
    lastName: editCustomer?.lastName ?? "",
    email: editCustomer?.email ?? "",
    phoneNumber: editCustomer?.phoneNumber ?? "",
    gender: editCustomer?.gender ?? "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body = {
        ...(editCustomer && { id: editCustomer?.id }),
        firstName: values?.firstName,
        lastName: values?.lastName,
        ...(values?.email && { email: values?.email }),
        phoneNumber: values?.phoneNumber,
        gender: values?.gender,
      };
      {
        editCustomer
          ? dispatch(updateCusomer({ body, id: company_id }))
          : dispatch(addCustomer({ body, id: company_id }));
      }
    },
  });

  const {
    handleSubmit,
    handleReset,
    handleChange,
    setFieldValue,
    values,
    handleBlur,
    submitForm,
    errors,
    touched,
  } = formik;



  return (
    <>
    {isLoading && <CircularLoader />}
      <div
        className={`popup-wrapper customer-add-pops edit-customer-popup`}
      >
        <form onSubmit={handleSubmit}>
          <div className="mt-1">
            {/* {!editCustomer && <h3>ADD NEW CUSTOMER</h3>} */}
            <div
              style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
            >
              <AppointmentTextField
                name="lastName"
                onChange={handleChange}
                label={t(constantString.LAST_NAME)}
                placeholder="Ex. Nutt"
                value={values?.lastName}
                onBlur={handleBlur}
                error={touched.lastName && errors.lastName}
                mandatory
              />
              <AppointmentTextField
                name="firstName"
                onChange={handleChange}
                label={t(constantString.FIRST_NAME)}
                placeholder="Ex. Hazel"
                value={values?.firstName}
                onBlur={handleBlur}
                error={touched.firstName && errors.firstName}
                mandatory
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "10px",
                flexDirection: "column",
              }}
            >
              <AppointmentTextField
                name="email"
                onChange={handleChange}
                label={t(constantString.EMAIL)}
                placeholder="Ex. hazel.nutt@gmail.com"
                value={values.email}
                onBlur={handleBlur}
                // error={touched.email && errors.email}
                maxLength={50}
                // mandatory
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "10px",
                flexDirection: "column",
              }}
            >
              <MobilePhoneInput
                name="phoneNumber"
                label={t(constantString.MOBILE)}
                placeholder="+91 75 180 4043"
                onChange={(val: string) => {
                  setFieldValue("phoneNumber", val, true);
                }}
                onBlur={handleBlur}
                value={values?.phoneNumber}
                error={touched.phoneNumber && errors.phoneNumber}
                mandatory
              />

              <AppointmentSelectBox2
                name="gender"
                options={genderOptions}
                onChange={(e) => {
                  handleChange(e);          
                }}
                placeholder="Male"
                label={t(constantString.GENDER)}
                value={values?.gender}
                error={touched.gender && errors.gender}
                mandatory
              />
            </div>
          
            <center>
                <button className="mt-3 bg-orange button white verify">
                  { t(constantString.SAVE) }
                </button>
              </center>
          </div>
        </form>
      </div>

      {/* </CustomPopup> */}
    </>
  );
};

export default AddCustomer;
