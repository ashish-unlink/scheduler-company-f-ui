import { RequestTimeShiftsProps } from "./requestType";
import { AppStatusProps, Comments, ResopnseAppointmentBlockData, ServiceBookedAppointment, Users } from "./responseType";
import { Dayjs } from "dayjs";
export interface genderProps {
  label: string;
  value: string;
}

export interface AppointmentCalenderTooltip {
  id: string;
  title: string;
  customerName: string;
  staffs: string[];
  startDate: string;
  endDate: string;
}

export interface rowStaffScheduleData {
  id: number;
  day: ResopnseAppointmentBlockData;
  date:string;
  shifts: RequestTimeShiftsProps[];
}
export interface TimeShiftProps {
  id: number;
  startTime: string;
  endTime: string;
}

export interface AppointmentListProps {
  appointmentId: string;
  id: string;
  title: string;
  customerName: string;
  staffs: string[];
  price: number;
  comments: string;
  status: string;
  client: Users;
  serviceDataArr: ServiceBookedAppointment[];
  serviceName: string;
  startDate: string;
  endDate: string;
  employeeName:string;
}

export interface appointmentSatus {
  pending: string;
  canceled: string;
  completed: string;
  clientrejected: string;
  noshow: string;
}

export interface AddAppointmentDataProps {
  id: number;
  serviceId: string;
  services: string;
  staffId: string;
  staff: string;
  price: number;
  serviceTime: string;
  startTime: Dayjs;
  endTime: string;
  empSvcBkgEndTime: string;
  empSvcBkgStartTime: Dayjs;
  startDate: Dayjs;
}

export interface countDataProps {
  employeeCount: number;
  serviceCount: number;
  appointmentCount: number;
  bussinessSetUpDataCount:number;
  c_id?: string;
}


export interface EditAppointmentFormProps {
  status: boolean;
  comments: Comments[];
  apptStatus: AppStatusProps[];
}

export interface companypreferemceData {
  dasmid: { id: string; value: string };
  startTime: { id: string; value: string };
  endTime: { id: string; value: string };
  secretKey: { id: string; value: string };
  currency: { id: string; value: string };
}