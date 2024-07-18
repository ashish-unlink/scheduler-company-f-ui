export const selectCountryList = (state:any) => state.meta.countryList;

export const selectShowAlert = (state:any) => state.meta.showAlert;
export const selectAlertMessage = (state:any) => state.meta.alertMessage;
export const selectAlertType = (state:any) => state.meta.alertType;


export const selectShowTourGuidence = (state:any) => state.meta.showTourGuidence;
export const selectGuidenceModal = (state:any) => state.meta.showGuidenceModal;
export const selectUserGuidenceModal = (state:any) => state.meta.showUserGuidenceModal;
export const selectFirstTimeUserGuidence = (state:any) => state.meta.firstTimeUserGuide;


export const selectShowSearch = (state:any) => state.meta.showSearch;

export const selectFilterData = (state:any) => state.meta.filterData;

export const selectBusinessSeteTime = (state:any) => state.meta.businessSetupTime;

export const selectShowBusinessSetpModal = (state:any) => state.meta.settingBussinessModal;


export const selectBusinessSetpData = (state:any) => state.meta.businessSetupData;

export const selectBussinessLoading = (state:any)=> state.meta.countryLoading;
