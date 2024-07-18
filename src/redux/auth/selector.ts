export const selectAuthData = (state:any) => state.auth.auth;

export const selectOwnerData = (state:any) => state.auth.ownerData;
export const selectOwnerLoading = (state:any) => state.auth.ownerLoading;


export const selectOTPModal = (state:any) => state.auth.showOTPModal;
export const selectEmailVerified = (state:any) => state.auth.isEmailVerified;

export const selectCustomerEmailOTP = (state:any) => state.auth.customerEmailOTP;
export const selectRegisterSuccess = (state:any) => state.auth.isRegisterSuccess;

export const selectRegisterLoading = (state:any) => state.auth.signUpLoading;

export const selectEmailVerifyLoading = (state:any) => state.auth.emailVerifyLoading;

export const selectDataCounts = (state:any) => state.auth.dataCounts;






