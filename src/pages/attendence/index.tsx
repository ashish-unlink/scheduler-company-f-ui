import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  selectAppointmentFilterData,
  selectSuccessedAppointmentLoading,
} from "../../redux/appointment/selector";
import "./attendenceStyle.css";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { DataGrid, GridSlotsComponentsProps } from "@mui/x-data-grid";
import { NavBar } from "../../components/nav-bar/NavBar";
import { DatePick } from "../../components/date-pick";
import { selectShowAttendenceModal } from "../../redux/attendence/selector";
import { setshowAttendenceModal } from "../../redux/attendence/slice";
import { selectEmployeeList } from "../../redux/staff/selector";
import { Button, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAppointmentTimeBlockAPI } from "../../redux/appointment/action";
import { getFormattedDate, userName } from "../../utils/general";
import CircularLoader from "../../components/loading/CircularLoader";
import { useCompanyData } from "../../components/hooks/useCompanyData";
import { ResopnseAppointmentBlockData } from "../../utils/types/responseType";
import { attendenceStatus } from "../../utils/primtive/status";
import { updateAttendenceAPI } from "../../redux/staff/action";
import { setShowAlert } from "../../redux/meta/slice";
import { frontendMessages } from "../../utils/messages";

export const Attendence = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const employeeList = useAppSelector(selectEmployeeList);
  const companyId = useCompanyData();
  const appointmentFilterData = useAppSelector(selectAppointmentFilterData);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const isLoading = useAppSelector(selectSuccessedAppointmentLoading);
  const [attendenceList, setAttendenceList] = useState<any>([]);
  const [attendenceRequestList, setAttendenceRequestList] = useState([]);

  useEffect(() => {
    getAttendenceData();
  }, []);

  const getAttendenceData = () => {
    dispatch(
      fetchAppointmentTimeBlockAPI({
        companyId: companyId,
        date: dayjs().format("YYYY-MM-DD"),
        // employeeId: values?.staff?.id,
      })
    );
  };

  useEffect(() => {
    var temp: any = [];
    appointmentFilterData?.forEach((i: ResopnseAppointmentBlockData) => {
      if (i?.employee?.status == "active") {
        const data = {
          id: i?.id,
          firstName: i?.employee?.firstName,
          lastName: i?.employee?.lastName,
          attendenceDate: dayjs(i?.date),
          status: i?.status == "leave" ? true : false,
          apptBkgData: i?.apptBkgData,
        };
        temp?.push(data);
      }
    });

    setAttendenceList(temp);
  }, [appointmentFilterData]);

  const columns = [
    {
      field: "employeeName",
      headerName: t(constantString.EMPLOYEE_NAME),
      sortable: false,
      headerClassName: "attendence-table-header",
      cellClassName: "attendence-table-cell",
      flex: 1,
      renderCell: (props: any) => {
        return (
          <div>{userName(props?.row?.firstName, props?.row?.lastName)}</div>
        );
      },
    },
    {
      field: "Date",
      headerName: t(constantString.DATE),
      sortable: false,
      headerClassName: "attendence-table-header",
      flex: 1,
      renderCell: (props: any) => {
        return <div>{getFormattedDate(props?.row?.attendenceDate)}</div>;
      },
    },
    {
      field: "status",
      headerName: t(constantString.STATUS),
      sortable: false,
      headerClassName: "attendence-table-header",
      flex: 1,
      renderCell: (props: any) => {
        return (
          <div
            className={`employee-status ${
              props?.row?.status ? "leave" : "present"
            }`}
          >
            {props?.row?.status
              ? attendenceStatus["leave"]
              : attendenceStatus["present"]}
          </div>
        );
      },
    },
    {
      field: "leave",
      headerName: t(constantString.LEAVE),
      sortable: false,
      headerClassName: "attendence-table-header",
      flex: 1,
      renderCell: (props: any) => {
        return (
          <div className="employee-status">
            <Checkbox
              edge="end"
              name="categoryEnableForAppointment"
              checked={props?.row?.status}
              onChange={(e) => {
                let updatedShowData: any = [];
                const updatedDate = attendenceList?.map((item: any) => {
                  if (item?.id == props?.row?.id) {
                    if (item?.apptBkgData && !item?.status) {
                      dispatch(
                        setShowAlert({
                          message: `${frontendMessages?.LEAVE_APPLY} at ${dayjs(item?.attendenceDate).format("DD-MM-YYYY")}`,
                          type: "error",
                        })
                      );
                    }
                    updatedShowData.push({
                      ...item,
                      status: e.target.checked,
                    });
                    const data = {
                      id: item?.id,
                      status: e.target.checked ? "leave" : "present",
                    };
                    return data;
                  } else {
                    updatedShowData.push(item);
                  }
                  return {
                    id: item?.id,
                    status: item?.status ? "leave" : "present",
                  };
                });

                setAttendenceRequestList(updatedDate);
                setAttendenceList(updatedShowData);
              }}
              tabIndex={-1}
              disableRipple
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="calender-container">
      {isLoading && <CircularLoader />}
      <NavBar
        leftPart={
          <div className="customer-details-left-navbar">
            <DatePick
              name="date"
              placeholder="Date"
              onChange={(val: any) => {
                setSelectedDate(val);
                dispatch(
                  fetchAppointmentTimeBlockAPI({
                    companyId: companyId,
                    date: dayjs(val)?.format("YYYY-MM-DD"),
                  })
                );
              }}
              value={selectedDate}
              disableFuture
            />
          </div>
        }
        rightPart={
          <div className="save-attendence-div-button">
            <Button
              variant="contained"
              className="save-attendence-btn"
              type="submit"
              onClick={() => {
                const body = {
                  scheduleData: attendenceRequestList,
                };
                dispatch(
                  updateAttendenceAPI({
                    body: body,
                    id: companyId,
                    onUpdateAttendenceSchedule: getAttendenceData,
                  })
                );
                setSelectedDate(dayjs());
              }}
            >
              {t(constantString.SAVE)}
            </Button>
          </div>
        }
      />
      <div className="calender-table-wrap">
        <Box sx={{ maxWidth: "100%", height: "calc(100vh - 200px)" }}>
          <DataGrid
            rows={attendenceList}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
          />
        </Box>
      </div>
    </div>
  );
};
