import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../network/ENDPOINT";
import { getAPI, postAPI } from "../../network/Api";
import {
  AppointmentCountProps,
  CountryListProps,
  PaymentTransactionResponse,
  ResopnseAppointmentBlockData,
  ResponseAppointment,
  Users,
} from "../../utils/types/responseType";
import { apiSignature } from "./api-signature";
import {
  AddAppoinmentRequest,
  AppointmentCountRequest,
  paymentRequestProps,
} from "../../utils/types/requestType";
import { setShowAlert, setShowFilterTransaction, setShowSearch } from "../meta/slice";
import {
  resetAppointment,
  setAppointmentRowCounts,
  setDuplicateSuccessAppointmentData,
  setEditAppointmentForm,
  setOpenQrModal,
  setOpenTranscationModal,
  setSelectedAppointmentEditData,
  setSelectedClient,
  setShowAppointmentSuccess,
  setShowCustomerAppointmentModal,
  setSuccessAppointmentData,
} from "./slice";
import { PrivatePath, PublicPath } from "../../components/constants/routes.c";
import { setCountData } from "../auth/slice";
import { checkMessage } from "../../utils/general";
import translateLabel from "../../components/hooks/translationLable";

export const fetchAppointmentAPI = createAsyncThunk<
  ResponseAppointment[],
  {
    companyId: string;
    appointmentDate?: string;
    appointmentDateRange?: string[];
    url?: string;
    pagination?: string;
    navigate?: (val: string) => void;
  }
>(
  apiSignature.GET_APPOINTMENI_API,
  async (
    {
      companyId,
      appointmentDate,
      appointmentDateRange,
      url,
      navigate,
      pagination,
    },
    thunkAPI
  ) => {
    const { dispatch } = thunkAPI;
    try {
      const response = await getAPI(
        `${ENDPOINTS.GET_APPOINTMENT}?companyId=${companyId}${
          appointmentDate ? "&appointmentDate=" + appointmentDate : ""
        }${
          appointmentDateRange && appointmentDateRange?.length > 0
            ? "&appointmentDateRange=" + appointmentDateRange
            : []
        }${url == undefined ? "" : url}${pagination ? pagination : ""}`
      );
      if (response?.success) {
        dispatch(setAppointmentRowCounts(response?.data?.count));
        const appointment = response?.data?.appointment;
        if (url != "" && navigate) {
          navigate(PrivatePath.analytics);
          dispatch(setShowSearch(false));
        }
        return appointment;
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

export const createAppointmentAPI = createAsyncThunk<
  ResponseAppointment,
  AddAppoinmentRequest
>(apiSignature.CREATE_APPOINTMENI_API, async (body, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const data: any = getState();
  const temp = { ...data?.auth?.dataCounts };
  try {
    const response = await postAPI(ENDPOINTS.ADD_APPOINTMENT, body);
    if (response?.success) {
      const appointment = response?.data;
      dispatch(setShowAppointmentSuccess(true));
      dispatch(resetAppointment());
      dispatch(setShowCustomerAppointmentModal(false));
      dispatch(setSelectedClient(null));
      dispatch(setSelectedAppointmentEditData(null));
      dispatch(
        setCountData({ appointmentCount: parseInt(temp?.appointmentCount) + 1 })
      );

      return appointment;
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

export const updateAppointmentAPI = createAsyncThunk<
  ResponseAppointment,
  AddAppoinmentRequest
>(apiSignature.UPDATE_APPOINTMENT_API, async (body, thunkAPI) => {
  const { dispatch } = thunkAPI;
  try {
    const response = await postAPI(ENDPOINTS.ADD_APPOINTMENT, body);

    if (response?.success) {
      const updateAppointment = response?.data;
      // dispatch(setSuccessAppointmentData(updateAppointment));
      dispatch(setDuplicateSuccessAppointmentData(updateAppointment));
      dispatch(setShowAppointmentSuccess(true));
      dispatch(resetAppointment());
      dispatch(setShowCustomerAppointmentModal(false));
      dispatch(setSelectedClient(null));
      dispatch(setSelectedAppointmentEditData(null));
      dispatch(setEditAppointmentForm(null));
      return updateAppointment;
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

export const fetchAppointmentTimeBlockAPI = createAsyncThunk<
  ResopnseAppointmentBlockData[],
  {
    companyId: string;
    date?: string;
    scheduleDateRange?: any;
    employeeId?: string;
  }
>(
  apiSignature.APPOINTMENI_TIME_BLOCK_API,
  async ({ companyId, date, scheduleDateRange, employeeId }, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      const response = await getAPI(
        `${ENDPOINTS.APPOINTMENT_TIME_BLOCK}?companyId=${companyId}${
          date
            ? "&date=" + date
            : scheduleDateRange
            ? "&scheduleDateRange=" + scheduleDateRange
            : ""
        }${employeeId ? "&employeeId=" + employeeId : ""}
            `
      );
      if (response?.success) {
        const appointmentFilterData = response?.data?.employee;
        return appointmentFilterData;
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

export const fetchAppointmentCountAPI = createAsyncThunk<
  AppointmentCountProps[],
  AppointmentCountRequest
>(
  apiSignature.APPOINTMENT_TOTAL_COUNT_API,
  async ({ companyId, appointmentStartDate, appointmentEndDate }, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      const response = await getAPI(
        `${ENDPOINTS.APPOINTMENT_COUNT_API}?companyId=${companyId}&appointmentStartDate=${appointmentStartDate}&appointmentEndDate=${appointmentEndDate}`
      );
      if (response?.success) {
        const appointmentCountData = response?.data;
        return appointmentCountData;
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

export const sendPaymentLinkAPI = createAsyncThunk<
  AppointmentCountProps[],
  paymentRequestProps
>(apiSignature.SEND_PAYMENT_LINK_API, async (body, thunkAPI) => {
  const { dispatch } = thunkAPI;
  try {
    const response = await postAPI(ENDPOINTS.SEND_PAYMENT_LINK, body);
    if (response?.success) {
      const paymentResponse = response;
      dispatch(setShowAppointmentSuccess(false));
      dispatch(setOpenTranscationModal(null));
      // dispatch(
      //   setShowAlert({
      //     message: translateLabel(messages?.[response?.messageCode]?.message),
      //     type: "success",
      //   })
      // );
      dispatch(setOpenQrModal(response?.data?.link));
      return paymentResponse;
    } else {
      throw response;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});

export const fetchPaymentTransactionAPI = createAsyncThunk<
  PaymentTransactionResponse[],
  {
    id?: string;
    companyBranchId: string;
    url?: string;
    txnItemsDate?: string;
  }
>(apiSignature.PAYMENT_TRANSACTION_API, async (body, thunkAPI) => {
  const { id, companyBranchId, url, txnItemsDate } = body;
  const { dispatch } = thunkAPI;

  if (!companyBranchId) {
    return;
  }
  try {
    const response = await getAPI(
      `${ENDPOINTS.GET_PAYMENT_TRANSACTION}?companyId=${companyBranchId}${
        id ? "&appointmentId=" + id : ""
      }${txnItemsDate ? "&txnItemsDate=" + txnItemsDate : ""}${url ? url : ""}`
    );
    if (response?.success) {
      const paymentTransactionData = response?.data;
      dispatch(setShowFilterTransaction(false));
      return paymentTransactionData?.appointment;
    } else {
      throw response;
    }
  } catch (error) {
    checkMessage(error);
    console.log("error", error);
  }
});
