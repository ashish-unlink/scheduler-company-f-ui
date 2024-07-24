import react from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import AppointmentTextField from "../appointment-popup/AppointmentTextField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../redux";
import { requiredSchema } from "../../utils/validation";
import { Button } from "@mui/material";
import "./searchPopupStyle.css";
import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import { DatePick } from "../date-pick";
import CircularLoader from "../loading/CircularLoader";
import { setFilterData, setShowSearch } from "../../redux/meta/slice";
import Typography from "@mui/material/Typography";
import { MobilePhoneInput } from "../mobile-input/MobileInput";
import dayjs from "dayjs";
import { fetchAppointmentAPI } from "../../redux/appointment/action";
import { useNavigate } from "react-router-dom";
import { status } from "../custom-scheduler/data";
import AppointmentSelectBox2 from "../appointment-popup/AppointmentSelectBox2";
import { GroupSelect } from "../group-select/GroupSelect";
import { ServiceListItem } from "../../utils/types/responseType";
import { selectServiceList } from "../../redux/service/selector";
import { selectFilterData } from "../../redux/meta/selector";
import { useCompanyData } from "../hooks/useCompanyData";

const SearchPopup = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const companyId = useCompanyData();
  const serviceListOptions = useAppSelector(selectServiceList);
  const filterData = useAppSelector(selectFilterData);

  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0%",
    width: "60%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    boxShadow: 24,
    height: "100vh",
    outline: 0,
  };

  const initialValues = {
    customerFirstName: filterData?.customerFirstName ?? "",
    customerLastName: filterData?.customerLastName ?? "",
    customerEmail: filterData?.customerEmail ?? "",
    customerMobile: filterData?.customerMobile ?? "",
    staffFirstName: filterData?.staffFirstName ?? "",
    staffLastName: filterData?.staffLastName ?? "",
    staffEmail: filterData?.staffEmail ?? "",
    staffMobile: filterData?.staffMobile ?? "",
    services: filterData?.services ?? "",
    // category: filterData?.category ?? "",
    startDate: filterData?.startDate ?? "",
    endDate: filterData?.endDate ?? "",
    // appointmentId: filterData?.appointmentId ?? "",
    status: filterData?.status ?? "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const url = `${
        values?.customerFirstName != ""
          ? "&clientFirstName=" + values?.customerFirstName
          : ""
      }${
        values?.customerLastName != ""
          ? "&clientLastName=" + values?.customerLastName
          : ""
      }${
        values?.customerEmail != ""
          ? "&clientEmail=" + values?.customerEmail
          : ""
      }${
        values?.customerMobile != ""
          ? "&clientPhoneNo=" + values?.customerMobile
          : ""
      }${
        values?.staffLastName != ""
          ? "&emplyLastName=" + values?.staffLastName
          : ""
      }${
        values?.staffFirstName != ""
          ? "&emplyFirstName=" + values?.staffFirstName
          : ""
      }${values?.staffEmail != "" ? "&emplyEmail=" + values?.staffEmail : ""}${
        values?.staffMobile != "" ? "&emplyPhoneNo=" + values?.staffMobile : ""
      }${values?.services != "" ? "&serviceName=" + values?.services : ""}${
        values?.status != "all" ? "&status=" + values?.status: ""
      }${
        values?.startDate != "" && values?.endDate != ""
          ? "&appointmentDateRange=" +
            [
              dayjs(values?.startDate).format("YYYY-MM-DD"),
              dayjs(values?.endDate).format("YYYY-MM-DD"),
            ]
          : ""
      }
      `;

      dispatch(setFilterData(values));

      dispatch(
        fetchAppointmentAPI({
          companyId: companyId,
          appointmentDate:
            values?.startDate != "" && values?.endDate == ""
              ? dayjs(values?.startDate).format("YYYY-MM-DD")
              : "",
          url: url,
          navigate: navigate,
        })
      );
    },
  });

  const handleResetForm = () => {
    dispatch(setFilterData({}));
    formik.resetForm({ values: initialValues });
  };

  const {
    handleSubmit,
    handleReset,
    handleChange,
    values,
    handleBlur,
    setFieldValue,
    resetForm,
    errors,
    touched,
  } = formik;

  return (
    <>
      {/* {isLoading && <CircularLoader />} */}
      <CustomPopup open={open} style={customStyle}>
        <AppointmentPopupHeader
          onClose={() => {
            dispatch(setShowSearch(false));
          }}
        >
          <b>{t(constantString.ADVANCED_FILTER)}</b>
        </AppointmentPopupHeader>
        <form onSubmit={handleSubmit}>
          <div className="search-wrap">
            <p className="search-form-label-text">Appointment</p>

            <div className="wrap-search-field">
              {/* <div className="search-input-wrap">
                <AppointmentTextField
                  name="appointmentId"
                  label="Appointment Id"
                  placeholder="Appointment Id"
                  onChange={handleChange}
                  value={values.appointmentId}
                  onBlur={handleBlur}
                  error={touched.appointmentId && errors.appointmentId}
                />
              </div> */}
              <div className="search-input-wrap">
                <AppointmentSelectBox2
                  name="status"
                  label="Status"
                  options={status}
                  placeholder="Status"
                  onChange={handleChange}
                  value={values?.status}
                  error={touched.status && errors.status}
                />
              </div>

              <div className="search-input-wrap">
                <DatePick
                  name="startDate"
                  label="Start Date"
                  placeholder="Start Date"
                  onChange={(e: any) => {
                    setFieldValue("startDate", e, true);
                  }}
                  value={dayjs(values.startDate)}
                  onBlur={handleBlur}
                  error={touched.startDate && errors.startDate}
                />
              </div>
              <div className="search-input-wrap">
                <DatePick
                  name="endDate"
                  label="End Date"
                  placeholder="End Date"
                  onChange={(e: any) => {
                    setFieldValue("endDate", e, true);
                  }}
                  minDate={dayjs(values.startDate)}
                  value={dayjs(values.endDate)}
                  onBlur={handleBlur}
                  error={touched.endDate && errors.endDate}
                />
              </div>
            </div>

            <p className="search-form-label-text">
              {t(constantString.CUSTOMER)}
            </p>

            <div className="wrap-search-field">
              <div className="search-input-wrap">
                <AppointmentTextField
                  name="customerFirstName"
                  label="First Name"
                  placeholder="First Name"
                  onChange={handleChange}
                  value={values.customerFirstName}
                  onBlur={handleBlur}
                  error={touched.customerFirstName && errors.customerFirstName}
                />
              </div>
              <div className="search-input-wrap">
                <AppointmentTextField
                  name="customerLastName"
                  label="Last Name"
                  placeholder="Last Name "
                  onChange={handleChange}
                  value={values.customerLastName}
                  onBlur={handleBlur}
                  error={touched.customerLastName && errors.customerLastName}
                />
              </div>
              <div className="search-input-wrap">
                <AppointmentTextField
                  name="customerEmail"
                  label="Email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={values.customerEmail}
                  onBlur={handleBlur}
                  maxLength={50}
                  error={touched.customerEmail && errors.customerEmail}
                />
              </div>
              <div className="search-input-wrap">
                <MobilePhoneInput
                  name="customerMobile"
                  label="Mobile"
                  placeholder="Mobile"
                  onChange={(val: string) => {
                    setFieldValue("customerMobile", val, true);
                  }}
                  value={values.customerMobile}
                  error={touched.customerMobile && errors.customerMobile}
                />
              </div>
            </div>

            <p className="search-form-label-text">Staff</p>

            <div className="wrap-search-field">
              <div className="search-input-wrap">
                <AppointmentTextField
                  name="staffFirstName"
                  label="First Name"
                  placeholder=" First Name"
                  onChange={handleChange}
                  value={values.staffFirstName}
                  onBlur={handleBlur}
                  error={touched.staffFirstName && errors.staffFirstName}
                />
              </div>
              <div className="search-input-wrap">
                <AppointmentTextField
                  name="staffLastName"
                  label="Last Name"
                  placeholder="Last Name"
                  onChange={handleChange}
                  value={values.staffLastName}
                  onBlur={handleBlur}
                  error={touched.staffLastName && errors.staffLastName}
                />
              </div>
              <div className="search-input-wrap">
                <AppointmentTextField
                  name="staffEmail"
                  label="Email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={values.staffEmail}
                  onBlur={handleBlur}
                  maxLength={50}
                  error={touched.staffEmail && errors.staffEmail}
                />
              </div>
              <div className="search-input-wrap">
                <MobilePhoneInput
                  name="staffMobile"
                  label="Mobile"
                  placeholder="Mobile"
                  onChange={(val: string) => {
                    setFieldValue("staffMobile", val, true);
                  }}
                  value={values.staffMobile}
                  error={touched.staffMobile && errors.staffMobile}
                />
              </div>
            </div>

            <p className="search-form-label-text">Services</p>

            <div className="wrap-search-field">
              <div className="search-input-wrap">
                <GroupSelect
                  name="services"
                  onChange={(e: any, val: ServiceListItem) => {
                    handleChange(e);
                    setFieldValue("services", val?.title);
                  }}
                  value={values?.services}
                  options={serviceListOptions}
                  label="Select Service"
                  placeholder="Select"
                />
              </div>
            </div>

            <div className="search-btn-div">
              <Button
                variant="contained"
                className="contained-btn"
                type="submit"
              >
                Search
              </Button>
              <Button
                variant="contained"
                className="contained-btn reset-search-btn"
                onClick={(e) => {
                  handleResetForm();
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </CustomPopup>
    </>
  );
};

export default SearchPopup;
