import { createSlice } from "@reduxjs/toolkit";
import {
  ResponseMultiStore,
} from "../../utils/types/responseType";
import {
  addStoreAPI,
  addStoreLocationAPI,
  fetchBussinessCountData,
  fetchMultiStoreList,
  updateStoreAPI,
  updateStoreLocationAPI,
} from "./action";

interface multiStoreProps {
  multiStoreList: ResponseMultiStore | null;//TODO change to object
  multiStoreLoading: boolean;
  addEditStoreLoading:boolean;
  openStoreModal:boolean;
  openChangeStoreModal:boolean;
  openLocationModal:boolean;
  addEditStoreAddressLoading:boolean;
  
}

const initialState: multiStoreProps = {
  multiStoreList: null, //TODO change to object
  multiStoreLoading:false,
  addEditStoreLoading:false,
  openStoreModal:false,
  openChangeStoreModal:false,
  openLocationModal:false,
  addEditStoreAddressLoading:false,
};

// createSlice
export const multiStoreSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOpenStoreModal: (state, action) => {
      state.openStoreModal = action.payload;
    },
    setChangeStoreModal: (state, action) => {
      state.openChangeStoreModal = action.payload;
    },
    setMultiStoreList: (state, action) => {
      state.multiStoreList = action.payload;
    },

    setOpenLocation: (state, action) => {
      state.openLocationModal = action.payload;
    },

    
    
  },
  extraReducers: (builder) => {
    // fetch multi store list data
    builder.addCase(fetchMultiStoreList.pending, (state) => {
      state.multiStoreLoading = true;
    });
    builder.addCase(fetchMultiStoreList.fulfilled, (state, action) => {
      state.multiStoreList = action.payload;
      state.multiStoreLoading = false;
    });
    builder.addCase(fetchMultiStoreList.rejected, (state) => {
      state.multiStoreLoading = false;
    });

     // add multi store list data
     builder.addCase(addStoreAPI.pending, (state) => {
      state.addEditStoreLoading = true;
    });
    builder.addCase(addStoreAPI.fulfilled, (state, action) => {
      state.addEditStoreLoading = false;
    });
    builder.addCase(addStoreAPI.rejected, (state) => {
      state.addEditStoreLoading = false;
    });

     // update multi store list data
     builder.addCase(updateStoreAPI.pending, (state) => {
      state.addEditStoreLoading = true;
    });
    builder.addCase(updateStoreAPI.fulfilled, (state, action) => {
      state.addEditStoreLoading = false;
    });
    builder.addCase(updateStoreAPI.rejected, (state) => {
      state.addEditStoreLoading = false;
    });

     // fetch bussiness count multi store list data
     builder.addCase(fetchBussinessCountData.pending, (state) => {
      state.multiStoreLoading = true;
    });
    builder.addCase(fetchBussinessCountData.fulfilled, (state, action) => {
      state.multiStoreLoading = false;
    });
    builder.addCase(fetchBussinessCountData.rejected, (state) => {
      state.multiStoreLoading = false;
    });

    // add multi store list data
    builder.addCase(addStoreLocationAPI.pending, (state) => {
      state.addEditStoreAddressLoading = true;
    });
    builder.addCase(addStoreLocationAPI.fulfilled, (state, action) => {
      state.addEditStoreAddressLoading = false;
    });
    builder.addCase(addStoreLocationAPI.rejected, (state) => {
      state.addEditStoreAddressLoading = false;
    });

    // update multi store list data
    builder.addCase(updateStoreLocationAPI.pending, (state) => {
      state.addEditStoreAddressLoading = true;
    });
    builder.addCase(updateStoreLocationAPI.fulfilled, (state, action) => {
      state.addEditStoreAddressLoading = false;
    });
    builder.addCase(updateStoreLocationAPI.rejected, (state) => {
      state.addEditStoreAddressLoading = false;
    });
  },
  
});

export const {
  setOpenStoreModal,
  setChangeStoreModal,
  setMultiStoreList,
  setOpenLocation,
} = multiStoreSlice.actions;
export default multiStoreSlice.reducer;
