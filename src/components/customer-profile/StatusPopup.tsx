import React from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import { Box } from "@mui/material";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import "../../components/customer-profile/statusStyle.css";
import { DataGrid } from "@mui/x-data-grid";
import { AppStatusProps } from "../../utils/types/responseType";

const StatusPopup = ({
  open,
  onClose,
  status,
}: {
  open: boolean;
  onClose: () => void;
  status: AppStatusProps[];
}) => {
  const customStyle = {
    position: "absolute",
    top: "10vh",
    left: "28%",
    width: "47%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "1rem",
    boxShadow: 24,
    // height: "500px",
    outline: 0,
    padding: "0px 0px 0px 0px",
  };

  const columns = [
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      headerClassName: "appointment-table-header",
      flex:1,
      id: "title",
      displayName: "Status",
      renderCell: (props: any) => {
        return <div>{props?.row?.status}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Created by Update",
      sortable: false,
      headerClassName: "appointment-table-header",
      flex:1,
      id: "name",
      displayName: "Updated By",
      renderCell: (props: any) => {
        return <div>{props?.row?.status}</div>;
      },
    },

    {
      field: "updatedAt",
      headerName: "Update at",
      sortable: false,
      date: "date",
      headerClassName: "appointment-table-header",
      flex:1,
      id: "status",
      displayName: "Updated at",
      renderCell: (props: any) => {
        return <div>{}</div>;
      },
    },
  ];
  return (
    <>
      <CustomPopup open={open} style={customStyle}>
        <AppointmentPopupHeader onClose={onClose}>
          View Appointment Status
        </AppointmentPopupHeader>
        <div className="calender-table-wrap-Status">
          <Box sx={{ maxWidth: "100%" }}>
            <DataGrid
              rows={status}
              columns={columns}
              hideFooter
              sx={{
                overflowX: "scroll",
                width: "100%",
                textAlign: "center",
                "&:MuiDataGrid-columnHeadersInner": {
                  width: "100%",
                },
              }}
            />
          </Box>
        </div>
      </CustomPopup>
    </>
  );
};

export default StatusPopup;
