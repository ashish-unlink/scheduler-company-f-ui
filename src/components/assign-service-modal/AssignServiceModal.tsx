import { useState } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../redux";
import "./assignServiceModalStyle.css";
import { useFormik, Field } from "formik";
import { selectServiceList } from "../../redux/service/selector";
import CircularLoader from "../loading/CircularLoader";
import { useTranslation } from "react-i18next";
import { constantString, errorMessages } from "../../utils/constantString";
import { setShowAssignServiceModal } from "../../redux/staff/slice";
import { MultiSelectAutoComplete } from "../user-list-dropdown";
import {
  ResponseServiceList,
  ServiceListItem,
} from "../../utils/types/responseType";
import { asignServiceToStaffApi } from "../../redux/staff/action";
import {
  selectEmployeeLoading,
  selectSelectedStaffDetails,
} from "../../redux/staff/selector";
import { setShowAlert } from "../../redux/meta/slice";
import * as Yup from "yup";
import { requiredSchema, requiredServiceSchema } from "../../utils/validation";
import Checkbox from "@mui/material/Checkbox";
import { useCompanyData } from "../hooks/useCompanyData";
import { Typography } from "@mui/material";
import translateLabel from "../hooks/translationLable";

const AssignServiceModal = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isLoading = useAppSelector(selectEmployeeLoading);
  const serviceCategoryListOptions = useAppSelector(selectServiceList);
  const selectedStaff = useAppSelector(selectSelectedStaffDetails);
  const company_id = useCompanyData();
  const [serviceListOption, setServiceListOptions] = useState<
    ServiceListItem[]
  >([]);
  const [selectAllServicesData, setSelectAllServicesData] = useState<
    ServiceListItem[]
  >([]);
  const serviceListOptions = serviceCategoryListOptions?.filter(
    (i: ResponseServiceList) => {
      return i?.svcCtlgItems?.length > 0;
    }
  );

  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    transform: "translate(-50%, -50%)",
    width: "30%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    boxShadow: 24,
    height: "100vh",
    // p: 4,
  };

  interface AssignServiceProps {
    assignService: ServiceListItem[];
    category: string;
    selectAllService: boolean;
    selectAllCategoryServices: boolean;
  }

  const initialValues: AssignServiceProps = {
    assignService: [],
    category: "",
    selectAllService: false,
    selectAllCategoryServices: false,
  };

  const validationSchema = Yup.object({
    assignService: requiredServiceSchema(),
    category: requiredSchema("Category"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.assignService?.length > 0) {
        const body = values.assignService?.map((i) => {
          return i.id;
        });
        const data = {
          empCtgyItem: body,
        };
        dispatch(
          asignServiceToStaffApi({
            body: data,
            id: selectedStaff?.id,
            companyId: company_id,
          })
        );
      } else {
        dispatch(
          setShowAlert({
            message: errorMessages?.SELECT_CATEGORY,
            type: "error",
          })
        );
      }
    },
  });

  const {
    handleSubmit,
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
        <AppointmentPopupHeader
          onClose={() => {
            dispatch(setShowAssignServiceModal(false));
          }}
        >
          <b> {translateLabel(constantString.ASSIGN_SERVICE)} </b>
        </AppointmentPopupHeader>
        <form onSubmit={handleSubmit}>
          <div className="wrap-category-select">
            <MultiSelectAutoComplete
              label={translateLabel(constantString.SELECT_CATEGORY)}
              id="category"
              placeholder="Search.."
              option={serviceListOptions}
              onChange={(e, val) => {
                handleChange(e);
                setFieldValue("category", e.target.value);
                setServiceListOptions(val?.svcCtlgItems);
                setFieldValue("selectAllService", false);
              }}
              onBlur={handleBlur}
              error={errors.category && touched.category && errors.category}
              mandatory
            />

            <div className="wraped-check-box">
              <Checkbox
                edge="start"
                name="selectAllCategoryServices"
                checked={values?.selectAllCategoryServices}
                onChange={(e) => {
                  console.log("eeee", e?.target?.checked);
                  handleChange(e);
                  if (e?.target?.checked == true) {
                    let srvdata: ServiceListItem[] = [];
                    serviceListOptions?.forEach((item: ResponseServiceList) => {
                      srvdata?.push(...item?.svcCtlgItems);
                    });
                    setFieldValue("category", srvdata[0]?.title);
                    setFieldValue("assignService", srvdata);
                  }
                }}
                tabIndex={-1}
                disableRipple

                // inputProps={{ "aria-labelledby": labelId }}
              />
              <Typography variant="body1">
              {translateLabel(constantString.SELECT_CATEGORY_WITH_SERVICE)}
               
              </Typography>
            </div>

            <div className="select-wrap">
              {serviceListOption?.length > 0 && (
                <>
                  <MultiSelectAutoComplete
                    label={translateLabel(constantString.SELECT_SERVICE)}
                    option={serviceListOption}
                    id="assignService"
                    placeholder="Search.."
                    value={selectAllServicesData}
                    // {...values?.selectAllService && {values : [selectAllServicesData]}}
                    onChange={(e, newValue) => {
                      handleChange(e);
                      setFieldValue("assignService", newValue);
                      setSelectAllServicesData(newValue);
                    }}
                    multiple={true}
                    mandatory
                    onBlur={handleBlur}
                    error={
                      errors.assignService &&
                      touched.assignService &&
                      errors.assignService
                    }
                  />

                  <div className="wraped-check-box">
                    <Checkbox
                      edge="start"
                      name="selectAllService"
                      checked={values?.selectAllService}
                      onChange={(e) => {
                        handleChange(e);
                        if (e.target.value) {
                          const temp = [
                            ...selectAllServicesData,
                            ...serviceListOption,
                          ];

                          setSelectAllServicesData(temp);
                          setFieldValue("assignService", temp);
                        }
                      }}
                      tabIndex={-1}
                      disableRipple
                    />
                    <Typography variant="body1">{translateLabel(constantString.SELECT_ALL_SERVICE)}</Typography>
                  </div>
                </>
              )}
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

export default AssignServiceModal;
