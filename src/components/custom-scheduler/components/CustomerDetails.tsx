import React, { useEffect } from "react";
import AppointmentTextField from "../../appointment-popup/AppointmentTextField";
import { genderOptions } from "../data";
import AppointmentSelectBox2 from "../../appointment-popup/AppointmentSelectBox2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addCustomer } from "../../../redux/users/action";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { constantString } from "../../../utils/constantString";
import {
  customerPhoneSchema,
  emailSchema,
  genderSchema,
  nameSchema,
} from "../../../utils/validation";
import { MobilePhoneInput } from "../../mobile-input/MobileInput";
import { selectOpenAddCustomerPopup } from "../../../redux/users/selector";
import { setOpenAddCustomerPopup } from "../../../redux/users/slice";
import { useTranslation } from "react-i18next";
import "./style.css";
import { useCompanyData } from "../../hooks/useCompanyData";

const AddCustomer = () => {
  const dispatch = useAppDispatch();
  const company_id = useCompanyData();
  // const isLoading = useAppSelector(selectLoading);
  const openAddCustomerPopup = useAppSelector(selectOpenAddCustomerPopup);

  const { t } = useTranslation();

  const validationSchema = Yup.object({
    // email: emailSchema(),
    firstName: nameSchema("First Name"),
    lastName: nameSchema("Last Name"),
    phoneNumber: customerPhoneSchema(),
    gender: genderSchema(),
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body = {
        firstName: values?.firstName,
        lastName: values?.lastName,
        ...(values?.email && { email: values?.email }),
        phoneNumber: values?.phoneNumber,
        gender: values?.gender,
      };
      dispatch(addCustomer({ body, id: company_id }));
      dispatch(setOpenAddCustomerPopup(false));
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

  useEffect(() => {
    if (
      values?.firstName &&
      values?.lastName &&
      values?.phoneNumber &&
      values?.gender &&
      openAddCustomerPopup
    ) {
      submitForm();
    }
  }, [openAddCustomerPopup]);

  return (
    <>
      <div className="popup-wrapper customer-add-pops">
        <form onSubmit={handleSubmit}>
          <div className="mt-1">
            <h3>ADD NEW CUSTOMER</h3>
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
                  // submitForm();
                  dispatch(setOpenAddCustomerPopup(true));
                }}
                placeholder="Male"
                label={t(constantString.GENDER)}
                value={values?.gender}
                error={touched.gender && errors.gender}
                mandatory
              />
            </div>
            {/* <center>
                <button className="mt-3 bg-orange button white verify">
                  ADD CUSTOMER
                </button>
              </center> */}
          </div>
        </form>
      </div>

      {/* </CustomPopup> */}
    </>
  );
};

export default AddCustomer;
