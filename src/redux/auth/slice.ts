import { createSlice } from "@reduxjs/toolkit";
import { emailVerification, fetchSignupAPI, loginAPI } from "./action";
import { BusinessLocation, Users } from "../../utils/types/responseType";
import store from "..";
import {
  AddAppointmentDataProps,
  countDataProps,
} from "../../utils/types/dataTypes";

interface authSliceProps {
  auth: boolean | null;
  token: string | null;

  ownerData: Users | null;
  ownerLoading: boolean;

  showOTPModal: boolean;

  isEmailVerified: boolean;

  customerEmailOTP: boolean;
  emailVerifyLoading: boolean;
  signUpLoading: boolean;
  isRegisterSuccess: boolean;

  dataCounts: countDataProps;
  currentOutletData:BusinessLocation | null;
}

const initialState: authSliceProps = {
  auth: false,
  ownerLoading: false,
  emailVerifyLoading: false,
  signUpLoading: false,

  // token
  token: null,
  // owner
  ownerData: null,

  // otp modal
  showOTPModal: false,

  // email verification
  isEmailVerified: false,

  customerEmailOTP: false,
  isRegisterSuccess: false,

  dataCounts: {
    employeeCount: 0,
    serviceCount: 0,
    appointmentCount: 0,
    bussinessSetUpDataCount: 0,
  },

  currentOutletData:null,
};

// createSlice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.auth = action.payload;
    },
    resetProfile: (state) => {
      state.auth = false;
    },
    clearRedux: (state) => {
      state.auth = true;
    },
    setShowOTPModal: (state, action) => {
      state.showOTPModal = action.payload;
    },
    setEmailVerification: (state, action) => {
      state.isEmailVerified = action.payload;
    },

    setResgisterSuccess: (state, action) => {
      state.isRegisterSuccess = action.payload;
    },

    setCountData: (state, action) => {
      state.dataCounts = { ...state.dataCounts, ...action.payload };
    },

    setOwnerData: (state, action) => {
      state.ownerData = action.payload;
    },

    setCurrentOutlet: (state, action) => {
      state.currentOutletData = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch login data
    builder.addCase(loginAPI.pending, (state) => {
      state.ownerLoading = true;
    });
    builder.addCase(loginAPI.fulfilled, (state, action) => {
      state.ownerData = action.payload;
      state.token = action.payload?.token ?? null;
      state.ownerLoading = false;
    });
    builder.addCase(loginAPI.rejected, (state) => {
      state.ownerLoading = false;
    });

    //  fetch sign up data
    builder.addCase(fetchSignupAPI.pending, (state) => {
      state.signUpLoading = true;
    });
    builder.addCase(fetchSignupAPI.fulfilled, (state, action) => {
      state.ownerData = action.payload;
      state.signUpLoading = false;
    });
    builder.addCase(fetchSignupAPI.rejected, (state) => {
      state.signUpLoading = false;
    });

    //  fetch email verification data
    builder.addCase(emailVerification.pending, (state) => {
      state.emailVerifyLoading = true;
    });
    builder.addCase(emailVerification.fulfilled, (state, action) => {
      if (action.payload?.role == "owner") {
        state.ownerData = action.payload;
        state.isEmailVerified = true;
      }
      //  else if (action.payload?.role == "client") {
      //   state.customerUserData = [...state?.customerUserData, action.payload];
      // }
      state.emailVerifyLoading = false;
    });
    builder.addCase(emailVerification.rejected, (state) => {
      state.emailVerifyLoading = false;
    });
  },
});

export const {
  authenticate,
  resetProfile,
  setShowOTPModal,
  setEmailVerification,
  setResgisterSuccess,
  setCountData,
  setOwnerData,
  clearRedux,
  setCurrentOutlet,
  setToken,
} = authSlice.actions;
export default authSlice.reducer;
