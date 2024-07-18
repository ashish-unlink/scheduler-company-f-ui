
export const selectshowAddStaffModal = (state:any) => state.staff.showAddStaffModal;

export const selectEmployeeList = (state:any) => state.staff.employeeList;
export const selectEmployeeLoading = (state:any) => state.staff.addEmployeeLoading;
export const selectSelectedStaffDetails = (state:any) => state.staff.selectedStaffDetail;
export const selectStaffEditable = (state:any) => state.staff.isStaffEditable;
export const selectShowAssignModal = (state:any) => state.staff.showAssignServiceModal;

export const selectEmployeeListLoading = (state:any) => state.staff.employeeLoading;
export const selectServiceEmployeeRelationList = (state:any) => state.staff.serviceStaffRelationList;

export const selectStaffServiceDelete = (state:any) => state.staff.deleteStaffRelation;


export const selectAddDateStaff = (state:any) => state.staff.addDateStaff;

export const selectAddScheduleStaff = (state:any) => state.staff.addStaffScheduleModal;
export const selectShowStaffModal = (state:any) => state.staff.showViewStaffModal;

export const selectShowStaffDeleteModal = (state:any) => state.staff.showStaffDelete;

export const selectShowShiftDelete = (state:any) => state.staff.showShiftDeleteModal;
export const selectDeletedShiftItem = (state:any) => state.staff.deleteShiftItem;

export const selectCommissionData = (state:any) => state.staff.commissionData;







