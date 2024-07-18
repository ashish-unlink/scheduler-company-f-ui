import { createSlice } from "@reduxjs/toolkit";
import { CountryListProps, Users } from "../../utils/types/responseType";

interface reportSliceProps {
  showDownloadCsvModal: boolean;
}

const initialState: reportSliceProps = {
  showDownloadCsvModal: false,
};

// createSlice
export const reportSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setshowDownloadCsvModal: (state, action) => {
      state.showDownloadCsvModal = action.payload;
    },

  },
  extraReducers: (builder) => {},
});

export const { setshowDownloadCsvModal } =
  reportSlice.actions;
export default reportSlice.reducer;
