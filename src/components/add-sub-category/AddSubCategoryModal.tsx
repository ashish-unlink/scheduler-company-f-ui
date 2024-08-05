import React, { useState } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import AppointmentTextField from "../../components/appointment-popup/AppointmentTextField";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../redux";

import "./addSubCategoryModalStyle.css";
import { useFormik } from "formik";
import {
  priceSchema,
  requiredSchema,
  timeMinuteSchema,
} from "../../utils/validation";
import * as Yup from "yup";

import { addSubCategoryRequest } from "../../utils/types/requestType";
import TextArea from "../text-area";
import {
  appointmentSuccessColumns,
  constantString,
} from "../../utils/constantString";
import {
  selectServiceCategoryItem,
  selectServiceList,
  selectServiceLoading,
  selectServiceSubCategoryItem,
} from "../../redux/service/selector";
import {
  addServiceSubCategoryAPI,
  updateServiceSubCategoryAPI,
} from "../../redux/service/action";
import {
  setSelectedCategoryItem,
  setSelectedSubCategoryItem,
  setShowSubCategoryModal,
} from "../../redux/service/slice";
import CircularLoader from "../loading/CircularLoader";
// import { convertPrice } from "../../utils/general";
import { Checkbox } from "@mui/material";
import { useCountryCurrency } from "../hooks/useCountryCurrency";
import { useTranslation } from "react-i18next";
import { useCompanyData } from "../hooks/useCompanyData";
import { MultiSelectAutoComplete } from "../user-list-dropdown";
import { ImageUploader } from "../image-uploader/ImageUploader";

const AddServiceModal = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const selectedCategoryData = useAppSelector(selectServiceCategoryItem);
  const selectedSubCategoryItem = useAppSelector(selectServiceSubCategoryItem);
  const isLoading = useAppSelector(selectServiceLoading);
  const currencySymbol = useCountryCurrency();
  const company_id = useCompanyData();
  const categoryList = useAppSelector(selectServiceList);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('');

  const { t } = useTranslation();

  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    boxShadow: 24,
    height: "100vh",
  };

  const validationSchema = Yup.object({
    sub_category_name: requiredSchema("Service"),
    time: timeMinuteSchema(),
    price: priceSchema(),
  });
  const initialValues = {
    sub_category_name: selectedSubCategoryItem?.title ?? "",
    time: selectedSubCategoryItem?.duration ?? "",
    price: selectedSubCategoryItem?.price ? selectedSubCategoryItem?.price : "",
    description: selectedSubCategoryItem?.description ?? "",
    serviceEnableForAppointment:
      selectedSubCategoryItem?.status == "inactive" ? false : true,
    catgeory: selectedCategoryData ?? "",
    selectedFile: selectedSubCategoryItem?.selectImage ?? null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const body: addSubCategoryRequest = {
        title: values.sub_category_name,
        price: parseFloat(values.price),
        duration: parseInt(values.time),
        companyId: company_id,
        catalogueId: selectedCategoryData?.id,
        ...( values?.description && {description: values?.description}),
        status: values?.serviceEnableForAppointment ? "active" : "inactive",
        photoFilename:selectedFile,
        base64Data:previewUrl,
      };
      selectedSubCategoryItem
        ? dispatch(
            updateServiceSubCategoryAPI({
              values: body,
              id: selectedSubCategoryItem?.id,
            })
          )
        : dispatch(addServiceSubCategoryAPI(body));
    },
  });

  const {
    handleSubmit,
    handleReset,
    handleChange,
    values,
    handleBlur,
    setFieldValue,
    errors,
    touched,
  } = formik;

  return (
    <>
      {isLoading && <CircularLoader />}
      <CustomPopup open={open} style={customStyle}>
        <form onSubmit={handleSubmit}>
          <AppointmentPopupHeader
            onClose={() => {
              dispatch(setShowSubCategoryModal(false));
              dispatch(setSelectedSubCategoryItem(null));
              dispatch(setSelectedCategoryItem(null));
            }}
          >
            <b>
              {selectedSubCategoryItem
                ? t(constantString.UPDATE_SERVICE)
                : t(constantString.ADD_SERVICES)}
            </b>
          </AppointmentPopupHeader>

          <div className="wrap-all-category">
            <div className="wrap-sub-category">
              <MultiSelectAutoComplete
                label={t(constantString.SELECT_CATEGORY)}
                id="category"
                placeholder="Category"
                option={categoryList}
                onChange={(e, val) => {
                  handleChange(e);
                  dispatch(setSelectedCategoryItem(val));
                }}
                value={values?.catgeory}
                onBlur={handleBlur}
                mandatory
              />
            </div>
            <div className="wrap-sub-category">
              <AppointmentTextField
                name="sub_category_name"
                id="sub_category_name"
                label={t(constantString.SERVICE_NAME)}
                placeholder="Ex. Hair spa"
                onChange={handleChange}
                value={values.sub_category_name}
                maxLength={50}
                onBlur={handleBlur}
                mandatory={true}
                error={
                  touched.sub_category_name &&
                  errors.sub_category_name &&
                  errors.sub_category_name
                }
              />
            </div>
            <div className="wrap-sub-category">
              <AppointmentTextField
                name="time"
                id="time"
                label={t(constantString.TIME_IN_MIN)}
                placeholder="Ex. 30"
                onChange={handleChange}
                value={values.time}
                onBlur={handleBlur}
                mandatory={true}
                error={touched.time && errors.time && errors.time}
              />
            </div>

            <div className="wrap-sub-category">
              <AppointmentTextField
                name="price"
                id="price"
                label={`${t(
                  appointmentSuccessColumns.PRICE
                )} (${currencySymbol})`}
                placeholder="Ex. 699"
                onChange={handleChange}
                value={values.price}
                onBlur={handleBlur}
                mandatory={true}
                error={touched.price && errors.price}
              />
            </div>

            <div className="wrap-sub-category image-button">
              <ImageUploader
                setSelectedFile={(fileName: string) => {
                  setSelectedFile(fileName)
                }}
                setPreviewUrl={(base64)=>{
                  setPreviewUrl(base64)
                }}
                // error={touched.selectedFile && errors.selectedFile}
              />
            </div>

            <div className="wrap-sub-category">
              {previewUrl && (
                <img src={previewUrl} alt="preview" width={150} height={150} style={{objectFit:'cover'}}/>
              )}
            </div>

            <div className="subcategory-checkbox-wrap wrap-sub-category">
              <Checkbox
                edge="start"
                name="serviceEnableForAppointment"
                checked={values?.serviceEnableForAppointment}
                onChange={handleChange}
                tabIndex={-1}
                disableRipple
              />
              <p className="service-status-text">
                {t(constantString.ENABLE_APPOINTMENT)}
              </p>
            </div>

            <div className="wrap-sub-category">
              <TextArea
                label={t(constantString.DESCRIPTION)}
                rows={3}
                cols={50}
                placeholder="Description"
                onChange={handleChange}
                id="description"
                name="description"
                onBlur={handleBlur}
                value={values.description}
                style={{
                  paddingLeft: "22px",
                  paddingTop: "15px",
                  paddingRight: "20px",
                }}
                maxLength={150}
              />
            </div>

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
        </form>
      </CustomPopup>
    </>
  );
};

export default AddServiceModal;
