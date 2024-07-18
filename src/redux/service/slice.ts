import { createSlice } from "@reduxjs/toolkit";
import {
  ResponseServiceList,
  ServiceListItem,
} from "../../utils/types/responseType";
import {
  addServiceCategoryAPI,
  addServiceSubCategoryAPI,
  deleteServiceCategoryAPI,
  deleteServiceSubCategoryAPI,
  fetchServiceList,
  updateCategoryStatusAPI,
  updateServiceCategoryAPI,
  updateServiceSubCategoryAPI,
  updateSubCategoryStatusAPI,
} from "./action";

interface serviceSliceProps {
  showCategoryModal: boolean;
  showSubCategoryModal: boolean;

  serviceList: ResponseServiceList[];
  serviceLoading: boolean;

  selectedCategoryItem: ResponseServiceList | null;

  selectedSubCategoryItem: ServiceListItem | null;


  loading: boolean;
  updateStatusServiceLoading: boolean;
}

const initialState: serviceSliceProps = {
  showCategoryModal: false,
  showSubCategoryModal: false,

  serviceList: [],
  serviceLoading: false,

  selectedCategoryItem: null,
  selectedSubCategoryItem: null,


  loading: false,
  updateStatusServiceLoading: false,
};

// createSlice
export const serviceSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setShowCategoryModal: (state, action) => {
      state.showCategoryModal = action.payload;
    },
    setShowSubCategoryModal: (state, action) => {
      state.showSubCategoryModal = action.payload;
    },
    setSelectedCategoryItem: (state, action) => {
      state.selectedCategoryItem = action.payload;
    },

    setUpdateServiceList: (state, action) => {
      state.serviceList = action.payload;
    },
    setSelectedSubCategoryItem: (state, action) => {
      state.selectedSubCategoryItem = action.payload;
    },
    
  },
  extraReducers: (builder) => {
    //  fetch service list Api
    builder.addCase(fetchServiceList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchServiceList.fulfilled, (state, action) => {
      state.serviceList = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchServiceList.rejected, (state) => {
      state.loading = false;
    });

    //  add category Api
    builder.addCase(addServiceCategoryAPI.pending, (state) => {
      state.serviceLoading = true;
    });
    builder.addCase(addServiceCategoryAPI.fulfilled, (state, action) => {
      state.serviceLoading = false;
    });
    builder.addCase(addServiceCategoryAPI.rejected, (state) => {
      state.serviceLoading = false;
    });

    //  add service Api
    builder.addCase(addServiceSubCategoryAPI.pending, (state) => {
      state.serviceLoading = true;
    });
    builder.addCase(addServiceSubCategoryAPI.fulfilled, (state, action) => {
      state.serviceLoading = false;
    });
    builder.addCase(addServiceSubCategoryAPI.rejected, (state) => {
      state.serviceLoading = false;
    });

    //  update category Api
    builder.addCase(updateServiceCategoryAPI.pending, (state) => {
      state.serviceLoading = true;
    });
    builder.addCase(updateServiceCategoryAPI.fulfilled, (state, action) => {
      state.serviceLoading = false;
    });
    builder.addCase(updateServiceCategoryAPI.rejected, (state) => {
      state.serviceLoading = false;
    });

    //  update service Api
    builder.addCase(updateServiceSubCategoryAPI.pending, (state) => {
      state.serviceLoading = true;
    });
    builder.addCase(updateServiceSubCategoryAPI.fulfilled, (state, action) => {
      state.serviceLoading = false;
    });
    builder.addCase(updateServiceSubCategoryAPI.rejected, (state) => {
      state.serviceLoading = false;
    });

    //  update category status Api
    builder.addCase(updateCategoryStatusAPI.pending, (state) => {
      state.serviceLoading = true;
    });
    builder.addCase(updateCategoryStatusAPI.fulfilled, (state, action) => {
      state.serviceLoading = false;
    });
    builder.addCase(updateCategoryStatusAPI.rejected, (state) => {
      state.serviceLoading = false;
    });

    //  update service status Api
    builder.addCase(updateSubCategoryStatusAPI.pending, (state) => {
      state.serviceLoading = true;
    });
    builder.addCase(updateSubCategoryStatusAPI.fulfilled, (state, action) => {
      state.serviceLoading = false;
    });
    builder.addCase(updateSubCategoryStatusAPI.rejected, (state) => {
      state.serviceLoading = false;
    });

    //  delte category status Api
    builder.addCase(deleteServiceCategoryAPI.pending, (state) => {
      state.serviceLoading = true;
    });
    builder.addCase(deleteServiceCategoryAPI.fulfilled, (state, action) => {
      state.serviceLoading = false;
    });
    builder.addCase(deleteServiceCategoryAPI.rejected, (state) => {
      state.serviceLoading = false;
    });

    //  delete service  Api
    builder.addCase(deleteServiceSubCategoryAPI.pending, (state) => {
      state.serviceLoading = true;
    });
    builder.addCase(deleteServiceSubCategoryAPI.fulfilled, (state, action) => {
      state.serviceLoading = false;
    });
    builder.addCase(deleteServiceSubCategoryAPI.rejected, (state) => {
      state.serviceLoading = false;
    });
  },
});

export const {
  setShowCategoryModal,
  setShowSubCategoryModal,
  setSelectedCategoryItem,
  setUpdateServiceList,
  setSelectedSubCategoryItem,
} = serviceSlice.actions;
export default serviceSlice.reducer;
