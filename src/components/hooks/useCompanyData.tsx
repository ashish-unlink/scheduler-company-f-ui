import React from "react";
import { useAppSelector } from "../../redux";
import { selectCurrentOutlet, selectOwnerData } from "../../redux/auth/selector";
import { BusinessLocation } from "../../utils/types/responseType";

export const useCompanyData = () => {
  const ownerData = useAppSelector(selectOwnerData);
  const current = useAppSelector(selectCurrentOutlet);

  let companyId = ownerData?.ownerBusiness?.businessLocations?.find((i:BusinessLocation)=> {return i?.isPrimaryCompany == true})?.id;
  if(current){
    companyId = current?.id
  }else{
    companyId = ownerData?.ownerBusiness?.businessLocations?.find((i:BusinessLocation)=> {return i?.isPrimaryCompany == true})?.id;
  }
  return companyId;
};
