import React, { useEffect } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import AppointmentTextField from "../../components/appointment-popup/AppointmentTextField";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  setSelectedCategoryItem,
  setShowCategoryModal,
} from "../../redux/service/slice";
import "./addCategoryModalStyle.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  addServiceCategoryAPI,
  updateServiceCategoryAPI,
} from "../../redux/service/action";
import { addCategoryRequest } from "../../utils/types/requestType";
import { selectOwnerData } from "../../redux/auth/selector";
import { requiredSchema } from "../../utils/validation";
import { useTranslation } from "react-i18next";
import { constantString } from "../../utils/constantString";
import {
  selectServiceCategoryItem,
  selectServiceLoading,
} from "../../redux/service/selector";
import CircularLoader from "../loading/CircularLoader";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { useCompanyData } from "../hooks/useCompanyData";

const AddCategoryModal = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const selectedCategoryItem = useAppSelector(selectServiceCategoryItem);
  const isLoading = useAppSelector(selectServiceLoading);
  const company_id = useCompanyData();
  const { t } = useTranslation();
  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    transform: "translate(-50%, -50%)",
    width: "30%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    height:"100vh",
    boxShadow: 24,
    // p: 4,
  };

  const validationSchema = Yup.object({
    category_name: requiredSchema("Category Name"),
    
  });
  

  const initialValues = {
    category_name: selectedCategoryItem?.title ?? "",
    categoryEnableForAppointment:selectedCategoryItem?.status == "inactive" ? false : true
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body: addCategoryRequest = {
        title: values.category_name,
        company: company_id,
        status:values.categoryEnableForAppointment ? "active" : 'inactive'
      };
      selectedCategoryItem
        ? dispatch(
            updateServiceCategoryAPI({
              values: body,
              id: selectedCategoryItem?.id,
            })
          )
        : dispatch(addServiceCategoryAPI(body));
    },
  });

  const { handleSubmit, handleChange, values, handleBlur, errors, touched } =
    formik;

  return (
    <>
      {isLoading && <CircularLoader />}
      <CustomPopup open={open} style={customStyle}>
        <AppointmentPopupHeader
          onClose={() => {
            dispatch(setShowCategoryModal(false));
            dispatch(setSelectedCategoryItem(null));
          }}
        >
          <b>{selectedCategoryItem ? t(constantString.UPDATE_CATEGORY) : t(constantString.ADD_CATEGORY)}</b>
        </AppointmentPopupHeader>
        <form onSubmit={handleSubmit}>
          <div className="wrap-category">
            <AppointmentTextField
              name="category_name"
              label={t(constantString.CATEGORY_NAME)}
              placeholder="Ex. Hair"
              onChange={handleChange}
              value={values.category_name}
              maxLength={50}
              onBlur={handleBlur}
              error={touched.category_name && errors.category_name}
              mandatory={true}
            />

            <div className="wraped-check-box">
              <Checkbox
                edge="start"
                name="categoryEnableForAppointment"
                checked={values?.categoryEnableForAppointment}
                onChange={handleChange}
                tabIndex={-1}
                disableRipple
              
                // inputProps={{ "aria-labelledby": labelId }}
              />
              <Typography variant="body1" >
                 {t(constantString.ENABLE_APPOINTMENT)}
              </Typography>
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

export default AddCategoryModal;
