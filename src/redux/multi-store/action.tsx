import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../network/ENDPOINT";
import { getAPI, postAPI } from "../../network/Api";
import {
  BusinessLocation,
  ResponseMultiStore,
  Users,
} from "../../utils/types/responseType";
import { apiSignature } from "./api-signature";
import {
  AddAddressRequest,
  RequestAddEditMultiStore,
} from "../../utils/types/requestType";
import { checkMessage } from "../../utils/general";
import { setMultiStoreList, setOpenLocation, setOpenStoreModal } from "./slice";
import { clearRedux, setCountData, setCurrentOutlet, setOwnerData, setToken } from "../auth/slice";
import { PrivatePath } from "../../components/constants/routes.c";
import { NavigateFunction } from "react-router-dom";
import { fetchUserData } from "../users/action";
import { fetchServiceList } from "../service/action";
import { fetchEmployeeData } from "../staff/action";
import { fetchBussinessPreferenceList, fetchCountryList } from "../meta/action";

export const fetchMultiStoreList = createAsyncThunk<ResponseMultiStore, string>(
  apiSignature.FETCH_MULTI_STORE_LIST,
  async (id, thunkAPI) => {
    try {
      const response = await getAPI(`${ENDPOINTS.GET_MULTI_STORE_API}/${id}`);
      if (response?.success) {
        const result = response.data?.records;
        return result;
      }
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const addStoreAPI = createAsyncThunk<
  ResponseMultiStore,
  RequestAddEditMultiStore
>(apiSignature.ADD_STORE_API, async (payload, thunkAPI) => {
  const { body, companyId } = payload;
  const { dispatch } = thunkAPI;
  try {
    const response = await postAPI(`${ENDPOINTS.ADD_STORE_API}`, body);
    if (response?.success) {
      const result = response?.data;
      dispatch(fetchMultiStoreList(body?.ownerId));
      dispatch(setOpenStoreModal(false));
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

export const updateStoreAPI = createAsyncThunk<
  ResponseMultiStore,
  RequestAddEditMultiStore
>(apiSignature.UPDATE_STORE_API, async (payload, thunkAPI) => {
  const { body, companyId } = payload;
  const { dispatch } = thunkAPI;
  try {
    const response = await postAPI(`${ENDPOINTS.ADD_STORE_API}`, body);
    if (response?.success) {
      const result = response?.data;
      dispatch(fetchMultiStoreList(body?.ownerId));
      dispatch(setOpenStoreModal(false));
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
}
);


export const fetchBussinessCountData = createAsyncThunk<
  ResponseMultiStore[],
  { newStoreData: Users; navigate: NavigateFunction ,currentOutletData:BusinessLocation,
    storeDataList:ResponseMultiStore
  }
>(
  apiSignature.FETCH_BUSSINESS_COUNT_LIST,
  async ({ newStoreData, navigate,currentOutletData,storeDataList }, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const response = await getAPI(
        `${ENDPOINTS.BUSSINESS_COUNT_API}/${currentOutletData?.id}`
      );
      if (response?.success) {
        const result = response.data;
        dispatch(clearRedux());
        navigate(`${PrivatePath.home}`);
        dispatch(setMultiStoreList(storeDataList));
        dispatch(setToken(newStoreData?.token));
        dispatch(setOwnerData({ ...newStoreData, companyData: result }));
        dispatch(setCurrentOutlet(currentOutletData));

        dispatch(fetchUserData({ companyId : currentOutletData?.id }));
        dispatch(fetchServiceList({ id: currentOutletData?.id }));
        dispatch(fetchEmployeeData(currentOutletData?.id));
        dispatch(fetchCountryList());
        dispatch(fetchBussinessPreferenceList(currentOutletData?.id));

        dispatch(
          setCountData({
            employeeCount: result?.employeeCount,
            serviceCount: result?.serviceCount,
            appointmentCount: result?.appointmentCount,
            bussinessSetUpDataCount: result?.bussinessSetUpDataCount,
          })
        );
        return result;
      }
    } catch (error) {
      checkMessage(error);
      console.log("error", error);
    }
  }
);

export const addStoreLocationAPI = createAsyncThunk<
  BusinessLocation,
  {body:AddAddressRequest, ownerId:string}
>(apiSignature.ADD_STORE_LOCATION, async ({body, ownerId}, thunkAPI) => {
  const { dispatch } = thunkAPI;
  try {
    const response = await postAPI(ENDPOINTS.ADD_STORE_LOCATION, body);
    if (response?.success) {
      const result = response?.data;
      dispatch(fetchMultiStoreList(ownerId));
      dispatch(setOpenLocation(false));
      return result;
    } else {
      throw response;
    }
  } catch (error) {
    checkMessage(error);
  }
});


export const updateStoreLocationAPI = createAsyncThunk<
  BusinessLocation,
  {body:AddAddressRequest, ownerId:string}
>(apiSignature.UPDATE_STORE_LOCATION, async ({body, ownerId}, thunkAPI) => {
  const { dispatch } = thunkAPI;
  try {
    const response = await postAPI(ENDPOINTS.ADD_STORE_LOCATION, body);
    if (response?.success) {
      const result = response?.data;
      dispatch(fetchMultiStoreList(ownerId));
      dispatch(setOpenLocation(false));
      return result;
    } else {
      throw response;
    }
  } catch (error) {
    checkMessage(error);
  }
});

