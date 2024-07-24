import { countDataProps } from "./dataTypes";

export interface UserDataResponse {
  skip: number;
  take: number;
  users: Users[];
}

export interface Users {
  createdAt: string;
  createdBy: string;
  email: string;
  firstName: string;
  gender: string;
  id: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  lastName: string;
  otp: string;
  phoneNumber: string;
  role: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  username: string;
  // companyId: string;
  companyData: countDataProps;
  token?: string;
  deletedAt?: any;
  password: string;
  dateOfBirth?: any;
  emplStartDate?: any;
  emplEndDate?: any;
  emplDesig?: any;
  emplCode?: any;
  emplDesc?: any;
  aadharCard?: any;
  panCard?: any;
  isEmplPermanent?: any;
  ownerBusiness: OwnerBusiness;  
}
export interface OwnerBusiness {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: any;
  deletedAt?: any;
  title: string;
  slug: string;
  content?: any;
  businessType: string;
  ownerId: string;
  businessLocations: BusinessLocation[];
}

export interface UserStaffs {
  createdAt: string;
  createdBy: string;
  email: string;
  firstName: string;
  gender: string;
  id: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  lastName: string;
  otp: string;
  phoneNumber: string;
  role: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  username: string;
  companyId: string;
  dateOfBirth: string;
  emplStartDate: null | string;
  emplEndDate: null | string;
  emplDesig: string;
  emplCode: number;
  emplDesc: string;
  isEmplPermanent: boolean;
  billingAddresses: Address[];
}

export interface Address {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: null | string;
  city: string;
  postal: number;
  region: string;
  state: string;
  street: string;
  isMainAddress: boolean;
  country: CountryListProps;
}

// export interface Users {
//   companies?: [];
//   company?: string;
//   companyRelations?: [];
//   createdAt: string;
//   createdBy: string;
//   email: string;
//   firstName: string;
//   gender: string;
//   id: string;
//   isBlocked: boolean;
//   isEmailVerified: boolean;
//   lastName: string;
//   otp: string;
//   phoneNumber: string;
//   role: string;
//   status: string;
//   updatedAt: string;
//   updatedBy: string;
//   username: string;
// }

export interface CompanyDataProps {
  content: string;
  createdAt: string;
  createdBy: string;
  id: string;
  slug: string;
  title: string;
  updatedAt: string;
  updatedBy: string;
  owner: {
    email: string;
  };
}

export interface CountryListProps {
  createdAt: string;
  createdBy: string;
  slug: string;
  title: string;
  updatedAt: string;
  id: string;
  updatedBy: string;
  label: string;
  value: string;
}

export interface ResponseType {
  data: any;
  message: string;
  messageCode: string;
  statusCode: number;
  success: boolean;
}

export interface ResponseUser {
  users: Users[];
  count: number;
  skip: number;
  take: number;
}

export interface ResponseServiceList {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  title: string;
  slug: string;
  status: string;
  svcCtlgItems: ServiceListItem[];
  company: string;
  // company?:string;
}

export interface ServiceListItem {
  length: number;
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  title: string;
  slug: string;
  status: string;
  svcCtlgItems: ServiceListItem;
  price: string;
  duration: number;
  catalogueId: string;
  companyId: string;
  description: string;
}

export interface ResponseAppointment {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  status: string;
  appointmentDate: string;
  startTime: string;
  endTimeExpected: string;
  endTime: string;
  totalDuration: number;
  priceExpected: number;
  priceFull: number;
  discount: number;
  priceFinal: string;
  canceled: boolean | null;
  cancelationReason: string | null;
  comment: string;
  comments: Comments[];
  companyId: string;
  clientId: string;
  client: Users;
  company: CompanyDataProps;
  servicesBooked: ServiceBookedAppointment[];
  apptStatus: AppStatusProps[];
  apmtTxn: {totalAmount: number, balance: number}
}

export interface AppStatusProps {
  status: string;
  createdAt: string;
  createdBy: string;
}

export interface Comments {
  id: string;
  createdAt: string;
  createdBy: string;
  content: string;
  appointmentId: string;
}

export interface ServiceBookedAppointment {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  appointmentId: string;
  svcCtlgItemsId: string;
  employeeBookedId: string;
  price: number;
  svcBkgDate: string;
  empSvcBkgStartTime: string;
  empSvcBkgEndTime: string;
  status: string;
  svcCtlgItems?: ServiceListItem;
  employeeBooked: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  employeeBookedData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  svcCtlgItemsData: {
    id: string;
    title: string;
    status: string;
    description: string;
    catalogueId: string;
    companyId: string;
    catalogue: {
      title: string;
      status: string;
    };
    price: string;
    duration: number;
  };
}

export interface ResopnseAppointmentBlockData {
  id: string;
  employeeId: string;
  day: string;
  date: string;
  from: string;
  to: string;
  shiftId: 1;
  apptBkgData: null | ServiceAppointment;
  employee: { firstName: string; lastName: string; status: string };
  status: string;
}

export interface ServiceAppointment {
  appointmentId: string;
  svcCtlgItemsId: string;
  serviceBookedId: string;
  empSvcBkgEndTime: string;
  empSvcBkgDuration: number;
  empSvcBkgStartTime: string;
}

export interface ResponseServiceStaffRelation {
  firstName(lastName: string, firstName: any): import("react").ReactNode;
  id: string;
  svcCtlgItemsId: string;
  employeeId: string;
  svcCtlgItems: {
    title: string;
  };
  employee: {
    firstName: string;
    lastName: string;
    status?: string;
    isEmplPermanent?: boolean;
  };
  title?: string;
}

export interface AppointmentCountProps {
  appointmentDate: string;
  count: string;
  pending: number;
  completed: number;
  cancelled: number;
}

export interface ResponseBussinessList {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  companyId: string;
  slug: string;
  prefKey: string;
  prefValue: string;
}

export interface ResponseAddCommission {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: any;
  updatedBy?: any;
  deletedAt?: any;
  commissionPct: number;
  employeeId: string;
  employee: UserStaffs;
  commItems: CommItem[];
}

export interface CommItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: any;
  updatedBy?: any;
  deletedAt?: any;
  commissionPct: number;
  employeeCommisionId: string;
}


export interface PaymentTransactionResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  dasmid: string;
  appointmentId: string;
  totalAmount:number;
  balance:number;
  txnItems: TxnItem[];
}
export interface TxnItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  link?: string;
  totalAmount: string;
  balance: string;
  amountReceived: string;
  gatewayTxnId?: string | null;
  gatewayTxnRef?: string | null;
  comment?: string;
  status: string;
  gatewayPblId?: string;
  apmtTxnId: string;
  txnTime:string | null;
}

export interface ResponseMultiStore {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: any;
  deletedAt?: any;
  title: string;
  slug: string;
  content?: any;
  businessType: string;
  status:string;
  ownerId: string;
  owner: Users | null;
  openTime: string,
  closeTime: string,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
  businessLocations: BusinessLocation[];
}
export interface BusinessLocation {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: any;
  deletedAt?: any;
  title: string;
  slug: string;
  content: string;
  isPrimaryCompany: boolean;
  mainBusinesId: string;
  status: string;
  companyAddress?: Address;  
  mainBusines?:ResponseMultiStore;
  openTime: string;
  closeTime: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
}