import React from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import { useAppDispatch, useAppSelector } from "../../redux";

import "./layoutStyle.css";

import { useNavigate } from "react-router-dom";
import {
  selectChangeStoreModal,
  selectMultiStoreList,
  selectMultiStoreLoading,
} from "../../redux/multi-store/selector";
import {
  BusinessLocation,
} from "../../utils/types/responseType";
import { setChangeStoreModal } from "../../redux/multi-store/slice";
import { selectCurrentOutlet, selectOwnerData } from "../../redux/auth/selector";
import { capitilizeName } from "../../utils/general";
import { fetchBussinessCountData } from "../../redux/multi-store/action";
import { useCompanyData } from "../hooks/useCompanyData";
import CircularLoader from "../loading/CircularLoader";

export const StoreListModal = () => {
  const open = useAppSelector(selectChangeStoreModal);
  const storeDataList = useAppSelector(selectMultiStoreList);
  const currentOutlet = useAppSelector(selectCurrentOutlet);
  const dispatch = useAppDispatch();
  const companyId = useCompanyData();
  const isLoading = useAppSelector(selectMultiStoreLoading);
  const loginOwner = useAppSelector(selectOwnerData);

  const customStyle = {
    position: "absolute",
    top: "18vh",
    left: "35%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "1rem",
    boxShadow: 24,
    height:"50vh",
    overflowY: "scroll",
    // p: 4,
  };

  const navigate = useNavigate();

  return (
    <>
    {isLoading && <CircularLoader />}
    <CustomPopup open={open} style={customStyle}>
      <AppointmentPopupHeader
        onClose={() => {
          dispatch(setChangeStoreModal(false));
        }}
      >
        <b>Select Store</b>
      </AppointmentPopupHeader>

      <div className="store-container">
        {storeDataList?.businessLocations?.map((item: BusinessLocation) => {
          return (
            item && (
              <div
                className={`store-item ${
                  item?.id === currentOutlet?.id && "active-store"
                } `}
                onClick={() => {
                  let temp = { ...storeDataList };
                  delete temp.owner;
                  const newStoreData = {
                    ...storeDataList?.owner,
                    ownerBusiness: temp,
                    token:loginOwner?.token
                  };
                  dispatch(
                    fetchBussinessCountData({
                      newStoreData,
                      navigate,
                      currentOutletData:item,
                      storeDataList:storeDataList
                    })
                  );
                
                }}
              >
                {`${capitilizeName(item?.title)}`}

                <p className="view-store-location">{item?.companyAddress ? `${item.companyAddress.street}, ${item.companyAddress.city}, ${item.companyAddress.state}, ${item.companyAddress.postal}` :"-"} </p>
              </div>
            )
          );
        })}
      </div>
    </CustomPopup>
    </>
  );
};
