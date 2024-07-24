import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import AppointmentTextField from "../../components/appointment-popup/AppointmentTextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { addCategoryRequest } from "../../utils/types/requestType";
import {
  phoneSchema,
  registerEmailSchema,
  requiredSchema,
} from "../../utils/validation";
import { useTranslation } from "react-i18next";
import { constantString } from "../../utils/constantString";
import dayjs from "dayjs";
import CircularLoader from "../../components/loading/CircularLoader";
import { TimePicker } from "../../components/time-picker/TimePicker";
// import "./style.css";
import { AddEditMultiStoreType } from "../../utils/types/requestType";
import AppointmentSelectBox2 from "../appointment-popup/AppointmentSelectBox2";
import { storeStatus } from "../../utils/primtive/status";
import { addStoreAPI, updateStoreAPI } from "../../redux/multi-store/action";
import { useAppDispatch, useAppSelector } from "../../redux";
import { useCompanyData } from "../hooks/useCompanyData";
import { setOpenStoreModal } from "../../redux/multi-store/slice";
import TextArea from "../text-area";
import { selectOwnerData } from "../../redux/auth/selector";
import { selectAddEditStoreLoading } from "../../redux/multi-store/selector";
import { BusinessLocation } from "../../utils/types/responseType";

const AddEditStore = ({ open = true ,data, clearEditState}: { open: boolean;data?:BusinessLocation,clearEditState:(val:BusinessLocation | null)=>void}) => {
  const isLoading = useAppSelector(selectAddEditStoreLoading);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const companyId = useCompanyData();
  const ownerData = useAppSelector(selectOwnerData);
  const ownerId = ownerData?.ownerBusiness?.ownerId;

  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    height: "100vh",
    boxShadow: 24,
    // p: 4,
  };

  const validationSchema = Yup.object({
    store_name: requiredSchema("Store Name"),
    store_status: requiredSchema("Store Status"),
    store_open_time: requiredSchema("Store Open Time"),
    store_close_time: requiredSchema("Store Close Time"),
    store_contact_person_name: requiredSchema("Store Contact Person Name"),
    store_contact_person_email: registerEmailSchema(),
    store_contact_person_phone: phoneSchema(),
  });

  const initialValues = {
    store_name: data ? data?.title ?? "" :"",
    store_status: data ? data.status === "active" ? "open" : "closed" : "open" ,
    store_open_time:  data?.openTime ? dayjs(data?.openTime,"HH:mm") : "" , 
    store_close_time: data?.closeTime ? dayjs(data?.closeTime,"HH:mm") : "",
    store_contact_person_name:  data ? data?.contactName ?? "" : "",
    store_contact_person_email:  data ? data?.contactEmail ?? "" :"",
    store_contact_person_phone:  data ? data?.contactPhone ?? "" : "",
    description:  data ? data?.content ?? "" : ""
  };
  function updateObjectInArray(
    array: any,
    key: string,
    id: any,
    newProperties: any
  ) {
    return array.map((item: any) => {
      if (item[key] === id) {
        return { ...item, ...newProperties };
      }
      return item;
    });
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const {
        store_name,
        store_status,
        store_open_time,
        store_close_time,
        store_contact_person_name,
        store_contact_person_email,
        store_contact_person_phone,
      } = values;
      const body: AddEditMultiStoreType = {
        ...(data && { id: data?.id }),
        title: store_name,
        content: values?.description,
        status: store_status === "open" ? "active" : "inactive",
        ownerId: ownerId,
        openTime: dayjs(store_open_time).format("HH:mm:ss"),
        closeTime: dayjs(store_close_time).format("HH:mm:ss"),
        contactName: store_contact_person_name,
        contactEmail: store_contact_person_email,
        contactPhone: store_contact_person_phone,
      };

      if (data) {
        dispatch(updateStoreAPI({ body, companyId }));
      } else {
        dispatch(addStoreAPI({ body, companyId }));
      }
    },
  });

  const {
    handleSubmit,
    handleChange,
    values,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formik;

  return (
    <>
      {isLoading && <CircularLoader />}
      <CustomPopup open={open} style={customStyle}>
        <AppointmentPopupHeader
          onClose={() => {
            dispatch(setOpenStoreModal(false));
            clearEditState(null)
          }}
        >
          <b>{data ? constantString.UPDATE_STORE :constantString.ADD_STORE}</b>
        </AppointmentPopupHeader>
        <form onSubmit={handleSubmit}>
          <div className="multi-store-drawer">
            <AppointmentTextField
              name="store_name"
              label={t("Store Name")}
              placeholder="Store Name"
              onChange={handleChange}
              value={values.store_name}
              maxLength={50}
              onBlur={handleBlur}
              error={touched.store_name && errors.store_name}
              mandatory={true}
            />

            <AppointmentSelectBox2
              name="store_status"
              options={storeStatus}
              onChange={handleChange}
              label={t(constantString.STORE_STATUS)}
              value={values.store_status}
              error={touched.store_status && errors.store_status}
              placeholder="Open"
              mandatory
            />

            <TimePicker
              ampm={false}
              value={dayjs(values?.store_open_time)}
              name="store_open_time"
              onChange={(value) => {
                setFieldValue("store_open_time", value, true);
              }}
              label={t("Store Open Time")}
              mandatory
              onBlur={handleBlur}
              error={
                touched.store_open_time &&
                errors.store_open_time &&
                errors.store_open_time
              }
            />
            <TimePicker
              ampm={false}
              value={dayjs(values?.store_close_time)}
              name="store_close_time"
              onChange={(value) => {
                setFieldValue("store_close_time", value, true);
              }}
              label={t("Store Close Time")}
              mandatory
              onBlur={handleBlur}
              error={
                touched.store_close_time &&
                errors.store_close_time &&
                errors.store_close_time
              }
              minTime={dayjs(values?.store_open_time)}
            />

            <AppointmentTextField
              name="store_contact_person_name"
              label={t("Store Contact Person Name")}
              placeholder="Store Contact Person Name"
              onChange={handleChange}
              value={values.store_contact_person_name}
              maxLength={50}
              onBlur={handleBlur}
              error={
                touched.store_contact_person_name &&
                errors.store_contact_person_name
              }
              mandatory={true}
            />
            <AppointmentTextField
              name="store_contact_person_email"
              label={t("Store Contact Person Email")}
              placeholder="Store Contact Person Email"
              onChange={handleChange}
              value={values.store_contact_person_email}
              maxLength={50}
              onBlur={handleBlur}
              error={
                touched.store_contact_person_email &&
                errors.store_contact_person_email
              }
              mandatory={true}
            />
            <AppointmentTextField
              name="store_contact_person_phone"
              label={t("Store Contact Person Phone")}
              placeholder="Store Contact Person Phone"
              onChange={handleChange}
              value={values.store_contact_person_phone}
              maxLength={50}
              onBlur={handleBlur}
              error={
                touched.store_contact_person_phone &&
                errors.store_contact_person_phone
              }
              mandatory={true}
            />
          </div>
          <div className="wrap-store-text-area">
              <TextArea
                label={t(constantString.NOTE)}
                rows={4}
                cols={50}
                placeholder="Notes"
                onChange={handleChange}
                id="description"
                name="description"
                onBlur={handleBlur}
                value={values.description}
                style={{
                  paddingLeft: "2rem",
                  paddingTop: "1.2rem",
                  paddingRight: "1rem",
                }}
                maxLength={150}
              />
            </div>
          <div className="flex-row">
            <Button variant="contained" className="contained-btn" type="submit">
              {t(constantString.SAVE)}
            </Button>
          </div>
        </form>
      </CustomPopup>
    </>
  );
};

export default AddEditStore;
