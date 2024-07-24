import React from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import AppointmentTextField from "../../components/appointment-popup/AppointmentTextField";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AddAddressRequest } from "../../utils/types/requestType";
import { selectOwnerData } from "../../redux/auth/selector";
import { requiredSchema, zipCodeSchema } from "../../utils/validation";
import { useTranslation } from "react-i18next";
import { constantString } from "../../utils/constantString";
import CircularLoader from "../loading/CircularLoader";
import { useCompanyData } from "../hooks/useCompanyData";
import { setOpenLocation } from "../../redux/multi-store/slice";
import { addStoreLocationAPI, updateStoreLocationAPI } from "../../redux/multi-store/action";
import { BusinessLocation } from "../../utils/types/responseType";
import { selectAddEditAddressStoreLoading } from "../../redux/multi-store/selector";
import AppointmentSelectBox2 from "../appointment-popup/AppointmentSelectBox2";
import { selectCountryList } from "../../redux/meta/selector";

const AddStoreAddress = ({
  open,
  selectedAddress,
  clearEditState,
}: {
  open: boolean;
  selectedAddress: BusinessLocation;
  clearEditState:(val:BusinessLocation | null)=>void;
}) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAddEditAddressStoreLoading);
  const companyId = useCompanyData();
  const { t } = useTranslation();
  const ownerData = useAppSelector(selectOwnerData);
  const ownerId = ownerData?.ownerBusiness?.ownerId;
  const countryList = useAppSelector(selectCountryList) ?? [];

  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    transform: "translate(-50%, -50%)",
    width: "30%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    height: "100vh",
    boxShadow: 24,
    // p: 4,
  };

  const validationSchema = Yup.object({
    street:requiredSchema("Street"),
    city:requiredSchema("City"),
    state:requiredSchema("State"),
    zipcode:zipCodeSchema(),
    country:requiredSchema("County"),
  });

  const initialValues = {
    street: selectedAddress?.companyAddress?.street ?? "",
    city: selectedAddress?.companyAddress?.city ?? "",
    state: selectedAddress?.companyAddress?.state ?? "",
    zipcode: selectedAddress?.companyAddress?.postal ?? "",
    country:selectedAddress?.companyAddress?.country ?? "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
        const body: AddAddressRequest = {
          ...(selectedAddress?.companyAddress && {id :selectedAddress?.companyAddress?.id}),
            addressType: "office",
            city: values?.city,
            postal: values?.zipcode,
            region: values?.state,
            state: values?.state,
            street: values?.street,
            countryId: values?.country,
            companyId: selectedAddress?.id
        };
        selectedAddress?.companyAddress
          ? 
          dispatch(
            updateStoreLocationAPI({body, ownerId : ownerId})
            )
          : 
          dispatch(addStoreLocationAPI({body, ownerId : ownerId}));
    },
  });

  const { handleSubmit, handleChange, values, handleBlur, errors, touched , setFieldValue} =
    formik;

  return (
    <>
      {isLoading && <CircularLoader />}
      <CustomPopup open={open} style={customStyle}>
        <AppointmentPopupHeader
          onClose={() => {
            dispatch(setOpenLocation(false));
            clearEditState(null)
          }}
        >
          <b>{selectedAddress?.companyAddress ? t(constantString?.UPDATE_STORE_LOCATION) : t(constantString?.ADD_LOCATION)}</b>
        </AppointmentPopupHeader>
        <form onSubmit={handleSubmit}>
          <div className="wrap-store-location">
            <div className="location-input-wrap">
              <AppointmentTextField
                name="street"
                label={t(constantString.STREET)}
                placeholder="Street"
                onChange={handleChange}
                value={values.street}
                onBlur={handleBlur}
                error={touched.street && errors.street}
                mandatory
              />
            </div>
            <div className="location-input-wrap">
              <AppointmentTextField
                name="city"
                label={t(constantString.CITY)}
                placeholder="City"
                onChange={handleChange}
                value={values.city}
                onBlur={handleBlur}
                error={touched.city && errors.city}
                mandatory
              />
            </div>
            <div className="location-input-wrap">
              <AppointmentTextField
                name="state"
                label={t(constantString.STATE)}
                placeholder="State"
                onChange={handleChange}
                value={values.state}
                onBlur={handleBlur}
                error={touched.state && errors.state}
                mandatory
              />
            </div>

            <div className="location-input-wrap">
              <AppointmentTextField
                name="zipcode"
                label={t(constantString.POSTAL_CODE)}
                placeholder="Postal Code"
                onChange={handleChange}
                value={values.zipcode}
                onBlur={handleBlur}
                maxLength={7}
                error={touched.zipcode && errors.zipcode}
                mandatory
              />
            </div>
            <div className="location-input-wrap">
                <AppointmentSelectBox2
                  options={countryList}
                  name="country"
                  label={t(constantString.COUNTRY)}
                  placeholder="Country"
                  onChange={(e)=>{
                    handleChange(e);
                    setFieldValue("country", e.target.value)
                  }}
                  value={values?.country}
                  error={touched.country && errors.country}
                  mandatory
                />


              <div className="btn-div">
                <Button
                  variant="contained"
                  className="contained-btn"
                  type="submit"
                >
                  {t(constantString.SAVE)}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CustomPopup>
    </>
  );
};

export default AddStoreAddress;
