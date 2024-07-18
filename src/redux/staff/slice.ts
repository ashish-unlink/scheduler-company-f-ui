import { createSlice } from "@reduxjs/toolkit";
import {
  CommItem,
  CountryListProps,
  ResponseAddCommission,
  ResponseServiceStaffRelation,
  ServiceListItem,
  UserStaffs,
  Users,
} from "../../utils/types/responseType";
import {
  addCommission,
  addEmployee,
  asignServiceToStaffApi,
  deleteEmployeeAPI,
  deleteServiceStaffRelation,
  fetchCommissionData,
  fetchEmployeeData,
  fetchEmployeeServiceRelationData,
  updateAttendenceAPI,
  updateEmployeStatus,
  updateEmployee,
} from "./action";
import { rowStaffScheduleData } from "../../utils/types/dataTypes";
import { rows } from "../../components/staff-schedule/schema";
import { RequestTimeShiftsProps } from "../../utils/types/requestType";

interface staffSliceProps {
  showAddStaffModal: boolean;
  selectedStaffDetail: UserStaffs | null;

  employeeList: UserStaffs[];
  employeeLoading: boolean;

  addEmployeeLoading: boolean;

  isStaffEditable: boolean;
  showAssignServiceModal: boolean;

  serviceStaffRelationList: ResponseServiceStaffRelation[];
  deleteStaffRelation: string | null;

  addDateStaff: any;
  addStaffScheduleModal: null | rowStaffScheduleData;

  showViewStaffModal: ServiceListItem | null;

  showStaffDelete: boolean;
  showShiftDeleteModal: RequestTimeShiftsProps | null;

  deleteShiftItem: string | null;

  commissionData: CommItem[];
}

const initialState: staffSliceProps = {
  showAddStaffModal: false,

  employeeList: [],
  selectedStaffDetail: null,
  employeeLoading: false,
  addEmployeeLoading: false,

  isStaffEditable: false,
  showAssignServiceModal: false,

  serviceStaffRelationList: [],

  deleteStaffRelation: null,

  addDateStaff: rows,
  addStaffScheduleModal: null,

  showViewStaffModal: null,

  showStaffDelete: false,

  showShiftDeleteModal: null,

  deleteShiftItem: null,

  commissionData: [],
};

// createSlice
export const staffSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setShowAddStaffModal: (state, action) => {
      state.showAddStaffModal = action.payload;
    },
    setSelectedStaffDetail: (state, action) => {
      state.selectedStaffDetail = action.payload;
    },
    setStaffEditable: (state, action) => {
      state.isStaffEditable = action.payload;
    },
    setShowAssignServiceModal: (state, action) => {
      state.showAssignServiceModal = action.payload;
    },
    setStaffServiceDelete: (state, action) => {
      state.deleteStaffRelation = action.payload;
    },

    setShowShiftDeleteModal: (state, action) => {
      state.showShiftDeleteModal = action.payload;
    },

    setAddDateStaff: (state, action) => {
      state.addDateStaff = action.payload;
    },

    setAddStaffScheduleModal: (state, action) => {
      state.addStaffScheduleModal = action.payload;
    },

    setShowViewStaffModal: (state, action) => {
      state.showViewStaffModal = action.payload;
    },

    setShowStaffDelete: (state, action) => {
      state.showStaffDelete = action.payload;
    },
    setDeletedShiftItem: (state, action) => {
      state.deleteShiftItem = action.payload;
    },

    setServiceStaffRelationList: (state, action) => {
      state.serviceStaffRelationList = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch employee list data
    builder.addCase(fetchEmployeeData.pending, (state) => {
      state.employeeLoading = true;
    });
    builder.addCase(fetchEmployeeData.fulfilled, (state, action) => {
      state.employeeList = action.payload;
      state.employeeLoading = false;
    });
    builder.addCase(fetchEmployeeData.rejected, (state) => {
      state.employeeLoading = false;
    });

    // add employee list data
    builder.addCase(addEmployee.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(addEmployee.fulfilled, (state, action) => {
      if (action?.payload) {
        state.employeeList = [...state.employeeList, action?.payload];
      }
      state.addEmployeeLoading = false;
    });
    builder.addCase(addEmployee.rejected, (state) => {
      state.addEmployeeLoading = false;
    });

    // assign service to employee data
    builder.addCase(asignServiceToStaffApi.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(asignServiceToStaffApi.fulfilled, (state, action) => {
      state.addEmployeeLoading = false;
    });
    builder.addCase(asignServiceToStaffApi.rejected, (state) => {
      state.addEmployeeLoading = false;
    });

    //update employee data
    builder.addCase(updateEmployee.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      const temp = [...state.employeeList];
      const staffUpdatedData = temp?.map((item, index) => {
        if (item?.id == action.payload?.id) {
          return action.payload;
        }
        return item;
      });
      state.selectedStaffDetail = action.payload;
      state.employeeList = staffUpdatedData;
      state.addEmployeeLoading = false;
    });
    builder.addCase(updateEmployee.rejected, (state) => {
      state.addEmployeeLoading = false;
    });

    // staff service relation list to employee data
    builder.addCase(fetchEmployeeServiceRelationData.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(
      fetchEmployeeServiceRelationData.fulfilled,
      (state, action) => {
        state.serviceStaffRelationList = action.payload;
        state.addEmployeeLoading = false;
      }
    );
    builder.addCase(fetchEmployeeServiceRelationData.rejected, (state) => {
      state.addEmployeeLoading = false;
    });

    // update employee status
    // TODO remove update employee status
    builder.addCase(updateEmployeStatus.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(updateEmployeStatus.fulfilled, (state, action) => {
      const temp = [...state.employeeList];
      const staffUpdatedData = temp?.map((item, index) => {
        if (item?.id == action.payload?.id) {
          return action.payload;
        }
        return item;
      });
      state.selectedStaffDetail = action.payload;
      state.employeeList = staffUpdatedData;
      state.addEmployeeLoading = false;
    });
    builder.addCase(updateEmployeStatus.rejected, (state) => {
      state.addEmployeeLoading = false;
    });

    // delete employee service relation
    builder.addCase(deleteServiceStaffRelation.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(deleteServiceStaffRelation.fulfilled, (state, action) => {
      state.serviceStaffRelationList = action.payload;
      state.addEmployeeLoading = false;
    });
    builder.addCase(deleteServiceStaffRelation.rejected, (state) => {
      state.addEmployeeLoading = false;
    });

    // delete employee
    builder.addCase(deleteEmployeeAPI.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(deleteEmployeeAPI.fulfilled, (state, action) => {
      state.employeeList = action.payload;
      state.addEmployeeLoading = false;
    });
    builder.addCase(deleteEmployeeAPI.rejected, (state) => {
      state.addEmployeeLoading = false;
    });

    // update Attendence
    builder.addCase(updateAttendenceAPI.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(updateAttendenceAPI.fulfilled, (state, action) => {
      state.addEmployeeLoading = false;
    });
    builder.addCase(updateAttendenceAPI.rejected, (state) => {
      state.addEmployeeLoading = false;
    });

    //add commission
    builder.addCase(addCommission.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(addCommission.fulfilled, (state, action) => {
      state.addEmployeeLoading = false;
      if (action?.payload) {
        state.commissionData = action?.payload?.commItems;
      }
    });
    builder.addCase(addCommission.rejected, (state) => {
      state.addEmployeeLoading = false;
    });

    // fetch commission
    builder.addCase(fetchCommissionData.pending, (state) => {
      state.addEmployeeLoading = true;
    });
    builder.addCase(fetchCommissionData.fulfilled, (state, action) => {
      state.addEmployeeLoading = false;
      state.commissionData = action?.payload?.commItems;
    });
    builder.addCase(fetchCommissionData.rejected, (state) => {
      state.addEmployeeLoading = false;
    });
  },
});

export const {
  setShowAddStaffModal,
  setSelectedStaffDetail,
  setStaffEditable,
  setShowAssignServiceModal,
  setStaffServiceDelete,
  setAddDateStaff,
  setAddStaffScheduleModal,
  setShowViewStaffModal,
  setShowStaffDelete,
  setShowShiftDeleteModal,
  setDeletedShiftItem,
  setServiceStaffRelationList,
} = staffSlice.actions;
export default staffSlice.reducer;
