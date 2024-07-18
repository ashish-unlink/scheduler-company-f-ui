import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../network/ENDPOINT";
import { patchAPI, postAPI } from "../../network/Api";
import { Users } from "../../utils/types/responseType";
import { loginRequest, signupRequest } from "../../utils/types/requestType";
import {
  authenticate,
  resetProfile,
  setCountData,
  setShowOTPModal,
} from "./slice";
import { apiSignature } from "./api-signature";
import { setShowAlert } from "../meta/slice";
import { fetchServiceList } from "../service/action";
import { fetchEmployeeData } from "../staff/action";
import { fetchBussinessPreferenceList, fetchCountryList } from "../meta/action";
import { fetchUserData } from "../users/action";
import { checkMessage } from "../../utils/general";
import { messages } from "../../utils/messages";
import translateLabel from "../../components/hooks/translationLable";
import { NavigateFunction } from "react-router-dom";
import { PublicPath } from "../../components/constants/routes.c";

export const loginAPI = createAsyncThunk<Users, loginRequest>(
  apiSignature.AUTH_LOGIN,
  async (values: loginRequest, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      const response = await postAPI(ENDPOINTS.LOGIN, values);
      if (response?.success) {
        const result = response?.data;
        const companyId = result?.company?.[0]?.id;
        const countData = result?.companyData;
        setTimeout(() => {
          dispatch(fetchUserData({companyId}));
          dispatch(fetchServiceList({ id: companyId }));
          dispatch(fetchEmployeeData(companyId));
          dispatch(fetchCountryList());
          dispatch(fetchBussinessPreferenceList(companyId));
          dispatch(
            setCountData({
              employeeCount: countData?.employeeCount,
              serviceCount: countData?.serviceCount,
              appointmentCount: countData?.appointmentCount,
              bussinessSetUpDataCount: countData?.bussinessSetUpDataCount,
            })
          );
          dispatch(authenticate(true));
          dispatch(
            setShowAlert({
              message: translateLabel(
                messages?.[response?.messageCode]?.message
              ),
              type: "success",
            })
          );
        }, 10);
        return result;
      } else {
        throw response;
      }
    } catch (error) {
      checkMessage(error);
    }
  }
);

export const fetchSignupAPI = createAsyncThunk<
  Users,
  { body: signupRequest; navigate: NavigateFunction }
>(apiSignature.AUTH_REGISTER, async (props, thunkAPI) => {
  const { body, navigate } = props;
  const { dispatch } = thunkAPI;
  try {
    const response = await postAPI(ENDPOINTS.SIGNUP_API, body);
    if (response?.success) {
      const result = response?.data;
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      navigate(PublicPath.login);
      // dispatch(setShowOTPModal(true));
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

export const emailVerification = createAsyncThunk<Users, any>(
  apiSignature.AUTH_EMAIL_VERIFY,
  async (props: any, thunkAPI) => {
    const { value, id, type } = props;
    const { dispatch } = thunkAPI;
    try {
      const response = await patchAPI(
        `${ENDPOINTS.EMAIL_VERIFICATION}/${id}`,
        value
      );
      if (response?.success) {
        dispatch(setShowOTPModal(false));
        const result = response?.data;
        // if (result?.role == "client") {
        //   dispatch(setSelectedClient(result));
        // }
        return result;
      }
    } catch (error) {
      checkMessage(error);
      console.log("error", error);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    // Perform any async operations here (e.g., log out user from server)
    // For now, just dispatch the logout action synchronously
    dispatch(resetProfile());
  }
);
