import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serviceData: [],
  totalPrice: 0,
  totalTime: 0,

};

// createSlice
export const serviceDataSlice = createSlice({
  name: "selectedService",
  initialState,
  reducers: {
    setServiceData: (state, { payload }) => {
      state.serviceData = [...state.serviceData, payload];
      state.totalPrice = state.serviceData?.reduce((a, b) => {
        return +a + +b?.price;
      }, 0);
      state.totalTime = state.serviceData?.reduce((a, b) => {
        return +a + +b?.time;
      }, 0);
    },
    deleteService: (state, { payload }) => {
      state.serviceData = state.serviceData.filter(
        (item) => item.id !== payload.id
      );
      state.totalPrice = state.totalPrice - payload.price;
      state.totalTime = state.totalTime - payload.time;
    },
    resetServiceData: (state) => {
      state.serviceData = [];
      state.totalPrice = 0;
      state.totalTime = 0;
    },
  },
});
export const { setServiceData, resetServiceData, deleteService } =
  serviceDataSlice.actions;
export default serviceDataSlice.reducer;
