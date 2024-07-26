import React, { useMemo, useEffect, useState } from "react";
import "./style.css";
import CustomTable from "../custom-table/CustomTable";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Checkbox, Tooltip } from "@mui/material";
import MoreItems from "../more-items/MoreItems";
import { MoreActionProps } from "../more-items/type";
import store, { useAppDispatch, useAppSelector } from "../../redux";
import {
  selectAddDateStaff,
  selectAddScheduleStaff,
  selectSelectedStaffDetails,
} from "../../redux/staff/selector";
import {
  setAddDateStaff,
  setAddStaffScheduleModal,
} from "../../redux/staff/slice";
import { AddScheduleStaffModal } from "../schedule-staff/AddScheduleStaffModal";
import {
  TimeShiftProps,
  rowStaffScheduleData,
} from "../../utils/types/dataTypes";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { fetchAppointmentTimeBlockAPI } from "../../redux/appointment/action";
import { useCompanyData } from "../hooks/useCompanyData";
import { selectAppointmentFilterData } from "../../redux/appointment/selector";
import { ResopnseAppointmentBlockData } from "../../utils/types/responseType";
import {
  RequestAddEmployeeShift,
  RequestTimeShiftsProps,
} from "../../utils/types/requestType";
import { getFormattedDate } from "../../utils/general";
import {
  addEmployeeShiftSchedule,
  updateAttendenceAPI,
} from "../../redux/staff/action";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSearchParams } from "react-router-dom";
import { useCurrentWeek } from "../hooks/useCurrentWeek";
import translateLabel from "../hooks/translationLable";
import { constantString } from "../../utils/constantString";
import { setShowAlert } from "../../redux/meta/slice";
import { frontendMessages } from "../../utils/messages";
import { isTemplateMiddleOrTemplateTail } from "typescript";

export const StaffSchedule = () => {
  const showStaffScheduleModal = useAppSelector(selectAddScheduleStaff);
  const dispatch = useAppDispatch();
  const companyId = useCompanyData();
  const selectedStaff = useAppSelector(selectSelectedStaffDetails);
  const scheduleData = useAppSelector(selectAppointmentFilterData);
  const { monday, sunday } = useCurrentWeek();
  const [rowData, setRowData] = useState<any>([]);
  const [searchParams] = useSearchParams();
  const dateRangeData = searchParams?.get("dtRange");

  useEffect(() => {
    getScheduleDataList();
  }, [selectedStaff, searchParams]);

  const getScheduleDataList = () => {
    if (dateRangeData) {
      dispatch(
        fetchAppointmentTimeBlockAPI({
          companyId: companyId,
          scheduleDateRange: dateRangeData,
          employeeId: selectedStaff?.id,
        })
      );
    } else {
      dispatch(
        fetchAppointmentTimeBlockAPI({
          companyId: companyId,
          scheduleDateRange: `[${monday},${sunday}]`,
          employeeId: selectedStaff?.id,
        })
      );
    }
  };

  useEffect(() => {
    const groupedData: any = {};

    scheduleData?.forEach((obj: ResopnseAppointmentBlockData) => {
      if (!groupedData[obj.date]) {
        groupedData[obj.date] = [];
      }
      groupedData[obj.date].push({
        shiftId: obj.shiftId,
        from: obj.from,
        to: obj.to,
        id: obj.id,
      });
    });

    const result = Object.entries(groupedData).map(([date, shifts], index) => {
      return {
        id: index + 1,
        date: date,
        day: scheduleData?.find((i: ResopnseAppointmentBlockData) => {
          return i?.date == date;
        }),
        shifts: groupedData[date],
      };
    });


    setRowData(result);
  }, [scheduleData]);

  const columns = [
    {
      field: "select",
      headerName:translateLabel(constantString.SELECT),
      flex: 0.5,
      sortable: false,
      headerClassName: "table-header",
      renderCell: (params: any) => (
        <CheckboxContainer employeeData={params?.row?.day} />
      ),
    },

    {
      field: "Date",
      headerName: translateLabel(constantString.DATE),
      flex: 1,
      headerClassName: "table-header",
      renderCell: (params: any) => <p>{getFormattedDate(params?.row?.date)}</p>,
    },
    {
      field: "day",
      headerName: translateLabel(constantString.DAY),
      flex: 1,
      headerClassName: "table-header",
      renderCell: (params: any) => (
        <p>
          {params?.row?.day?.day == null
            ? params?.row?.day?.employee?.firstName
            : params?.row?.day?.day}
        </p>
      ),
    },
    {
      field: "time",
      headerName: translateLabel(constantString.TIME),
      flex: 2,
      headerClassName: "table-header",
      renderCell: (params: any) => (
        <TimePickerCell value={params?.row?.shifts} />
      ),
    },
    {
      field: "action",
      headerName: translateLabel(constantString.ACTION),
      flex: 0.5,
      sortable: false,
      headerClassName: "table-header",
      renderCell: (params: any) => <InfoIcon data={params} />,
    },
  ];

  const CheckboxContainer = ({
    employeeData,
  }: {
    employeeData: ResopnseAppointmentBlockData;
  }) => {
    // Implement your Checkbox component here
    return (
      <Checkbox
        edge="start"
        name="appointment"
        tabIndex={-1}
        checked={employeeData?.status == "leave" ? true : false}
        onChange={(e) => {
          console.log("jfjfj");
              
          const updatedAttendenceDate = rowData?.map((item: any) => {
            if (item?.day?.id == employeeData?.id) {
              console.log("iii",item);
              
              if (item?.day?.apptBkgData && item?.day?.status === "present") {
                dispatch(
                  setShowAlert({
                    message: `${frontendMessages?.LEAVE_APPLY} at ${dayjs(item?.date).format("DD-MM-YYYY")}`,
                    type: "error",
                  })
                );
              }
              const data = {
                id: item?.day?.id,
                status: e.target.checked ? "leave" : "present",
              };
              return data;
            } else {
              return {
                id: item?.day?.id,
                status: item?.day?.status,
              };
            }
          });

          const body = {
            scheduleData: updatedAttendenceDate,
          };
          dispatch(
            updateAttendenceAPI({
              body: body,
              id: companyId,
              onUpdateAttendenceSchedule: getScheduleDataList,
            })
          );
        }}
      />
    );
  };

  const TimePickerCell: React.FC<{
    value: RequestTimeShiftsProps[];
  }> = ({ value }) => {
    return (
      <div className="time-column">
        {value?.map((item: RequestTimeShiftsProps) => {
          return (
            <div className="time-item-wrap">
              <Typography variant="body1" fontWeight={500}>
                {item?.from != null
                  ? dayjs(item?.from, "HH:mm:ss").format("HH:mm")
                  : "-"}{" "}
                -{" "}
                {item?.to != null
                  ? dayjs(item?.to, "HH:mm:ss").format("HH:mm")
                  : "-"}
              </Typography>
            </div>
          );
        })}
      </div>
    );
  };

  const InfoIcon = ({ data }: { data: any }) => {
    return (
      <div className="info-icons">
        {/* update shifts */}
        <Tooltip title="Update Shift" placement="bottom">
          <EditOutlinedIcon
            onClick={() => {
              dispatch(setAddStaffScheduleModal(data?.row));
            }}
            className="icon-cursor"
          />
        </Tooltip>

        {/* copy shifts */}
        {/* <Tooltip title="Copy Shift" placement="bottom">
          <ContentCopyIcon
            onClick={() => {
              let dayArray: any = [];
              let shiftsData: any = [];

              rowData?.forEach((element: rowStaffScheduleData) => {
                dayArray.push(element?.day?.day);
                shiftsData?.push(...element?.shifts);
              });

              const body: RequestAddEmployeeShift = {
                employeeId: selectedStaff?.id,
                startDate: dayjs(monday).format("YYYY-MM-DD"),
                endDate: dayjs(sunday).format("YYYY-MM-DD"),
                shiftData: [
                  {
                    targetDays: dayArray,
                    shiftNTimeData: shiftsData?.map((i: any) => {
                      return { from: i?.from, to: i?.to, shiftId: i?.shiftId };
                    }),
                  },
                ],
              };

              dispatch(
                addEmployeeShiftSchedule({
                  body,
                  companyId: companyId,
                  dateRange: dateRangeData
                    ? dateRangeData
                    : `[${monday},${sunday}]`,
                })
              );
            }}
            className="icon-cursor"
          />
        </Tooltip> */}
      </div>
    );
  };

  const renderTable = useMemo(() => {
    return (
      <Box>
        <DataGrid rows={rowData} columns={columns} disableRowSelectionOnClick />
      </Box>
    );
  }, [rowData]);

  return (
    <div className="staff-schedule-container">
      {renderTable}
      {showStaffScheduleModal && (
        <AddScheduleStaffModal
          data={showStaffScheduleModal}
          dateRange={dateRangeData ? dateRangeData : `[${monday},${sunday}]`}
        />
      )}
    </div>
  );
};
