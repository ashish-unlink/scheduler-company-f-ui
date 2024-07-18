import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../network/ENDPOINT";
import { getAPI, patchAPI, postAPI } from "../../network/Api";
import { ResponseUser, Users } from "../../utils/types/responseType";
import {
  RequestClientVerification,
  customerRegisterRequest,
} from "../../utils/types/requestType";
import { setShowAlert } from "../meta/slice";
import { apiSignature } from "./api-signature";
import { setCustomerCount, setOpenAddCustomerPopup } from "./slice";
import { setSelectedClient } from "../appointment/slice";
import { messages } from "../../utils/messages";
import { checkMessage } from "../../utils/general";
import translateLabel from "../../components/hooks/translationLable";

export const fetchUserData = createAsyncThunk<
  ResponseUser,
  { companyId: string; paginationUrl?: string }
>(apiSignature.USER_DATA, async ({ companyId, paginationUrl }, thunkAPI) => {
  const { dispatch } = thunkAPI;
  try {
    const response = await getAPI(
      `${ENDPOINTS.USER_API}?companyId=${companyId}&role=client${paginationUrl != undefined ? paginationUrl : ''}`
    );
    if (response?.success) {
      const result = response.data;
      dispatch(setCustomerCount(result?.count));
      return result;
    }
  } catch (error) {
    // dispatch(
    //   setShowAlert({ message: error.response?.data?.message, type: "error" })
    // );
    checkMessage(error);
    console.log("error", error);
  }
});

export const addCustomer = createAsyncThunk<Users, customerRegisterRequest>(
  apiSignature.USER_ADD_CUSTOMER,
  async (props: customerRegisterRequest, thunkAPI) => {
    const { body, id } = props;

    const { dispatch } = thunkAPI;
    try {
      const response = await postAPI(
        `${ENDPOINTS.ADD_CUSTOMER_API}/${id}`,
        body
      );
      if (response?.success) {
        const result = response?.data;
        // dispatch(setShowAlert({ message: response?.message, type: "success" }));
        dispatch(
          setShowAlert({
            message: translateLabel(messages?.[response?.messageCode]?.message),
            type: "success",
          })
        );
        dispatch(setOpenAddCustomerPopup(false));

        // if (result?.role == "client") {
        // state.customerUserData = [...state?.customerUserData, action.payload];
        dispatch(setSelectedClient(result));
        // }
        return result;
      }
    } catch (error) {
      // dispatch(
      //   setShowAlert({ message: error.response?.data?.message, type: "error" })
      // );
      checkMessage(error);
      // console.log("error", error.response?.data?.message);
    }
  }
);

export const verifyCustomer = createAsyncThunk<void, RequestClientVerification>(
  apiSignature.USER_VERIFY,
  async (body, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      const response = await patchAPI(
        ENDPOINTS.CLIENT_EMAIL_VERIFICATION,
        body
      );
      if (response?.success) {
        const result = response?.data;
        return result;
      } else {
        throw response;
      }
    } catch (error) {
      // dispatch(
      //   setShowAlert({ message: error.response?.data?.message, type: "error" })
      // );
      checkMessage(error);
    }
  }
);

export const isUserVerify = createAsyncThunk<void, string>(
  apiSignature.IS_USER_VERIFY,
  async (email, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      const response = await getAPI(
        `${ENDPOINTS.VERIFY_USER_REFRESH}?email=${email}`
      );
      if (response?.success) {
        const result = response?.data;
        dispatch(setSelectedClient(result));

        return result;
      } else {
        throw response;
      }
    } catch (error) {
      // dispatch(
      //   setShowAlert({ message: error.response?.data?.message, type: "error" })
      // );
      checkMessage(error);
    }
  }
);
