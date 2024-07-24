

export const selectRecentlyAddedCustomer = (state:any) => state.users.recentlyAddedCustomerData;

export const selectLoading = (state:any) => state.users.addCustomerLoading;

export const selectCustomerData = (state:any) => state.users.customerUserData;
export const selectCustomerLoading = (state:any) => state.users.customerUserLoading;

export const selectCustomerCount = (state:any) => state.users.customerCount;

export const selectOpenAddCustomerPopup = (state:any) => state.users.editCustomerData;
export const selectOpenCustomerModal = (state:any) => state.users.isOpenCustomerUserData;