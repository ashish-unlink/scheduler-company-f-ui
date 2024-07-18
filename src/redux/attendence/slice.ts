import { createSlice } from "@reduxjs/toolkit";
import { CountryListProps, Users } from "../../utils/types/responseType";

interface attendenceSliceProps {
  showAttendenceModal: boolean;
}

const initialState: attendenceSliceProps = {
  showAttendenceModal: false,
};

// createSlice
export const attendenceSlice = createSlice({
  name: "attendenceSlice",
  initialState,
  reducers: {
    setshowAttendenceModal: (state, action) => {
      state.showAttendenceModal = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setshowAttendenceModal } = attendenceSlice.actions;
export default attendenceSlice.reducer;
