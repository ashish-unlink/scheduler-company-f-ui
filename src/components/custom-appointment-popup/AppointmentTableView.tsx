import React from "react";
import CustomTable from "../custom-table/CustomTable";
import { GridColDef } from "@mui/x-data-grid";
import { setShowAppointmentDeleteModal } from "../../redux/appointment/slice";
import { DeleteOutline } from "@mui/icons-material";
import convertMinutesToHoursAndMinutes from "../hooks/convertMinutesToHoursAndMinutes";
import { useAppDispatch, useAppSelector } from "../../redux";
import { selectAppointmentData } from "../../redux/appointment/selector";
import { useCountyPrice } from "../hooks/useCountyPrice";
import translateLabel from "../hooks/translationLable";
import { appointmentSuccessColumns, constantString } from "../../utils/constantString";

export const AppointmentTableView = () => {
  const dispatch = useAppDispatch();
  const { format } = useCountyPrice();
  const appointmentData = useAppSelector(selectAppointmentData);

  const schema: GridColDef[] = [
    {
      field: "services",
      headerName: translateLabel(constantString.SERVICE_NAME),
      minWidth: 180,
      // maxWidth:220,
      sortable: true,
      flex: 1,
      headerClassName: "custom-table-header",
      renderCell: (props) => {
        return <div>{props.row.services}</div>;
      },
    },
    {
      field: "startTime",
      headerName:translateLabel(appointmentSuccessColumns.START_TIME),
      // minWidth: 100,
      // maxWidth:150,
      sortable: true,
      flex: 1,
      headerClassName: "custom-table-header",
      renderCell: (props) => {
        return <div>{props.row?.startTime}</div>;
      },
    },
    {
      field: "endTime",
      headerName:translateLabel(appointmentSuccessColumns.END_TIME),
      // minWidth: 100,
      // maxWidth:120,
      sortable: true,
      flex: 1,
      headerClassName: "custom-table-header",
      renderCell: (props) => {
        return <div>{props.row?.endTime}</div>;
      },
    },
    {
      field: "time",
      headerName: translateLabel(constantString.REQUIRED_TIME),
      // minWidth: 100,
      // maxWidth:150,
      sortable: true,
      flex: 1,
      headerClassName: "custom-table-header",
      renderCell: (props) => {
        return (
          <div>{convertMinutesToHoursAndMinutes(props.row.serviceTime)}</div>
        );
      },
    },
    {
      field: "staff",
      headerName: translateLabel(appointmentSuccessColumns.STAFF),
      minWidth: 220,
      flex: 1,
      headerClassName: "custom-table-header",
      renderCell: (props) => {
        return <div>{props.row.staff}</div>;
      },
    },
    {
      field: "price",
      headerName: translateLabel(appointmentSuccessColumns.PRICE),
      // maxWidth: 120,
      sortable: true,
      flex: 1,
      headerClassName: "custom-table-header",
      renderCell: (props) => {
        return <>{format(props.row?.price)}</>;
      },
    },
    {
      field: "action",
      headerName: translateLabel(constantString.ACTION),
      maxWidth: 90,
      flex: 1,
      headerClassName: "custom-table-header",
      renderCell: (params) => {
        return (
          <>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setShowAppointmentDeleteModal(params.row));
              }}
            >
              <DeleteOutline />
            </button>
          </>
        );
      },
    },
  ];

  return <CustomTable columns={schema} rows={appointmentData} />;
};
