import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../network/ENDPOINT";
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../network/Api";
import {
  CountryListProps,
  ResponseServiceList,
  ServiceListItem,
  Users,
} from "../../utils/types/responseType";
import {
  addCategoryRequest,
  addSubCategoryRequest,
  deleteCategoryRequest,
  deleteSubCategoryRequest,
  updateCategoryRequest,
  updateCategoryStatusRequest,
  updateSubCategoryRequest,
  updateSubCategoryStatusRequest,
} from "../../utils/types/requestType";
import { setShowAlert } from "../meta/slice";
import {
  setSelectedCategoryItem,
  setSelectedSubCategoryItem,
  setShowCategoryModal,
  setShowSubCategoryModal,
  setUpdateServiceList,
} from "./slice";
import { apiSignature } from "./api-signature";
import { setCountData } from "../auth/slice";
import {  messages } from "../../utils/messages";
import { checkMessage } from "../../utils/general";
import translateLabel from "../../components/hooks/translationLable";

export const fetchServiceList = createAsyncThunk<
  ResponseServiceList[],
  { id: string }
>(apiSignature.SERVICE_LIST, async (props, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const { id } = props;
  try {
    const response = await getAPI(
      `${ENDPOINTS.GET_SERVICE_API}?companyId=${id}`
    );
    if (response?.success) {
      const serviceResponse = response?.data?.serviceCatalogue;
      let srvCount = 0;
      serviceResponse?.map((item: ResponseServiceList) => {
        srvCount = srvCount + item?.svcCtlgItems?.length;
      });
      dispatch(setCountData({ serviceCount: srvCount }));
      return serviceResponse;
    } else {
      throw response;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

export const addServiceCategoryAPI = createAsyncThunk<
  ResponseServiceList,
  addCategoryRequest
>(
  apiSignature.SERVICE_ADD_CATEGORY,
  async (values: addCategoryRequest, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const serviceData: any = getState();
    const temp = [...serviceData?.service?.serviceList];
    try {
      const response = await postAPI(ENDPOINTS.ADD_CATEGORY_API, values);
      if (response?.success) {
        const result = response?.data;
        const resultData = { ...result, svcCtlgItems: [] };
        // dispatch(fetchServiceList({ id: values?.company }));
        dispatch(setUpdateServiceList([...temp, resultData]));
        dispatch(setShowCategoryModal(false));
        dispatch(setSelectedCategoryItem(null));
        dispatch(
          setShowAlert({
            message:translateLabel(messages?.[response?.messageCode]?.message),
            type: "success",
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

export const addServiceSubCategoryAPI = createAsyncThunk<
  void,
  addSubCategoryRequest
>(
  apiSignature.SERVICE_ADD_SUB_CATEGORY,
  async (values: addSubCategoryRequest, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const serviceData: any = getState();
    const temp = [...serviceData?.service?.serviceList];
    try {
      const response = await postAPI(ENDPOINTS.ADD_SUB_CATEGORY_API, values);
      if (response?.success) {
        const result = response?.data;
        let srvCount = 0;
        const serviceUpdatedData = temp?.map((item, key) => {
          let tem = item?.svcCtlgItems;
          srvCount = srvCount + item?.svcCtlgItems?.length;
          if (values?.catalogueId == item?.id) {
            return {
              ...item,
              svcCtlgItems: [...tem, result],
            };
          }
          return item;
        });
        dispatch(setCountData({ serviceCount: srvCount + 1 }));
        dispatch(setUpdateServiceList(serviceUpdatedData));
        dispatch(setShowSubCategoryModal(false));
        dispatch(setSelectedCategoryItem(null));
        dispatch(
          setShowAlert({
            message: translateLabel(messages?.[response?.messageCode]?.message),
            type: "success",
          })
        );
      }
    } catch (error) {
    
      checkMessage(error);
      console.log("error", error);
    }
  }
);

export const updateServiceCategoryAPI = createAsyncThunk<
  ResponseServiceList,
  updateCategoryRequest
>(apiSignature.UPDATE_SERVICE_CATEGORY, async (payload, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const { values, id } = payload;
  const serviceData: any = getState();
  const temp = [...serviceData?.service?.serviceList];
  try {
    const response = await patchAPI(
      `${ENDPOINTS.UPDATE_CATEGODY_API}/${id}`,
      values
    );
    if (response?.success) {
      const result = response?.data;
      // dispatch(fetchServiceList({ id: values?.company }));
      const serviceUpdatedData = temp?.map((item, key) => {
        if (id == item?.id) {
          return { ...result, svcCtlgItems: item?.svcCtlgItems };
        }
        return item;
      });
      dispatch(setUpdateServiceList(serviceUpdatedData));
      dispatch(setShowCategoryModal(false));
      dispatch(setSelectedCategoryItem(null));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

export const updateServiceSubCategoryAPI = createAsyncThunk<
  ResponseServiceList,
  updateSubCategoryRequest
>(apiSignature.UPDATE_SERVICE, async (payload, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const { values, id } = payload;
  const serviceData: any = getState();
  const temp = [...serviceData?.service?.serviceList];
  try {
    const response = await patchAPI(
      `${ENDPOINTS.UPDATE_SUB_CATEGODY_API}/${id}`,
      values
    );
    if (response?.success) {
      const result = response?.data;

      const serviceUpdatedData = temp?.map((item, key) => {
        if (values?.catalogueId == item?.id) {
          return {
            ...item,
            svcCtlgItems: item.svcCtlgItems.map(
              (i: ServiceListItem, index: number) => {
                if (i.id === id) {
                  return { ...i, ...result };
                }
                return i;
              }
            ),
          };
        }
        return item;
      });
      dispatch(setUpdateServiceList(serviceUpdatedData));
      dispatch(setShowSubCategoryModal(false));
      dispatch(setSelectedCategoryItem(null));
      dispatch(setSelectedSubCategoryItem(null));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

// TODO remove in future
export const updateCategoryStatusAPI = createAsyncThunk<
  ResponseServiceList,
  updateCategoryStatusRequest
>(apiSignature.UPDATE_CATEGORY_STATUS, async (payload, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;

  const { values, id, company } = payload;
  const serviceData: any = getState();
  const temp = [...serviceData?.service?.serviceList];

  try {
    const response = await patchAPI(
      `${ENDPOINTS.UPDATE_CATEGORY_STATUS_API}/${id}`,
      values
    );
    if (response?.success) {
      const result = response?.data;

      const serviceUpdatedData = temp?.map((item, key) => {
        if (id == item?.id) {
          return {
            ...item,
            status: item?.status == "active" ? "inactive" : "active",
          };
        }
        return item;
      });

      dispatch(setUpdateServiceList(serviceUpdatedData));

      // dispatch(fetchServiceList({ id: company }));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      dispatch(setSelectedCategoryItem(null));
      // dispatch(setShowAlert({ message: response?.message, type: "success" }));
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

// TODO remove in future
export const updateSubCategoryStatusAPI = createAsyncThunk<
  ResponseServiceList,
  updateSubCategoryStatusRequest
>(apiSignature.UPDATE_SERVICE_STATUS, async (payload, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;

  const { values, id, company, catalogue } = payload;
  const serviceData: any = getState();
  const temp = [...serviceData?.service?.serviceList];

  try {
    const response = await patchAPI(
      `${ENDPOINTS.UPDATE_SUB_CATEGORY_STATUS_API}/${id}`,
      values
    );
    if (response?.success) {
      const result = response?.data;
      const serviceUpdatedData = temp?.map((item, key) => {
        if (catalogue == item?.id) {
          return {
            ...item,
            svcCtlgItems: item.svcCtlgItems.map(
              (i: ServiceListItem, index: number) => {
                if (i.id === id) {
                  return { ...i, ...result };
                }
                return i;
              }
            ),
          };
        }
        return item;
      });
      dispatch(setUpdateServiceList(serviceUpdatedData));
      dispatch(setShowSubCategoryModal(false));
      dispatch(setSelectedCategoryItem(null));
      dispatch(setSelectedSubCategoryItem(null));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

export const deleteServiceCategoryAPI = createAsyncThunk<
  ResponseServiceList,
  deleteCategoryRequest
>(apiSignature.DELETE_CATEGORY, async (payload, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const { id } = payload;
  const serviceData: any = getState();
  const temp = [...serviceData?.service?.serviceList];
  try {
    const response = await deleteAPI(`${ENDPOINTS.DELETE_CATEGORY_API}/${id}`);
    if (response?.success) {
      const result = response?.data;
      const serviceUpdatedData = temp?.filter((i) => {
        return i?.id != id;
      });
      dispatch(setUpdateServiceList(serviceUpdatedData));
      // dispatch(fetchServiceList({ id: company }));
      dispatch(setSelectedCategoryItem(null));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

export const deleteServiceSubCategoryAPI = createAsyncThunk<
  ResponseServiceList,
  deleteSubCategoryRequest
>(apiSignature.DELETE_SERVICE, async (payload, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const { id, catalogue } = payload;
  const serviceData: any = getState();
  const temp = [...serviceData?.service?.serviceList];
  try {
    const response = await deleteAPI(
      `${ENDPOINTS.DELETE_SUB_CATEGORY_API}/${id}`
    );
    let srvCount = 0;
    if (response?.success) {
      const result = response?.data;
      const serviceUpdatedData = temp?.map((item, index) => {
        srvCount = srvCount + item?.svcCtlgItems?.length;
        if (catalogue == item?.id) {
          return {
            ...item,
            svcCtlgItems: item?.svcCtlgItems?.filter((i: ServiceListItem) => {
              return i?.id != id;
            }),
          };
        }
        dispatch(setCountData({ serviceCount: srvCount - 1 }));
        return item;
      });
      dispatch(setUpdateServiceList(serviceUpdatedData));
      dispatch(setSelectedCategoryItem(null));
      dispatch(setSelectedSubCategoryItem(null));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});
