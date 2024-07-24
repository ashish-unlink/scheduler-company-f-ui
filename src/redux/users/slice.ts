import { createSlice } from "@reduxjs/toolkit";
import { addCustomer, fetchUserData, isUserVerify, updateCusomer } from "./action";
import { Users } from "../../utils/types/responseType";
import { customerRegisterRequest } from "../../utils/types/requestType";

interface userSliceProps {

  addCustomerLoading: boolean;

  recentlyAddedCustomerData: Users | null;
  customerUserLoading: boolean;
  customerUserData: Users[];

  customerCount: number;

  editCustomerData: customerRegisterRequest | null;
  isOpenCustomerUserData:boolean;
}

const initialState: userSliceProps = {
  addCustomerLoading: false,

  recentlyAddedCustomerData: null,

  customerUserLoading: false,

  // client user
  customerUserData: [],
  customerCount: 0,

  editCustomerData: null,
  isOpenCustomerUserData:false,
};

// createSlice
export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
 
    setCustomerCount: (state, action) => {
      state.customerCount = action.payload;
    },
    setEditCustomer: (state, action) => {
      state.editCustomerData = action.payload;
    },
    setUpdatedCustomerData: (state, action) => {
      state.customerUserData = action.payload;
    },
    setOpenCustomerModal: (state, action) => {
      state.isOpenCustomerUserData = action.payload;
    },
    
  
  },
  extraReducers: (builder) => {
    // add customer data
    builder.addCase(addCustomer.pending, (state) => {
      state.addCustomerLoading = true;
    });
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      if (action.payload) {
        state.customerUserData = [...state?.customerUserData, action.payload];
        state.recentlyAddedCustomerData = action.payload;
      }
      state.addCustomerLoading = false;
    });
    builder.addCase(addCustomer.rejected, (state) => {
      // state.auth = false;
      state.addCustomerLoading = false;
    });

    // fetch client data
    builder.addCase(fetchUserData.pending, (state) => {
      state.customerUserLoading = true;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.customerUserData = action.payload?.users ?? [];
      state.customerUserLoading = false;
    });
    builder.addCase(fetchUserData.rejected, (state) => {
      state.customerUserLoading = false;
    });

    // isUserVerify client data
    builder.addCase(isUserVerify.pending, (state) => {
      state.customerUserLoading = true;
    });
    builder.addCase(isUserVerify.fulfilled, (state, action) => {
      state.customerUserLoading = false;
    });
    builder.addCase(isUserVerify.rejected, (state) => {
      state.customerUserLoading = false;
    });

    // updateCusomer customer data
    builder.addCase(updateCusomer.pending, (state) => {
      state.addCustomerLoading = true;
    });
    builder.addCase(updateCusomer.fulfilled, (state, action) => {
      state.addCustomerLoading = false;
    });
    builder.addCase(updateCusomer.rejected, (state) => {
      // state.auth = false;
      state.addCustomerLoading = false;
    });
  },
});

export const {  setCustomerCount, setEditCustomer ,setUpdatedCustomerData, setOpenCustomerModal} =
  userSlice.actions;
export default userSlice.reducer;
