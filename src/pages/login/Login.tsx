import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicPath } from "../../components/constants/routes.c";
import PublicWrapper from "../../components/wrappers/PublicWrapper";
import CustomInput from "../../components/input-fields/CustomInput";
import CustomButton from "../../components/buttons/CustomButton";
import "./loginStyle.css";
import { useFormik } from "formik";
import { loginAPI } from "../../redux/auth/action";
import user from "../../components/assets/user.png";
import lock from "../../components/assets/lock.png";
import eye from "../../components/assets/eye.png";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { loginRequest } from "../../utils/types/requestType";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  selectAuthData,
  selectOwnerLoading,
  selectRegisterSuccess,
} from "../../redux/auth/selector";

import { useAppDispatch, useAppSelector } from "../../redux";
import { requiredSchema } from "../../utils/validation";
import loginImg from "../../components/assets/login-img.png";
import { constantString } from "../../utils/constantString";
import { setResgisterSuccess } from "../../redux/auth/slice";
import CircularLoader from "../../components/loading/CircularLoader";

const Login = () => {
  const auth = useAppSelector(selectAuthData);
  const [showPassword, setShowPassword] = useState(true);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector(selectOwnerLoading);
  const isRegisterSuccess = useAppSelector(selectRegisterSuccess);

  useEffect(() => {
    if (isRegisterSuccess) {
      dispatch(setResgisterSuccess(false));
    }
  }, [isRegisterSuccess]);

  const initialValues: loginRequest = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: requiredSchema("Email"),
    password: requiredSchema("Password"),
  });
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body: loginRequest = {
        email: values.email,
        password: values.password,
      };
      dispatch(loginAPI(body));
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

  return (
    <PublicWrapper>
      {isLoading && <CircularLoader />}
      <form onSubmit={handleSubmit} className="login-form">
        <span className="login-your-account">
          {t(constantString.LOGIN_YOUR_ACCOUNT)}
        </span>
        <div className="loginimg-div">
          <img alt="login-img" className="login-img" src={loginImg} />
        </div>

        <div className="ragister-form">
          <CustomInput
            label="Email"
            startIcon={user}
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
            label="Password"
            startIcon={lock}
            endIcon={
              showPassword ? (
                <img
                  className="custom-input-end-icon"
                  src={eye}
                  alt="endIcon"
                  onClick={() => {
                    setShowPassword(false);
                  }}
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => {
                    setShowPassword(true);
                  }}
                  style={{ position: "absolute", right: "20px", top: "30px" }}
                />
              )
            }
            onChange={handleChange}
            password={showPassword && "password"}
            id="password"
            name="password"
            onBlur={handleBlur}
            value={values.password}
            error={touched.password && errors.password}
            mandatory
          />
          {/* <div className="forgot-button-div">
            <span className="forgot-password-button">
              {t(constantString.FORGOT_PASSWORD)}
            </span>
          </div> */}
          <CustomButton>{t(constantString.LOGIN)}</CustomButton>
          {/* <div className="link-login">
            {t(constantString.CREATE_NEW_ACCOUNT)}
            <u>
              <span onClick={() => navigate(PublicPath.register)}>
                {" "}
                {t(constantString.SIGN_UP)}
              </span>
            </u>
          </div> */}
        </div>
      </form>
    </PublicWrapper>
  );
};

export default Login;
