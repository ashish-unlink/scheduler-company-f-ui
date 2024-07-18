import React, { useEffect } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import {
  setAppointmentHistory,
  setCreateAppData,
} from "../../redux/appointment/slice";
import { useAppDispatch, useAppSelector } from "../../redux";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import {
  appointmentSuccessColumns,
  constantString,
} from "../../utils/constantString";
import { appointmentObject, userName } from "../../utils/general";
import { useTranslation } from "react-i18next";
import {
  selectAppointmentApiData,
  selectCreateAppData,
} from "../../redux/appointment/selector";
import dayjs from "dayjs";
import { useCountyPrice } from "../hooks/useCountyPrice";
import { Users } from "../../utils/types/responseType";
import { fetchAppointmentAPI } from "../../redux/appointment/action";
import { useCompanyData } from "../hooks/useCompanyData";

const AppointmentHistoryModal = ({ open }: { open: Users }) => {
  const dispatch = useAppDispatch();
  const appointmentData = useAppSelector(selectAppointmentApiData);
  const createAppData = useAppSelector(selectCreateAppData);
  const { t } = useTranslation();
  const { format } = useCountyPrice();
  const companyId = useCompanyData();

  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    boxShadow: 24,
    height: "100vh",
    // p: 4,
  };

  useEffect(() => {
    dispatch(
      fetchAppointmentAPI({
        companyId: companyId,
        url:`${"&clientSearch=" + open?.email}`
      })
    );
  }, []);

  useEffect(() => {
    if (appointmentData?.length > 0) {
      let temp: any = [];

      appointmentData?.forEach((item: any) => {
        const tempData = appointmentObject(item);
        temp?.push(...tempData);
      });
      dispatch(setCreateAppData(temp));
    }
  }, [appointmentData]);

  const columns: any = [
    {
      field: "startDate",
      headerName: t(constantString.DATE),
      sortable: false,
      headerClassName: "appointment-table-header analytics-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return <div>{dayjs(params?.row?.startDate).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      field: "serviceName",
      headerName: t(constantString.SERVICES),
      sortable: false,
      headerClassName: "appointment-table-header analytics-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return <div>{params?.row?.serviceName}</div>;
      },
    },
    {
      field: "employeeName",
      headerName: t(constantString.STAFF_NAME),
      sortable: false,
      headerClassName: "appointment-table-header analytics-table-header",
      flex: 1,

      renderCell: (params: any) => {
        return <div>{params?.row?.employeeName}</div>;
      },
    },
    {
      field: "price",
      headerName: `${t(appointmentSuccessColumns.PRICE)}`,
      sortable: false,
      headerClassName: "appointment-table-header analytics-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return <div className="price-align">{format(params?.row?.price)}</div>;
      },
    },
  ];

  return (
    <CustomPopup open={open ? true : false} style={customStyle}>
      <AppointmentPopupHeader
        onClose={() => {
          dispatch(setAppointmentHistory(false));
        }}
      >
        Customer History
      </AppointmentPopupHeader>
      <Box sx={{ maxWidth: "100%", maxHeight: "80vh", height: "100vh" }}>
        <DataGrid
          rows={createAppData}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter
        />
      </Box>
    </CustomPopup>
  );
};
export default AppointmentHistoryModal;
