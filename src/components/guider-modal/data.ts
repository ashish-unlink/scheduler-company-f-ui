import { Navigate } from "react-router-dom";
import store, { useAppSelector } from "../../redux";
import { setShowCustomerAppointmentModal } from "../../redux/appointment/slice";
import { setShowGuiderModal } from "../../redux/meta/slice";
import { selectServiceList } from "../../redux/service/selector";
import {
  setSelectedCategoryItem,
  setShowCategoryModal,
  setShowSubCategoryModal,
} from "../../redux/service/slice";
import {
  setShowAddStaffModal,
  setShowAssignServiceModal,
} from "../../redux/staff/slice";
import { PrivatePath } from "../constants/routes.c";
import { NavigateFunction } from "react-router-dom";

export const categorySuccessData = {
  title: "Category created!",
  text: "You can either add a service now or keep building more categories.",
  note: "You'll need a full catalogue before Teams.",
  btnGroup: {
    repeat: {
      name: "Add Category",
      onClick: () => {
        store?.dispatch(setShowCategoryModal(true));
        store?.dispatch(setShowGuiderModal(false));
      },
    },
    procced: {
      name: "Add Service",
      onClick: () => {
        store?.dispatch(setShowSubCategoryModal(true));
        store?.dispatch(setShowGuiderModal(false));
        store?.dispatch(
          setSelectedCategoryItem(store?.getState()?.service?.serviceList[0])
        );
      },
    },
  },
};

export const serviceSuccessData = {
  title: "Service created!",
  text: "You can either keep adding services or proceed to build your team.",
  btnGroup: {
    repeat: {
      name: "Add Service",
      onClick: (navigate: NavigateFunction) => {
        store?.dispatch(setShowSubCategoryModal(true));
        store?.dispatch(setShowGuiderModal(false));
      },
    },
    procced: {
      name: "Add Team Member",
      onClick: (navigate: NavigateFunction) => {
        store?.dispatch(setShowAddStaffModal(true));
        store?.dispatch(setShowGuiderModal(false));
        navigate(PrivatePath?.staff);
      },
    },
  },
};

export const firstStaffSuccessData = {
  title: "Team member added!",
  text: "Before we proceed to creating appointments, let's tag this employee to their relevant services.",
  btnGroup: {
    repeat: {
      name: "Add Team Member",
      onClick: () => {
        store?.dispatch(setShowAddStaffModal(true));
        store?.dispatch(setShowGuiderModal(false));
      },
    },
    procced: {
      name: "Assign Services",
      onClick: () => {
        store?.dispatch(setShowAssignServiceModal(true));
        store?.dispatch(setShowGuiderModal(false));
      },
    },
  },
};

export const firstStaffServiceAssignSuccessData = {
  title: "Service assigned successfully!",
  text: "The team member has been successfully tagged to their services. You can now begin scheduling appointments!",
  btnGroup: {
    // repeat: {
    //   name: "Add Team Member",
    //   onClick: () => {
    //     store?.dispatch(setShowAddStaffModal(true));
    //     store?.dispatch(setShowGuiderModal(false));
    //   },
    // },
    procced: {
      name: "Create an Appointment",
      onClick: (navigate: NavigateFunction) => {
        store?.dispatch(setShowCustomerAppointmentModal(true));
        store?.dispatch(setShowGuiderModal(false));
        navigate(PrivatePath?.create);
      },
    },
  },
};
