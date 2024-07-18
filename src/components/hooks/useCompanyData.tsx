import React from "react";
import { useAppSelector } from "../../redux";
import { selectOwnerData } from "../../redux/auth/selector";

export const useCompanyData = () => {
  const ownerData = useAppSelector(selectOwnerData);
  const companyId = ownerData?.company?.[0]?.id;
  return companyId;
};
