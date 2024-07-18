import { createSlice } from "@reduxjs/toolkit";
import {
  CountryListProps,
  ResponseBussinessList,
  Users,
} from "../../utils/types/responseType";
import {
  fetchBussinessPreferenceList,
  fetchCountryList,
  setUpBussinessAPI,
} from "./action";
import { getBussinessSetUpData, getHourAndMinuteFromString } from "../../utils/general";
import { companypreferemceData } from "../../utils/types/dataTypes";

interface metaSliceProps {
  countryList: CountryListProps[];
  countryLoading: boolean;

  showAlert: boolean;
  alertMessage: string;
  alertType: string;

  showTourGuidence: boolean;
  showGuidenceModal: boolean;
  showUserGuidenceModal: boolean;
  showSearch: boolean;

  firstTimeUserGuide: {
    dashboard: boolean;
    bussinessSetUp: boolean;
    service: boolean;
    staff: boolean;
    serviceAssign: boolean;
    appointment: boolean;
  };

  filterData: any;

  settingBussinessModal: boolean;

  businessSetupData: companypreferemceData | null;
  businessSetupTime: { open: string; close: string } | null;

  showFilterTransaction: boolean;
}

const initialState: metaSliceProps = {
  countryList: [],
  countryLoading: false,

  showAlert: false,
  alertMessage: "",
  alertType: "",

  showTourGuidence: false,
  showGuidenceModal: false,
  showUserGuidenceModal: false,
  showSearch: false,

  firstTimeUserGuide: {
    dashboard: true,
    bussinessSetUp: true,
    service: true,
    staff: true,
    serviceAssign: true,
    appointment: true,
  },

  filterData: null,

  settingBussinessModal: false,

  businessSetupTime: null,
  businessSetupData: null,

  showFilterTransaction: false,
};

// createSlice
export const metaSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setShowAlert: (state, action) => {
      state.alertMessage = action.payload.message;
      state.alertType = action.payload.type;
    },

    setShowTourGuidence: (state, action) => {
      state.showTourGuidence = action.payload;
    },

    setShowGuiderModal: (state, action) => {
      state.showGuidenceModal = action.payload;
    },

    setShowUserGuidence: (state, action) => {
      state.showUserGuidenceModal = action.payload;
    },

    setFirstTimeUserGuide: (state, action) => {
      state.firstTimeUserGuide = action.payload;
    },

    setShowSearch: (state, action) => {
      state.showSearch = action.payload;
    },

    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },

    setSettingBussinessSetUP: (state, action) => {
      state.settingBussinessModal = action.payload;
    },

    setShowFilterTransaction: (state, action) => {
      state.showFilterTransaction = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch fetch country data
    builder.addCase(fetchCountryList.pending, (state) => {
      state.countryLoading = true;
    });
    builder.addCase(fetchCountryList.fulfilled, (state, action) => {
      state.countryList = action.payload;
      state.countryLoading = false;
    });
    builder.addCase(fetchCountryList.rejected, (state) => {
      // state.auth = false;
      state.countryLoading = false;
    });

    // setUpBussinessAPI data
    builder.addCase(setUpBussinessAPI.pending, (state) => {
      state.countryLoading = true;
    });
    builder.addCase(setUpBussinessAPI.fulfilled, (state, action) => {
      state.countryLoading = false;
    });
    builder.addCase(setUpBussinessAPI.rejected, (state) => {
      // state.auth = false;
      state.countryLoading = false;
    });

    // get bussiness list
    builder.addCase(fetchBussinessPreferenceList.pending, (state) => {
      state.countryLoading = true;
    });
    builder.addCase(fetchBussinessPreferenceList.fulfilled, (state, action) => {
      state.businessSetupData = getBussinessSetUpData(action.payload)
      
      if (action.payload?.length == 2) {
        const startEndTime = getHourAndMinuteFromString(action.payload);
        state.businessSetupTime = {
          open: startEndTime?.openHours,
          close:
            parseInt(startEndTime?.openHours) >=
            parseInt(startEndTime?.endHours)
              ? "24"
              : startEndTime?.endHours,
        };
      }

      state.countryLoading = false;
    });
    builder.addCase(fetchBussinessPreferenceList.rejected, (state) => {
      // state.auth = false;
      state.countryLoading = false;
    });
  },
});

export const {
  setShowAlert,
  setShowTourGuidence,
  setShowGuiderModal,
  setShowUserGuidence,
  setFirstTimeUserGuide,
  setShowSearch,
  setFilterData,
  setSettingBussinessSetUP,
  setShowFilterTransaction,
} = metaSlice.actions;
export default metaSlice.reducer;
