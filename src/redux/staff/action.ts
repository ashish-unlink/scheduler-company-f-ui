import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../network/ENDPOINT";
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../network/Api";
import {
  CountryListProps,
  ResponseAddCommission,
  ResponseServiceStaffRelation,
  ResponseUser,
  UserStaffs,
  Users,
} from "../../utils/types/responseType";
import {
  RequestAddEmployee,
  RequestAddEmployeeShift,
  RequestUpdateAttendence,
  addCommissionrequest,
} from "../../utils/types/requestType";
import { setShowAlert } from "../meta/slice";
import { apiSignature } from "./api-signature";
import {
  setAddStaffScheduleModal,
  setDeletedShiftItem,
  setSelectedStaffDetail,
  setShowAddStaffModal,
  setShowAssignServiceModal,
  setShowShiftDeleteModal,
  setShowStaffDelete,
  setStaffEditable,
  setStaffServiceDelete,
} from "./slice";
import { checkMessage, userName } from "../../utils/general";
import { setshowAttendenceModal } from "../attendence/slice";
import { setCountData } from "../auth/slice";
import { fetchAppointmentTimeBlockAPI } from "../appointment/action";
import dayjs from "dayjs";
import { setAppointmentFilterData } from "../appointment/slice";
import { messages } from "../../utils/messages";
import translateLabel from "../../components/hooks/translationLable";

export const fetchEmployeeData = createAsyncThunk<UserStaffs[], string>(
  apiSignature.FETCH_STAFF_LIST,
  async (id, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      const response = await getAPI(
        `${ENDPOINTS.USER_API}?companyId=${id}&role=employee`
      );
      if (response?.success) {
        const result = response.data?.users;
        const temp = result?.map((item: UserStaffs, index: number) => {
          return {
            ...item,
            label:userName(item?.firstName, item?.lastName),

            text: userName(item?.firstName, item?.lastName),
            billingAddresses: item?.billingAddresses?.map((item) => {
              return {
                ...item,
                country: {
                  ...item?.country,
                  label: item?.country?.title,
                  value: item?.country?.id,
                },
              };
            }),
          };
        });
        dispatch(setCountData({ employeeCount: response?.data?.count }));

        return temp;
        // return result;
      }
    } catch (error) {
      // dispatch(setShowAlert({message:error.response?.data?.message,type:"error"}))
      console.log("error", error);
    }
  }
);

export const addEmployee = createAsyncThunk<UserStaffs, RequestAddEmployee>(
  apiSignature.ADD_STAFF,
  async (payload, thunkAPI) => {
    const { body, id } = payload;
    const { dispatch, getState } = thunkAPI;
    const data: any = getState();
    const temp = [...data?.staff?.employeeList];
    try {
      const response = await postAPI(
        `${ENDPOINTS.ADD_EMPLOYEE_API}/${id}`,
        body
      );
      if (response?.success) {
        const result = response?.data;
        dispatch(setShowAddStaffModal(false));
        dispatch(
          setSelectedStaffDetail({
            ...result,
            text: userName(result?.firstName, result?.lastName),
          })
        );
        dispatch(
          fetchEmployeeServiceRelationData({
            companyId: id,
            employeeId: result?.id,
          })
        );
        dispatch(
          setShowAlert({
            message: translateLabel(messages?.[response?.messageCode]?.message),
            type: "success",
          })
        );
        dispatch(setCountData({ employeeCount: temp?.length + 1 }));
        return {
          ...result,
          text: userName(result?.firstName, result?.lastName),
        };
      }
    } catch (error) {
      // dispatch(
      //   setShowAlert({ message: error.response?.data?.message, type: "error" })
      // );
      checkMessage(error);
      console.log("error", error);
    }
  }
);

export const updateEmployee = createAsyncThunk<UserStaffs, RequestAddEmployee>(
  apiSignature.UPDATE_STAFF,
  async (payload, thunkAPI) => {
    const { body, id } = payload;
    const { dispatch } = thunkAPI;
    try {
      const response = await postAPI(
        `${ENDPOINTS.ADD_EMPLOYEE_API}/${id}`,
        body
      );
      if (response?.success) {
        const result = response?.data;

        dispatch(setShowAddStaffModal(false));
        dispatch(setStaffEditable(false));
        // dispatch(setShowAlert({ message: response?.message, type: "success" }));
        dispatch(
          setShowAlert({
            message: translateLabel(messages?.[response?.messageCode]?.message),
            type: "success",
          })
        );
        return {
          ...result,
          text: userName(result?.firstName, result?.lastName),
        };
      } else {
        throw response;
      }
    } catch (error) {
      // dispatch(
      //   setShowAlert({ message: error.response?.data?.message, type: "error" })
      // );
      checkMessage(error);
      console.log("error", error);
    }
  }
);

export const asignServiceToStaffApi = createAsyncThunk<
  void,
  { body: { empCtgyItem: string[] }; id: string; companyId: string }
>(apiSignature.ASSIGN_SERVICE_TO_STAFF, async (payload, thunkAPI) => {
  const { body, id, companyId } = payload;
  const { dispatch } = thunkAPI;
  try {
    const response = await postAPI(
      `${ENDPOINTS.ASSIGN_SERVICE_TO_STAFF_API}/${id}`,
      body
    );
    if (response?.success) {
      const result = response?.data;
      dispatch(setShowAssignServiceModal(false));
      // dispatch(setShowAlert({ message: response?.message, type: "success" }));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      dispatch(
        fetchEmployeeServiceRelationData({
          companyId: companyId,
          employeeId: id,
        })
      );
    } else {
      throw response;
    }
  } catch (error) {
    // dispatch(
    //   setShowAlert({ message: error.response?.data?.message, type: "error" })
    // );
    checkMessage(error);
    console.log("error", error);
  }
});

export const fetchEmployeeServiceRelationData = createAsyncThunk<
  ResponseServiceStaffRelation[],
  {
    companyId: string;
    employeeId?: string;
    serviceId?: string;
    status?: string;
    isEmplPermanent?: boolean;
  }
>(
  apiSignature.EMPLOYEE_SERVICE_RELATION_LIST,
  async (
    { companyId, employeeId, serviceId, status, isEmplPermanent },
    thunkAPI
  ) => {
    if (!employeeId && !serviceId) {
      console.log("Either employeeId or serviceId must be provided.");
      return;
    }

    const { dispatch } = thunkAPI;
    try {
      const response = await getAPI(
        `${ENDPOINTS.SERVICE_STAFF_RELATION_LIST_API}?companyId=${companyId}${
          employeeId
            ? "&employeeId=" + employeeId
            : "&svcCtlgItemsId=" + serviceId
        }${
          isEmplPermanent
            ? "&status=" + status + "&isEmplPermanent=" + isEmplPermanent
            : ""
        }`
      );
      if (response?.success) {
        const result = response?.data?.employeeServiceRelation;
        return result;
      }
    } catch (error) {
      // dispatch(setShowAlert({message:error.response?.data?.message,type:"error"}))
      console.log("error", error);
    }
  }
);

// TODO remove in future
export const updateEmployeStatus = createAsyncThunk<
  UserStaffs,
  { body: { status: string }; id: string }
>(apiSignature.UPDATE_STAFF_STATUS, async (payload, thunkAPI) => {
  const { body, id } = payload;
  const { dispatch } = thunkAPI;
  try {
    const response = await patchAPI(
      `${ENDPOINTS.UPDATE_EMPLOYEE_STATUS}/${id}`,
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
      return { ...result, text: userName(result?.firstName, result?.lastName) };
    } else {
      throw response;
    }
  } catch (error) {
    // dispatch(
    //   setShowAlert({ message: error.response?.data?.message, type: "error" })
    // );
    checkMessage(error);
    console.log("error", error);
  }
});

export const deleteServiceStaffRelation = createAsyncThunk<any, string>(
  apiSignature.DELETE_SERVICE_STAFF,
  async (id, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const data: any = getState();
    const temp = [...data?.staff?.serviceStaffRelationList];
    try {
      const response = await deleteAPI(
        `${ENDPOINTS.DELETE_STAFF_EMPLOYEE_RELATION}/${id}`
      );
      if (response?.success) {
        const tempData = temp?.filter((i) => {
          return i?.id != id;
        });
        // dispatch(setShowAlert({ message: response?.message, type: "success" }));

        dispatch(
          setShowAlert({
            message: translateLabel(messages?.[response?.messageCode]?.message),
            type: "success",
          })
        );
        dispatch(setStaffServiceDelete(null));
        return tempData;
      }
    } catch (error) {
      // dispatch(
      //   setShowAlert({ message: error.response?.data?.message, type: "error" })
      // );
      checkMessage(error);
      console.log("error", error);
    }
  }
);

export const deleteEmployeeAPI = createAsyncThunk<
  any,
  { id: string; companyId: string }
>(apiSignature.DELETE_STAFF, async ({ id, companyId }, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const data: any = getState();
  const temp = [...data?.staff?.employeeList];
  try {
    const response = await deleteAPI(`${ENDPOINTS.DELETE_EMPLOYEE}/${id}`);
    if (response?.success) {
      const tempData = temp?.filter((i) => {
        return i?.id != id;
      });
      // dispatch(setShowAlert({ message: response?.message, type: "success" }));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      dispatch(setSelectedStaffDetail(temp?.[0]));
      dispatch(
        fetchEmployeeServiceRelationData({
          companyId: companyId,
          employeeId: temp?.[0]?.id,
        })
      );
      dispatch(setShowStaffDelete(false));
      dispatch(setCountData({ employeeCount: tempData?.length }));
      return tempData;
    }
  } catch (error) {
    // dispatch(
    //   setShowAlert({ message: error.response?.data?.message, type: "error" })
    // );
    checkMessage(error);
    console.log("error", error);
  }
});

export const updateAttendenceAPI = createAsyncThunk<
  void,
  { body: RequestUpdateAttendence; id: string, onUpdateAttendenceSchedule:()=>void; }
>(apiSignature.UPDATE_ATTENDENCE, async (props, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const { body, id, onUpdateAttendenceSchedule } = props;

  try {
    const response = await patchAPI(ENDPOINTS.UPDATE_ATTENDENCE, body);
    if (response?.success) {
      // dispatch(setShowAlert({ message: response?.message, type: "success" }));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );
      dispatch(setshowAttendenceModal(false));
      onUpdateAttendenceSchedule();
     
      return response;
    }
  } catch (error) {
    // dispatch(
    //   setShowAlert({ message: error.response?.data?.message, type: "error" })
    // );
    checkMessage(error);
    console.log("error", error);
  }
});

export const addEmployeeShiftSchedule = createAsyncThunk<
  UserStaffs,
  { body: RequestAddEmployeeShift; companyId: string; dateRange: string | null }
>(apiSignature.ADD_EMPLOYEE_SHIFT, async (payload, thunkAPI) => {
  const { body, companyId, dateRange } = payload;
  const { dispatch } = thunkAPI;

  try {
    const response = await postAPI(ENDPOINTS.ADD_EMPLOYEE_SHIFT, body);
    if (response?.success) {
      const result = response?.data;
      if (dateRange != null) {
        dispatch(
          fetchAppointmentTimeBlockAPI({
            companyId: companyId,
            scheduleDateRange: dateRange,
            employeeId: body?.employeeId,
          })
        );
      }

      dispatch(setAddStaffScheduleModal(null));
      // dispatch(setShowAlert({ message: response?.message, type: "success" }));
      dispatch(
        setShowAlert({
          message: translateLabel(messages?.[response?.messageCode]?.message),
          type: "success",
        })
      );

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

export const deleteSheduleShift = createAsyncThunk<any, string>(
  apiSignature.DELETE_EMPLOYEE_SHIFT,
  async (id, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const data: any = getState();
    const temp = [...data?.appointment?.appointmentFilterData];
    try {
      const response = await deleteAPI(
        `${ENDPOINTS.DELETE_EMPLOYEE_SHIFT}/${id}`
      );
      if (response?.success) {
        const tempData = temp?.filter((i) => {
          return i?.id != id;
        });
        // dispatch(setShowAlert({ message: response?.message, type: "success" }));
        dispatch(
          setShowAlert({
            message: translateLabel(messages?.[response?.messageCode]?.message),
            type: "success",
          })
        );

        dispatch(setAppointmentFilterData(tempData));
        dispatch(setDeletedShiftItem(id));
        dispatch(setShowShiftDeleteModal(null));
        return response;
      }
    } catch (error) {
      // dispatch(
      //   setShowAlert({ message: error.response?.data?.message, type: "error" })
      // );
      checkMessage(error);
      console.log("error", error);
    }
  }
);

export const addCommission = createAsyncThunk<
  ResponseAddCommission,
  { id: string; body: addCommissionrequest }
>(apiSignature.ADD_COMMISSION, async (payload, thunkAPI) => {
  const { body, id } = payload;
  const { dispatch, getState } = thunkAPI;
  try {
    const response = await postAPI(
      `${ENDPOINTS.ADD_COMMISSION_API}/${id}`,
      body
    );
    if (response?.success) {
      const result = response?.data;
      return result;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

export const fetchCommissionData = createAsyncThunk<
  ResponseAddCommission,
  string
>(apiSignature.GET_COMMISSION, async (id, thunkAPI) => {
  const { dispatch } = thunkAPI;
  try {
    const response = await getAPI(
      `${ENDPOINTS.GET_COMMISSION_API}?emplyId=${id}`
    );
    if (response?.success) {
      const result = response.data;

      return result;
    }
  } catch (error) {
    console.log("error", error);
  }
});
