import React, { useEffect } from "react";
import AppointmentTextField from "../appointment-popup/AppointmentTextField";
import { useAppDispatch, useAppSelector } from "../../redux";
import { useFormik } from "formik";
import { addServiceCategoryAPI } from "../../redux/service/action";
import "./commissionstyle.css";
import Button from "@mui/material/Button";
import { constantString, staffOptionsValue } from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { DataGrid, GridSlotsComponentsProps } from "@mui/x-data-grid";
import { getFormattedDate } from "../../utils/general";
import * as Yup from "yup";
import { commissionSchema } from "../../utils/validation";
import { addCommission, fetchCommissionData } from "../../redux/staff/action";
import {
  selectCommissionData,
  selectSelectedStaffDetails,
} from "../../redux/staff/selector";
import { addCommissionrequest } from "../../utils/types/requestType";

const CommissionView = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const commissionData = useAppSelector(selectCommissionData);

  const selectedStaff = useAppSelector(selectSelectedStaffDetails);

  const columns = [
    {
      field: "Date",
      headerName: t(constantString.DATE),
      sortable: false,
      headerClassName: "attendence-table-header",
      flex: 1,
      renderCell: (props: any) => {
        return <div>{getFormattedDate(props?.row?.createdAt)} </div>;
      },
    },
    {
      field: "commission",
      headerName: t(staffOptionsValue.comissions),
      sortable: false,
      headerClassName: "attendence-table-header",
      flex: 1,
      renderCell: (props: any) => {
        return (
          <div className={`employee-status `}>{props?.row?.commissionPct}%</div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(fetchCommissionData(selectedStaff?.id));
  }, []);

  const validationSchema = Yup.object({
    commission: commissionSchema(),
  });

  const initialValues = {
    commission: 1,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body: addCommissionrequest = {
        commPercentage: values?.commission,
      };
      dispatch(addCommission({ body, id: selectedStaff?.id }));
    },
  });

  const { handleSubmit, handleChange, values, handleBlur, errors, touched } =
    formik;
  return (
    <div className="commission-container">
      <form onSubmit={handleSubmit}>
        <div
          className={`commission-field-wrap ${
            errors.commission ? "set-align-center" : "set-align-end"
          }`}
        >
          <AppointmentTextField
            name="commission"
            label="Commission ( in % )"
            placeholder="20"
            onChange={handleChange}
            value={values.commission}
            onBlur={handleBlur}
            error={touched.commission && errors.commission}
          />
          <Button variant="contained" className="contained-btn" type="submit">
            {t(constantString.SAVE)}
          </Button>
        </div>
      </form>

      <div className="commssion-table-wrap">
        <Box>
          <DataGrid
            rows={commissionData ? commissionData : []}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
          />
        </Box>
      </div>
    </div>
  );
};

export default CommissionView;
