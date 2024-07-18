import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  service: [],
};

// createSlice
export const selectedServiceSlice = createSlice({
  name: "selectedService",
  initialState,
  reducers: {
    addService: (state, { payload }) => {
      state.service = [...state.service, payload];
    },
    removeService: (state) => {
      state.service = false;
    },
  },
});

export const { addService, removeService } = selectedServiceSlice.actions;
export default selectedServiceSlice.reducer;
