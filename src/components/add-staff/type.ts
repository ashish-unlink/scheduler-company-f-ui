export interface AddStaffProps {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
  aadharCard?: string;
  panCard?: string;
  emplStartDate?: string;
  emplEndDate?: string;
  emplDesig: string;
  emplCode: string;
  emplDesc: string;
  isEmplPermanent: boolean;
  status:string;
  primaryAddress: {
    isMainAddress?:boolean;
    addressId?: string;
    city?: string;
    postal?: string;
    region?: string;
    state?: string;
    street?: string;
    addressType?:string;
    countryId?: string;
    secondaryAddress?: {
      addressId?: string;
      city: string;
      postal: string;
      region: string;
      state: string;
      street: string;
      addressType:string;
      countryId: string;
    };
  };
}
