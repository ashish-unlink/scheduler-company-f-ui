import { amber, blue, indigo, teal } from "@mui/material/colors";
import { genderProps } from "../../utils/types/dataTypes";
import dayjs from "dayjs";
import { getFormattedDate, getFormattedDateTime } from "../../utils/general";

// TODO remove commented data
export const appointmentsArray = [
  // {
  //   id: 1,
  //   title: "Mayank",
  //   customerName: "Mayank",
  //   staffs: ["981a7bfe-ecc6-4d99-a636-65d08c662d86"],
  //   staffsDetail: [{ firstName: "Abc", value: "Abc" }],
  //   serviceDataArr: [{id:'1', name:"hairs"},{id:'2', name:"nails"}],
  //   startDate: new Date(
  //     dayjs(getFormattedDateTime("2024-03-09", "9:00")).format(
  //       "YYYY-MM-DD HH:mm"
  //     )
  //   ),
  //   endDate: new Date(
  //     dayjs(getFormattedDateTime("2024-03-09", "10:00")).format(
  //       "YYYY-MM-DD HH:mm"
  //     )
  //   ),
  // },
  // {
  //   id: 2,
  //   title: "Ananya",
  //   customerName: "Ananya",
  //   serviceDataArr: [{id:'1', name:"hairs"},{id:'2', name:"nails"}],
  //   staffs: ["981a7bfe-ecc6-4d99-a636-65d08c662d86"],
  //   staffsDetail: [{ firstName: "Abc", value: "Abc" }],
  //   startDate: new Date(
  //     dayjs(getFormattedDateTime("2024-03-09", "14:20")).format(
  //       "YYYY-MM-DD HH:mm"
  //     )
  //   ),
  //   endDate: new Date(
  //     dayjs(getFormattedDateTime("2024-03-09", "15:00")).format(
  //       "YYYY-MM-DD HH:mm"
  //     )
  //   ),
  // },
  {
    client: {
      id: "be586088-0053-4792-a5c7-c77feeb0a379",
      firstName: "Riya",
      lastName: "Don",
      email: "riya@mailinator.com",
      phoneNumber: "+817788552299",
    },
    comments: [],
    customerName: "Don Riya",
    // endDate: "Sat Mar 09 2024 01:50:00 GMT+0530 (India Standard Time) {}",
    startDate: new Date(
      dayjs(getFormattedDateTime("2024-03-10", "13:00:00")).format(
        "YYYY-MM-DD HH:mm"
      )
    ),
    endDate: new Date(
      dayjs(getFormattedDateTime("2024-03-10", "13:50:00")).format(
        "YYYY-MM-DD HH:mm"
      )
    ),
    id: "b873113d-fbd5-43ea-90f1-bf701cda7da9",
    staffs: ["9bfb658e-781a-466b-ae92-058e264909ad"],
    // startDate: "Sat Mar 09 2024 01:00:00 GMT+0530 (India Standard Time) {}",
    status: "pending",
    title: "Don Riya",
  },
  {
    client: {
      id: "be586088-0053-4792-a5c7-c77feeb0a379",
      firstName: "Riya",
      lastName: "Don",
      email: "riya@mailinator.com",
      phoneNumber: "+817788552299",
    },
    comments: [],
    customerName: "Don Riya",
    endDate: 'Sun Mar 10 2024 19:20:00 GMT+0530 (India Standard Time) {}',
    id: "b873113d-fbd5-43ea-90f1-bf701cda7da9",
    staffs: "9bfb658e-781a-466b-ae92-058e264909ad",
    startDate:  'Sun Mar 10 2024 19:00:00 GMT+0530 (India Standard Time) {}',
    status: "pending",
    title: "Don Riya",
  },
];

export const status = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Upcoming",
    value: "pending",
  },
  {
    label: "Cancelled",
    value: "canceled",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Client Rejected",
    value: "clientrejected",
  },
  {
    label: "No Show",
    value: "noshow",
  },
];

export const opeiningTime = 0;
export const closingTime = 24;

export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Prefer Not to Say", value: "other" },
];

export const myappointment = {
  customerName: "Riya",
  Services: [
    {
      id: "2023-12-28T10:35:49.935Z",
      serviceName: "Hair Color",
      resourceName: "Max",
      price: "1000",
      theropist: [1],
      time: "30",
      startTime: "09:00",
      endTime: "09:30",
      startDate: "2023-12-28T03:30:00.000Z",
      endDate: "2023-12-28T04:00:00.000Z",
    },
    {
      id: "2023-12-28T10:35:52.549Z",
      serviceName: "Hair Straightning",
      resourceName: "Max",
      price: "2000",
      theropist: [1],
      time: "60",
      startTime: "09:30",
      endTime: "10:30",
      startDate: "2023-12-28T04:00:00.000Z",
      endDate: "2023-12-28T05:00:00.000Z",
    },
  ],
  totalPrice: 3000,
  comment: "test",
  status: "pending",
  completed: true,
  totalTime: 90,
};
// export const staff_eng = [
//   {
//     StaffID: 1,
//     ServiceID: 2,
//     StartTime: "9:30",
//     Endtime: "10:00",
//   },
//   {
//     StaffID: 3,
//     ServiceID: 2,
//     StartTime: "9:30",
//     Endtime: "10:00",
//   },
// ];
