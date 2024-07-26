import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../network/ENDPOINT";
import { getAPI, postAPI } from "../../network/Api";
import {
  CountryListProps,
  ResponseBussinessList,
  Users,
} from "../../utils/types/responseType";
import { apiSignature } from "./api-signature";
import { bussinessSetupRequest } from "../../utils/types/requestType";
import { setSettingBussinessSetUP, setShowAlert } from "./slice";
import { setCountData } from "../auth/slice";
import { checkMessage } from "../../utils/general";

export const fetchCountryList = createAsyncThunk<CountryListProps[], void>(
  apiSignature.META_COUNTRY_LIST,
  async (body, thunkAPI) => {
    try {
      const response = await getAPI(ENDPOINTS.COUNTRY_LIST_API);
      if (response?.success) {
        const countryData = response?.data?.country;
        const temp = countryData?.map(
          (item: CountryListProps, index: number) => {
            return { ...item, label: item?.title, value: item?.id };
          }
        );
        return temp;
      } else {
        throw response;
      }
    } catch (error) {
      // dispatch(setShowAlert({message:error.response?.data?.message,type:"error"}))
      console.log("error", error);
    }
  }
);

export const fetchBussinessPreferenceList = createAsyncThunk<
  ResponseBussinessList[],
  string
>(apiSignature.META_FETCH_SET_UP_BUSSINESS, async (companyId, thunkAPI) => {
  try {
    const response = await getAPI(
      `${ENDPOINTS.GET_BUSSINESS_SETUP_API}?companyId=${companyId}`
    );
    if (response?.success) {
      const result = response?.data;
      return result;
    } else {
      throw response;
    }
  } catch (error) {
    // dispatch(setShowAlert({message:error.response?.data?.message,type:"error"}))
    console.log("error", error);
  }
});

export const setUpBussinessAPI = createAsyncThunk<void, bussinessSetupRequest>(
  apiSignature.META_SET_UP_BUSSINESS,
  async (body: bussinessSetupRequest, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const data: any = getState();
    const temp = { ...data?.meta?.businessSetupData };
    const companyId = body?.companyPreferences?.[0]?.companyId;
    try {
      const response = await postAPI(ENDPOINTS.SET_UP_BUSSINESS_API, body);
      if (response?.success) {
        const result = response?.data;
        dispatch(
          setCountData({
            bussinessSetUpDataCount: Object.keys(temp).length + 1,
          })
        );
        dispatch(setSettingBussinessSetUP(false));
        dispatch(fetchBussinessPreferenceList(companyId));
        dispatch(setShowAlert({message:response?.message,type:"success"}))
        return result;
      }
    } catch (error) {
      checkMessage(error);
      console.log("error", error);
    }
  }
);
