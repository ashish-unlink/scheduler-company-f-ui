import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  selectAppointmentApiData,
  selectAppointmentRowCounts,
  selectCreateAppData,
  selectSuccessedAppointmentLoading,
} from "../../redux/appointment/selector";
import "./report.css";
import {
  appointmentObject,
  getFormattedDate,
  userName,
} from "../../utils/general";
import {
  setAppointmentInvoice,
  setCreateAppData,
} from "../../redux/appointment/slice";
import dayjs from "dayjs";
import { NavBar } from "../../components/nav-bar/NavBar";
import { useCountyPrice } from "../../components/hooks/useCountyPrice";
import { DatePick } from "../../components/date-pick";
import { fetchAppointmentAPI } from "../../redux/appointment/action";
import CircularLoader from "../../components/loading/CircularLoader";
import { useCompanyData } from "../../components/hooks/useCompanyData";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import CsvDownloader from "react-csv-downloader";
import { AppointmentListProps } from "../../utils/types/dataTypes";
import { Search } from "../../components/search/Search";
import { useCurrentMonth } from "../../components/hooks/useCurrentMonth";
import { useCurrentWeek } from "../../components/hooks/useCurrentWeek";
import { useCurrentYear } from "../../components/hooks/useCurrentYear";
import { useFormik } from "formik";
import {
  appointmentSuccessColumns,
  constantString,
} from "../../utils/constantString";
import { appointmentStatus } from "../../utils/primtive/status";
import { LuEye } from "react-icons/lu";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import { FaFileDownload } from "react-icons/fa";
import { CurrentAppProps } from "../../pages/analytic-report/type";
import { PaginationDatagrid } from "../pagination-datagrid/PaginationDatagrid";
import translateLabel from "../hooks/translationLable";

export const SalesByCustomerReport = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { format } = useCountyPrice();
  const companyId = useCompanyData();
  const isLoading = useAppSelector(selectSuccessedAppointmentLoading);
  // const [selectedDate, setSelectedDate] = useState(dayjs());
  const allAppointmentData = useAppSelector(selectAppointmentApiData);
  const [viewAppointmentData, setViewAppointmentData] = useState([]);
  const appointmentData = useAppSelector(selectCreateAppData);
  const [searchUser, setSearchUser] = useState("");
  const { currentMonthStartDate, currentMonthEndDate } = useCurrentMonth();
  const { monday, sunday } = useCurrentWeek();
  const { currentYearStartDate, currentYearEndDate } = useCurrentYear();
  const [selectedButtonGroup, setSelectedButtonGroup] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const rowCounts = useAppSelector(selectAppointmentRowCounts);

  const durationOptions: CurrentAppProps[] = [
    { label: translateLabel(constantString.ALL), value: "all" },
    {
      label: translateLabel(constantString.THIS_WEEK),
      value: `${monday},${sunday}`,
    },
    {
      label: translateLabel(constantString.THIS_MONTH),
      value: `${currentMonthStartDate},${currentMonthEndDate}`,
    },
    {
      label: translateLabel(constantString.THIS_YEAR),
      value: `${currentYearStartDate},${currentYearEndDate}`,
    },
  ];

  const columns: any = [
    {
      field: "client",
      headerName: t(constantString.CUSTOMER_NAME),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      id: "clientName",
      displayName: "Customer Name",
      renderCell: (params: any) => {
        return <div>{params?.row?.clientName}</div>;
      },
    },
    {
      field: "customerEmail",
      headerName: t(constantString.CUSTOMER_EMAIL),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      id: "clientEmail",
      displayName: "Customer Email",
      renderCell: (params: any) => {
        return <div>{params?.row?.clientEmail}</div>;
      },
    },
    {
      field: "phoneNumber",
      headerName: t(constantString.CUSTOMER_MOBILE),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      id: "clientPhoneNumber",
      displayName: "Customer Mobile",
      renderCell: (params: any) => {
        return <div>{params?.row?.clientPhoneNumber}</div>;
      },
    },

    {
      field: "serviceName",
      headerName: t(constantString.SERVICE_NAME),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      id: "serviceName",
      displayName: "Service Name",
      renderCell: (params: any) => {
        return <div>{params?.row?.serviceName}</div>;
      },
    },

    {
      field: "employeeName",
      headerName: t(constantString.EMPLOYEE_NAME),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      id: "employeeName",
      displayName: "Employee Name",
      renderCell: (params: any) => {
        return <div>{params?.row?.employeeName}</div>;
      },
    },

    {
      field: "startDate",
      headerName: t(constantString.DATE),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      id: "startDate",
      displayName: "Date",
      renderCell: (params: any) => {
        return (
          <div>
            {getFormattedDate(
              dayjs(params?.row?.startDate).format("YYYY-MM-DD")
            )}
          </div>
        );
      },
    },
    {
      field: "time",
      headerName: t(appointmentSuccessColumns?.TIME),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      id: "time",
      displayName: "Time",
      renderCell: (params: any) => {
        return <div>{params?.row?.time}</div>;
      },
    },
    {
      field: "status",
      headerName: t(constantString.STATUS),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      id: "status",
      displayName: "Application Status",
      renderCell: (props: any) => {
        return (
          <div className={`customer-status ${props?.row?.status}`}>
            {/* {camelCaseToSpaceCase(props?.row?.status)} */}
            {appointmentStatus[props?.row?.status]}
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: t(constantString.AMOUNT),
      type: "number",
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      id: "price",
      displayName: "Amount",
      renderCell: (params: any) => {
        return <div className="price-align">{format(params?.row?.price)}</div>;
      },
    },
    {
      field: "action",
      headerName: t(constantString.ACTION),
      sortable: false,
      headerClassName: "appointment-table-header",
      headerAlign: "center",
      filterable: false,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <div className="view-icon-wrap">
            <Tooltip title="View Appointment" placement="bottom">
              <div
                className="view-action"
                onClick={() => dispatch(setAppointmentInvoice(params?.row))}
              >
                <LuEye />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const paginationUrl = `&offset=${pagination.page}&limit=${pagination.pageSize}`;
    getAppointmentAPIData({ paginationUrl });
  }, []);

  useEffect(() => {
    const skip = pagination.page * pagination.pageSize;
    const limit = pagination.pageSize;
    const paginationUrl = `&offset=${skip}&limit=${limit}`;
    const appDaterange =
      values?.filterDate != ""
        ? [
            dayjs(values?.filterDate).format("YYYY-MM-DD"),
            values?.filterToDate
              ? dayjs(values?.filterToDate).format("YYYY-MM-DD")
              : dayjs(values?.filterDate).format("YYYY-MM-DD"),
          ]
        : selectedButtonGroup > 0
        ? [durationOptions[selectedButtonGroup].value]
        : [];

    getAppointmentAPIData({
      paginationUrl,
      ...(appDaterange?.length > 0 && {
        appointmentDateRange: appDaterange,
      }),
      ...(searchUser != "" && { url: `&clientSearch=${searchUser}` }),
    });
  }, [pagination]);

  const getAppointmentAPIData = ({
    appointmentDate,
    url,
    paginationUrl,
    appointmentDateRange,
  }: {
    appointmentDate?: string;
    url?: string;
    paginationUrl?: string;
    appointmentDateRange?: string[];
  }) => {
    dispatch(
      fetchAppointmentAPI({
        companyId: companyId,
        ...(appointmentDate && { appointmentDate }),
        ...(url && { url }),
        ...(paginationUrl && { pagination: paginationUrl }),
        ...(appointmentDateRange && { appointmentDateRange }),
      })
    );
  };

  useEffect(() => {
    if (allAppointmentData?.length > 0) {
      let temp: any = [];
      allAppointmentData?.forEach((item: any) => {
        const tempData = appointmentObject(item);
        temp?.push(...tempData);
      });
      dispatch(setCreateAppData(temp));
    } else {
      dispatch(setCreateAppData([]));
    }
  }, [allAppointmentData]);

  useEffect(() => {
    if (appointmentData) {
      const temp = appointmentData?.map((item: AppointmentListProps) => {
        return {
          ...item,
          clientName: userName(item?.client?.firstName, item?.client?.lastName),
          clientEmail: item?.client?.email,
          clientPhoneNumber: item?.client?.phoneNumber,
          employeeName: item?.employeeName,
          time: `${dayjs(item?.startDate).format("hh:mm")} - ${dayjs(
            item?.endDate
          ).format("hh:mm")}`,
        };
      });
      setViewAppointmentData(temp);
    }
  }, [appointmentData]);

  const initialValues = {
    filterDate: "",
    filterToDate: "",
    searchFilter: "",
    url: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      const paginationUrl = `&offset=${0}&limit=${pagination.pageSize}`;
      dispatch(
        fetchAppointmentAPI({
          companyId: companyId,
          url: values?.url,
          ...(values?.filterDate != "" && {
            appointmentDateRange: [
              dayjs(values?.filterDate).format("YYYY-MM-DD"),
              values?.filterToDate
                ? dayjs(values?.filterToDate).format("YYYY-MM-DD")
                : dayjs(values?.filterDate).format("YYYY-MM-DD"),
            ],
          }),
          pagination: paginationUrl,
        })
      );
      setPagination({ page: 0, pageSize: pagination.pageSize });
    },
  });

  const onSelectCurrentApp = (item: CurrentAppProps) => {
    const paginationUrl = `&offset=${pagination.page}&limit=${pagination.pageSize}`;
    if (item?.value == "all") {
      getAppointmentAPIData({ paginationUrl });
    } else {
      getAppointmentAPIData({
        paginationUrl,
        appointmentDateRange: [item?.value],
      });
    }
    setSearchUser("");
    setFieldValue("filterDate", "");
    setFieldValue("filterToDate", "");
  };

  const { handleSubmit, values, setFieldValue } = formik;

  return (
    <div className="report-container">
      {isLoading && <CircularLoader />}

      <NavBar
        leftPart={
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled button group"
            style={{ width: "36%" }}
          >
            {durationOptions?.map((item, index) => {
              return (
                <Button
                  className={
                    selectedButtonGroup == index ? "activ-btn-group" : ""
                  }
                  onClick={() => {
                    onSelectCurrentApp(item);
                    setSelectedButtonGroup(index);
                    setSearchUser("");
                  }}
                >
                  {item?.label}
                </Button>
              );
            })}
          </ButtonGroup>
        }
        rightPart={
          <div className="wrap-nav-filters-items">
            <div className="left-container-wrap">
              <form className="form-design" onSubmit={handleSubmit}>
                <div
                  className={`date-picker-range-container  date-picker-width
                `}
                >
                  <DatePick
                    name="filterDate"
                    placeholder="Date"
                    label={translateLabel(constantString.FROM)}
                    onChange={(e: any) => {
                      setFieldValue("filterDate", e, true);
                      setSelectedButtonGroup(-1);
                    }}
                    value={values?.filterDate}
                  />
                  <div>-</div>
                  <DatePick
                    name="filterToDate"
                    placeholder="Date"
                    label={translateLabel(constantString.TO)}
                    onChange={(e: any) => {
                      setFieldValue("filterToDate", e, true);
                      setSelectedButtonGroup(-1);
                    }}
                    minDate={dayjs(values?.filterDate)}
                    value={values?.filterToDate}
                  />
                </div>
                <div className="search-field-wrap">
                  <div className="search-by-staff select-by-customer">
                    <label className="appointment-input-label">
                    {translateLabel(constantString.SELECT_CUSTOMER)}
                    </label>
                    <Search
                      name="search"
                      placeholder="Search Customer"
                      handleOnChange={(e: any) => {
                        setSearchUser(e.target.value);
                        setSelectedButtonGroup(-1);
                        const value = `${"&clientSearch=" + e.target.value}`;
                        formik.setFieldValue("url", value);
                      }}
                      value={searchUser}
                    />
                  </div>
                </div>

                <button className="search-filter-btn" type="submit">
                {translateLabel(constantString.SEARCH)}
                </button>
              </form>
            </div>

            <button className="download-csv-btn">
              <CsvDownloader
                filename={`appointimize-report-${dayjs().format("DD-MM-YYYY")}`}
                extension=".csv"
                className="download-btn"
                columns={columns?.filter((i: any) => {
                  return i?.headerName != "Action";
                })}
                datas={viewAppointmentData}
              >
                <Tooltip title="Download" placement="bottom">
                  <div>
                    <FaFileDownload fontSize={34} color="#5345a1 " />
                  </div>
                </Tooltip>
              </CsvDownloader>
            </button>
          </div>
        }
      />

      <div className="calender-table-wrap">
        <Box sx={{ maxWidth: "100%", height: "calc(100vh - 250px)" }}>
          <PaginationDatagrid
            row={viewAppointmentData?.length > 0 ? viewAppointmentData : []}
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
            rowCounts={rowCounts}
          />
        </Box>
      </div>
    </div>
  );
};
