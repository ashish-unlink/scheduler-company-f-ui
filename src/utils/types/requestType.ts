import { AddStaffProps } from "../../components/add-staff/type";
import { TimeShiftProps } from "./dataTypes";
import { Comments } from "./responseType";
import { Dayjs } from "dayjs";
export interface loginRequest {
  email: string;
  password: string;
}

export interface signupRequest {
  email: string;
  password: string;
  title: string;
  business_address?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  confirm_password?: string;
}

export interface customerRegisterRequest {
  body: customerRegister;
  id: string;
}

export interface customerRegister {
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender?: string;
}

export interface updateCategoryRequest {
  values: addCategoryRequest;
  id: string;
}

export interface updateSubCategoryRequest {
  values: addSubCategoryRequest;
  id: string;
}

export interface updateCategoryStatusRequest {
  values: { status: string };
  id: string;
  company: string;
}

export interface updateSubCategoryStatusRequest {
  values: { status: string };
  id: string;
  company: string;
  catalogue: string;
}

export interface deleteCategoryRequest {
  // values: { status: string };
  id: string;
  // company: string;
}
export interface deleteSubCategoryRequest {
  // values: { status: string };
  id: string;
  catalogue: string;
}

export interface addCategoryRequest {
  title: string;
  company: string;
  status: "active" | "inactive";
}

export interface addSubCategoryRequest {
  title: string;
  companyId: string;
  price: number | null;
  duration: number | null;
  catalogueId: String;
  description: string;
  status: "active" | "inactive";
}

export interface SearchPopupRequest {
  email: string;
  password: string;
  title: string;
  firstName: string;
  lastName: string;
  fieldName: string;
}

export interface RequestAddEmployee {
  body: AddStaffProps;
  id: string;
}

export interface AddAppoinmentRequest {
  priceFinal: number;
  status?: string | undefined;
  appointmentComments?: { commentId?: string; content: string }[];
  svcBooked: AppointmentServiceBooked[];
  discount?: number | undefined;
  clientId: string;
  companyId: string;
  appointmentDate: string;
  startTime: string;
  endTimeExpected: string;
  endTime: string;
  totalDuration: number;
  priceExpected: number;
  priceFull: number;
  id?: string | undefined;
  canceled?: boolean | undefined;
  cancelationReason?: string;
  appointmentStatus: { statusId?: string; status: string }[];
}

export interface AppointmentServiceBooked {
  empSvcBkgDuration: number;
  svcCtlgItemsId: string;
  employeeBookedId: string;
  price: number;
  empSvcBkgStartTime: string;
  empSvcBkgEndTime: string;
}

export interface bussinessSetupRequest {
  companyPreferences: companyPreferenceProps[];
}

export interface companyPreferenceProps {
  id?: string;
  companyId: string;
  prefKey: string;
  prefValue: string;
}
export interface AppointmentCountRequest {
  companyId: string;
  appointmentStartDate?: string;
  appointmentEndDate?: string;
}

export interface RequestClientVerification {
  token: string;
  email: string;
}

export interface RequestUpdateAttendence {
  scheduleData: { id: string; status: string }[];
}

export interface RequestAddEmployeeShift {
  employeeId: string;
  startDate: string;
  endDate: string;
  shiftData: [
    {
      targetDays: string[];
      shiftNTimeData: RequestTimeShiftsProps[];
    }
  ];
}

export interface RequestTimeShiftsProps {
  shiftId: number;
  from: string;
  to: string;
  day?: string;
  id?: string;
}

export interface addCommissionrequest {
  commPercentage: number;
}

export interface paymentRequestProps {
  appointmentId: string;
  transaction: {
    transactionId?: string;
    amountReceived: number | undefined;
  };
}
