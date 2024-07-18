import { useEffect, useState } from "react";
import CustomInput from "../../components/input-fields/CustomInput";
import CustomButton from "../../components/buttons/CustomButton";
import PublicWrapper from "../../components/wrappers/PublicWrapper";
import "./registerStyle.css";
import { PrivatePath, PublicPath } from "../../components/constants/routes.c";
import { useFormik } from "formik";
import {
  setEmailVerification,
  setResgisterSuccess,
  setShowOTPModal,
} from "../../redux/auth/slice";
import { useSelector } from "react-redux";
import {
  selectEmailVerified,
  selectEmailVerifyLoading,
  selectOTPModal,
  selectOwnerData,
  selectRegisterLoading,
  selectRegisterSuccess,
} from "../../redux/auth/selector";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import OtpInput from "react-otp-input";
import { otpPopupstyle } from "../../components/custom-appointment-popup/style";
import { emailVerification, fetchSignupAPI } from "../../redux/auth/action";
import { useAppDispatch, useAppSelector } from "../../redux";
import { signupRequest } from "../../utils/types/requestType";
import { useNavigate } from "react-router-dom";
import { signupInitialValuesProps } from "./type";
import { useTranslation } from "react-i18next";
import { constantString } from "../../utils/constantString";
import * as Yup from "yup";

import {
  bussinessNameSchema,
  confirmPasswordSchema,
  countrySchema,
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
} from "../../utils/validation";
import { DropDown } from "../../components/dropdown";
import { fetchCountryList } from "../../redux/meta/action";
import { selectCountryList } from "../../redux/meta/selector";
import { MobileInput } from "../../components/phone-input/PhoneInput";
import { Typography } from "@mui/material";
import CircularLoader from "../../components/loading/CircularLoader";

const Register = () => {
  const dispatch = useAppDispatch();
  const otpModal = useSelector(selectOTPModal);
  const countryList = useAppSelector(selectCountryList) ?? [];
  const [otp, setOtp] = useState("");
  const isEmailVerified = useAppSelector(selectEmailVerified);
  const registerSuccess = useAppSelector(selectRegisterSuccess);
  const isLoading = useAppSelector(selectRegisterLoading);
  const isEmailVerifyLoading = useAppSelector(selectEmailVerifyLoading);

  const navigate = useNavigate();
  const ownerData = useAppSelector(selectOwnerData);

  const otpModalStyle = {
    position: "absolute",
    top: "22vh",
    left: "35%",
    transform: "translate(-50%, -50%)",
    width: "33%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "1rem",
    boxShadow: 24,
    // p: 3,
  };

  useEffect(() => {
    if (registerSuccess) {
      // navigate(PrivatePath.create);
      navigate(PublicPath.login);
    }
  }, [registerSuccess]);

  useEffect(() => {
    dispatch(fetchCountryList());
  }, []);

  const validationSchema = Yup.object({
    email: emailSchema(),
    firstName: nameSchema("First Name"),
    lastName: nameSchema("Last Name"),
    password: passwordSchema(),
    confirm_password: confirmPasswordSchema(),
    // country: countrySchema(),
    phone_number: phoneSchema(),
    bussiness_name: bussinessNameSchema(),
  });

  const initialValues: signupInitialValuesProps = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    bussiness_name: "",
    phone_number: "",
    country: "",
    countryName: "",
    countryCode: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body: signupRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.countryCode + values.phone_number,
        title: values.bussiness_name,
      };
      dispatch(fetchSignupAPI({ body, navigate }));
    },
  });

  const {
    handleSubmit,
    handleReset,
    handleChange,
    values,
    handleBlur,
    setFieldValue,
    errors,
    touched,
  } = formik;

  const { t } = useTranslation();
  return (
    <PublicWrapper>
      {isLoading && <CircularLoader />}
      {isEmailVerifyLoading && <CircularLoader />}

      <form onSubmit={handleSubmit}>
        <div className="container-signup">
          <h1 className="login-your-account">
            {t(constantString.CREATE_YOUR_ACCOUNT)}
          </h1>
          <h4 className="login-field-required">
            {t(constantString.FIELDS_ARE_REQUIRED)}
          </h4>

          <div className="ragister-form">
            <div className="two-field-form">
              <CustomInput
                label="Last Name"
                onChange={handleChange}
                id="lastName"
                name="lastName"
                onBlur={handleBlur}
                value={values.lastName}
                error={touched.lastName && errors.lastName}
                mandatory
              />
              <CustomInput
                label="First Name"
                onChange={handleChange}
                id="firstName"
                onBlur={handleBlur}
                value={values.firstName}
                error={touched.firstName && errors.firstName}
                mandatory
              />
            </div>

            <div className="two-field-form">
              <CustomInput
                label="Email"
                onChange={handleChange}
                id="email"
                name="email"
                onBlur={handleBlur}
                value={values.email}
                maxLength={50}
                error={touched.email && errors.email && errors.email}
                mandatory
              />
              <CustomInput
                label="Business Name"
                onChange={handleChange}
                id="bussiness_name"
                name="bussiness_name"
                onBlur={handleBlur}
                value={values.bussiness_name}
                error={touched.bussiness_name && errors.bussiness_name}
                mandatory
              />
            </div>
            <div className="two-field-form">
              <CustomInput
                label="Password"
                onChange={handleChange}
                password="password"
                id="password"
                name="password"
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && errors.password}
                infoIcon={true}
                mandatory
              />
              <CustomInput
                label="Confirm Password"
                onChange={handleChange}
                id="confirm_password"
                password="password"
                name="confirm_password"
                onBlur={handleBlur}
                value={values.confirm_password}
                error={touched.confirm_password && errors.confirm_password}
                mandatory
              />
            </div>
          </div>

          <div className="country-phone-wrap">
            <DropDown
              label="Country"
              option={countryList}
              onSelectedValue={(e, value) => {
                // setFieldValue("countryName", value.slug);
                setFieldValue("country", value.value, true);
                setFieldValue("countryCode", value.phoneCode);
                handleChange(e);
              }}
              name="country"
              id="country"
              value={values.country}
              error={touched.country && errors.country && errors.country}
              mandatory
            />

            <MobileInput
              label="Phone"
              onChange={handleChange}
              id="phone_number"
              name="phone_number"
              onBlur={handleBlur}
              value={values.phone_number}
              error={touched.phone_number && errors.phone_number}
              countryCode={values.countryCode}
              mandatory
            />
          </div>

          <CustomButton>{t(constantString.SIGN_UP)}</CustomButton>
          <div className="link-login">
            {t(constantString.HAVE_AN_ACCOUNT)}{" "}
            <u>
              {" "}
              <span
                onClick={() => {
                  navigate(PublicPath.login);
                }}
                className="link-login"
              >
                {t(constantString.LOGIN)}{" "}
              </span>
            </u>
          </div>
        </div>
      </form>

      {/* {otpModal && (
        <div className="wrap-modal">
          <CustomPopup
            open={otpModal}
            onClose={() => dispatch(setShowOTPModal(false))}
            style={otpModalStyle}
          >
            <AppointmentPopupHeader
              className="otp-header-wrap    "
              onClose={() => dispatch(setShowOTPModal(false))}
            >
              <b className="otp-modal-header">
                {t(constantString.ENTER_OTP_VERIFY)}
              </b>
            </AppointmentPopupHeader>

            <div className="otp-wrap">
              <p className="text-color">
                {t(constantString.EMAIL_VERIFICATION_TEXT)}
              </p>
              <OtpInput
                value={otp}
                containerStyle={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "center",
                }}
                inputStyle={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid #DADADA",
                  borderRadius: "5px",
                }}
                onChange={setOtp}
                numInputs={4}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
              <CustomButton
                style={{ width: "40%", marginTop: "30px" }}
                onClick={() =>
                  dispatch(
                    emailVerification({
                      value: { otp: otp },
                      id: ownerData?.user?.id,
                      type: "owner",
                    })
                  )
                }
              >
                {t(constantString.VERIFY)}
              </CustomButton>
              <p className="text-color">
                {t(constantString.DID_NOT_RECEIVE_CODE)}
              </p>
              <p className="text-color">
                <a>{t(constantString.RESEND_OTP)}</a>
              </p>
            </div>
          </CustomPopup>
        </div>
      )} */}

      {isEmailVerified && (
        <CustomPopup
          open={isEmailVerified}
          onClose={() => dispatch(setEmailVerification(false))}
          style={otpModalStyle}
        >
          <div className="welcome-wrap">
            <Typography variant="h4">{t(constantString.WELCOME)}</Typography>
            <Typography variant="h6" sx={{ marginTop: "10px" }}>
              {t(constantString.THANKS_DESCRIPTION)}
            </Typography>
            <CustomButton
              style={{ width: "40%", marginTop: "30px" }}
              onClick={() => {
                dispatch(setResgisterSuccess(false));
                dispatch(setEmailVerification(false));
                navigate(PublicPath.login);
              }}
            >
              {t(constantString.LOGIN)}
            </CustomButton>
          </div>
        </CustomPopup>
      )}
    </PublicWrapper>
  );
};
export default Register;
