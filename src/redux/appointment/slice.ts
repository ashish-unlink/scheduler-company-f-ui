import { createSlice } from "@reduxjs/toolkit";
import {
  AppStatusProps,
  AppointmentCountProps,
  Comments,
  PaymentTransactionResponse,
  ResopnseAppointmentBlockData,
  ResponseAppointment,
  Users,
} from "../../utils/types/responseType";
import dayjs from "dayjs";
import {
  createAppointmentAPI,
  fetchAppointmentAPI,
  fetchAppointmentCountAPI,
  fetchAppointmentTimeBlockAPI,
  fetchPaymentTransactionAPI,
  sendPaymentLinkAPI,
  updateAppointmentAPI,
} from "./action";
import {
  AddAppointmentDataProps,
  AppointmentListProps,
  EditAppointmentFormProps,
} from "../../utils/types/dataTypes";

interface authSliceProps {
  appoinmentData: AddAppointmentDataProps[];
  totalPrice: number;
  totalTime: number;

  selectedClient: Users | null;

  selectedAppointmentEditData: Users | null;

  selectedCalenderAppointmentDate: any;

  showCustomerAppointmentModal: boolean;

  showAppointmentSuccess: boolean;

  successedAppointmentData: ResponseAppointment | null;
  successAppointmentLoading: boolean;

  updateAppointmentId: string;

  data: ResponseAppointment[];
  appointmentApiData: ResponseAppointment[];
  createAppData: AppointmentListProps[];
  duplicateSuccessAppointmentData: ResponseAppointment | null;

  appointmentFilterData: ResopnseAppointmentBlockData[];

  showAppointmentDeleteModal: any;

  editAppointmentForm: EditAppointmentFormProps | null;

  totalAppointmentCount: AppointmentCountProps[];

  appointmentInvoice: ResponseAppointment | null;
  appointmentHistory: Users | null;

  doubleAppointmentPopup: { heading: string; title: string } | null;

  employeeLeaveStatus: string[];

  appointmnetRowCounts: number;
  openTransactionModal: ResponseAppointment | null;

  paymentTransactionData: PaymentTransactionResponse[] | null;

  openQrModal: string | null;
}

const initialState: authSliceProps = {
  appoinmentData: [],
  totalPrice: 0,
  totalTime: 0,

  selectedClient: null,
  selectedAppointmentEditData: null,
  selectedCalenderAppointmentDate: dayjs(new Date()),
  showAppointmentSuccess: false,
  showCustomerAppointmentModal: false,

  successedAppointmentData: null,
  successAppointmentLoading: false,

  updateAppointmentId: "",

  data: [],
  appointmentApiData: [],
  createAppData: [],
  duplicateSuccessAppointmentData: null,

  appointmentFilterData: [],

  showAppointmentDeleteModal: null,

  editAppointmentForm: null,

  totalAppointmentCount: [],

  appointmentInvoice: null,
  appointmentHistory: null,

  doubleAppointmentPopup: null,

  employeeLeaveStatus: [],

  appointmnetRowCounts: 0,
  openTransactionModal: null,
  paymentTransactionData: [],
  openQrModal: null,
};

// createSlice
export const appointmentSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSelectedClient: (state, action) => {
      state.selectedClient = action?.payload;
    },

    setSelectedAppointmentEditData: (state, action) => {
      state.selectedAppointmentEditData = action?.payload;
    },

    setShowAppointmentSuccess: (state, action) => {
      state.showAppointmentSuccess = action?.payload;
    },

    setShowCustomerAppointmentModal: (state, action) => {
      state.showCustomerAppointmentModal = action?.payload;
    },

    setAppointmentData: (state, action) => {
      // [...state.appoinmentData, action?.payload]
      state.appoinmentData = action?.payload;

      state.totalPrice = state.appoinmentData?.reduce((a: any, b: any) => {
        return +a + +b?.price;
      }, 0);
      state.totalTime = state.appoinmentData?.reduce((a: any, b: any) => {
        return +a + +b?.serviceTime;
      }, 0);
      // state.appointmentFilterData = [];
    },

    setAppointmentFilterData: (state, action) => {
      state.appointmentFilterData = action?.payload;
    },

    setShowAppointmentDeleteModal: (state, action) => {
      state.showAppointmentDeleteModal = action?.payload;
    },

    deleteAppointment: (state, action) => {
      state.appoinmentData = state.appoinmentData.filter(
        (item: any) => item.id !== action?.payload?.id
      );
      state.totalPrice = state.totalPrice - action?.payload.price;
      state.totalTime = state.totalTime - action?.payload.serviceTime;
    },

    resetAppointment: (state) => {
      state.appoinmentData = [];
      state.totalPrice = 0;
      state.totalTime = 0;
    },

    setSelectedCalenderAppointmentDate: (state, action) => {
      state.selectedCalenderAppointmentDate = action?.payload;
    },

    setSuccessAppointmentData: (state, action) => {
      state.successedAppointmentData = action?.payload;
    },

    setDuplicateSuccessAppointmentData: (state, action) => {
      state.duplicateSuccessAppointmentData = action?.payload;
    },

    setUpdateAppointmentId: (state, action) => {
      state.updateAppointmentId = action.payload;
    },

    setData: (state, action) => {
      state.data = action.payload;
    },

    setCreateAppData: (state, action) => {
      state.createAppData = action.payload;
      state.successedAppointmentData = null;
      state.updateAppointmentId = "";
      state.data = [];
    },

    setEditAppointmentForm: (state, action) => {
      state.editAppointmentForm = action.payload;
    },

    setAppointmentInvoice: (state, action) => {
      state.appointmentInvoice = action.payload;
    },

    setAppointmentHistory: (state, action) => {
      state.appointmentHistory = action.payload;
    },

    setDoubleAppointmentPopup: (state, action) => {
      state.doubleAppointmentPopup = action.payload;
    },

    setEmployeeLeaveStatus: (state, action) => {
      state.employeeLeaveStatus = action.payload;
    },
    setAppointmentRowCounts: (state, action) => {
      state.appointmnetRowCounts = action.payload;
    },

    setOpenTranscationModal: (state, action) => {
      state.openTransactionModal = action.payload;
    },

    setOpenQrModal: (state, action) => {
      state.openQrModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch appointment data
    builder.addCase(fetchAppointmentAPI.pending, (state) => {
      state.successAppointmentLoading = true;
    });
    builder.addCase(fetchAppointmentAPI.fulfilled, (state, action) => {
      state.data = action.payload;
      state.appointmentApiData = action.payload;
      state.successAppointmentLoading = false;
    });
    builder.addCase(fetchAppointmentAPI.rejected, (state) => {
      state.successAppointmentLoading = false;
    });

    // add appointment data
    builder.addCase(createAppointmentAPI.pending, (state) => {
      state.successAppointmentLoading = true;
    });
    builder.addCase(createAppointmentAPI.fulfilled, (state, action) => {
      state.successedAppointmentData = action.payload;
      state.duplicateSuccessAppointmentData = action.payload;
      state.successAppointmentLoading = false;
    });
    builder.addCase(createAppointmentAPI.rejected, (state) => {
      state.successAppointmentLoading = false;
    });

    // update appointment data
    builder.addCase(updateAppointmentAPI.pending, (state) => {
      state.successAppointmentLoading = true;
    });
    builder.addCase(updateAppointmentAPI.fulfilled, (state, action) => {
      state.successedAppointmentData = action.payload;
      state.duplicateSuccessAppointmentData = action.payload;
      state.successAppointmentLoading = false;
    });
    builder.addCase(updateAppointmentAPI.rejected, (state) => {
      state.successAppointmentLoading = false;
    });

    // appointment filter data
    builder.addCase(fetchAppointmentTimeBlockAPI.pending, (state) => {
      state.successAppointmentLoading = true;
    });
    builder.addCase(fetchAppointmentTimeBlockAPI.fulfilled, (state, action) => {
      state.appointmentFilterData = action.payload;
      state.successAppointmentLoading = false;
    });
    builder.addCase(fetchAppointmentTimeBlockAPI.rejected, (state) => {
      state.successAppointmentLoading = false;
    });

    // appointment filter data
    builder.addCase(fetchAppointmentCountAPI.pending, (state) => {
      state.successAppointmentLoading = true;
    });
    builder.addCase(fetchAppointmentCountAPI.fulfilled, (state, action) => {
      state.totalAppointmentCount = action.payload;
      state.successAppointmentLoading = false;
    });
    builder.addCase(fetchAppointmentCountAPI.rejected, (state) => {
      state.successAppointmentLoading = false;
    });

    // appointment payment transaction data
    builder.addCase(fetchPaymentTransactionAPI.pending, (state) => {
      state.successAppointmentLoading = true;
    });
    builder.addCase(fetchPaymentTransactionAPI.fulfilled, (state, action) => {
      state.paymentTransactionData = action.payload;
      state.successAppointmentLoading = false;
    });
    builder.addCase(fetchPaymentTransactionAPI.rejected, (state) => {
      state.successAppointmentLoading = false;
    });

    // appointment payment link send data
    builder.addCase(sendPaymentLinkAPI.pending, (state) => {
      state.successAppointmentLoading = true;
    });
    builder.addCase(sendPaymentLinkAPI.fulfilled, (state, action) => {
      state.successAppointmentLoading = false;
    });
    builder.addCase(sendPaymentLinkAPI.rejected, (state) => {
      state.successAppointmentLoading = false;
    });
  },
});

export const {
  setAppointmentData,
  deleteAppointment,
  resetAppointment,
  setSelectedClient,
  setSelectedAppointmentEditData,
  setSelectedCalenderAppointmentDate,
  setShowAppointmentSuccess,
  setShowCustomerAppointmentModal,
  setSuccessAppointmentData,
  setUpdateAppointmentId,
  setData,
  setAppointmentFilterData,
  setCreateAppData,
  setDuplicateSuccessAppointmentData,
  setShowAppointmentDeleteModal,
  setEditAppointmentForm,
  setAppointmentInvoice,
  setAppointmentHistory,
  setDoubleAppointmentPopup,
  setEmployeeLeaveStatus,
  setAppointmentRowCounts,
  setOpenTranscationModal,
  setOpenQrModal,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
