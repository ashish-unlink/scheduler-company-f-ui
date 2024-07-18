import { createSlice } from "@reduxjs/toolkit";
import { addCustomer, fetchUserData, isUserVerify } from "./action";
import { Users } from "../../utils/types/responseType";

interface userSliceProps {
  openAddCustomerPopup: boolean;

  addCustomerLoading: boolean;

  recentlyAddedCustomerData: Users | null;
  customerUserLoading: boolean;
  customerUserData: Users[];

  customerCount: number;
}

const initialState: userSliceProps = {
  openAddCustomerPopup: false,
  addCustomerLoading: false,

  recentlyAddedCustomerData: null,

  customerUserLoading: false,

  // client user
  customerUserData: [],
  customerCount: 0,
};

// createSlice
export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOpenAddCustomerPopup: (state, action) => {
      state.openAddCustomerPopup = action.payload;
    },
    setCustomerCount: (state, action) => {
      state.customerCount = action.payload;
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
  },
});

export const { setOpenAddCustomerPopup, setCustomerCount } = userSlice.actions;
export default userSlice.reducer;
