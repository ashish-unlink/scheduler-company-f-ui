import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  selectAppointmentHistory,
  selectAppointmentInvoice,
  selectSuccessedAppointmentLoading,
} from "../../redux/appointment/selector";
import Box from "@mui/material/Box";
import { userName } from "../../utils/general";
import { selectShowDownloadCsvModal } from "../../redux/report/selector";
import { selectShowSearch } from "../../redux/meta/selector";
import CircularLoader from "../../components/loading/CircularLoader";
import { useCompanyData } from "../../components/hooks/useCompanyData";
import { constantString } from "../../utils/constantString";
import { selectCustomerCount, selectCustomerData } from "../../redux/users/selector";
import { Tooltip, capitalize } from "@mui/material";
import { TbHistory } from "react-icons/tb";
import { setAppointmentHistory } from "../../redux/appointment/slice";
import AppointmentHistoryModal from "../../components/appointment-history/AppointmentHistory";
import { NavBar } from "../../components/nav-bar/NavBar";
import { Search } from "../../components/search/Search";
import { Users } from "../../utils/types/responseType";
import { fetchUserData } from "../../redux/users/action";
import { PaginationDatagrid } from "../../components/pagination-datagrid/PaginationDatagrid";

const CustomerDetails = () => {
  const { t } = useTranslation();
  const showDownloadModal = useAppSelector(selectShowDownloadCsvModal);
  const dispatch = useAppDispatch();
  const showSearch = useAppSelector(selectShowSearch);
  const isLoading = useAppSelector(selectSuccessedAppointmentLoading);
  const appointmentInvoice = useAppSelector(selectAppointmentInvoice);
  const customerDetails = useAppSelector(selectCustomerData);
  const openAppointmentHistory = useAppSelector(selectAppointmentHistory);
  const [searchUser, setSearchUser] = useState("");
  const [filterCustomer, setFilterCustomer] = useState<Users[]>([]);
  const companyId = useCompanyData();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const rowCounts = useAppSelector(selectCustomerCount);

  const columns: any = [
    {
      field: "lastName",
      headerName: t(constantString.CUSTOMER_NAME),
      sortable: false,
      headerClassName: "appointment-table-header analytics-table-header",
      flex: 1,
      id: "lastName",
      displayName: "Customer Name",
      renderCell: (params: any) => {
        return (
          <div>
            {params?.row != null
              ? userName(params?.row?.firstName, params?.row?.lastName)
              : "-"}
          </div>
        );
      },
    },
    {
      field: "customerEmail",
      headerName: t(constantString.CUSTOMER_EMAIL),
      sortable: false,
      headerClassName: "appointment-table-header analytics-table-header",
      flex: 1,
      id: "customerEmail",
      displayName: "Customer Email",
      renderCell: (params: any) => {
        return (
          <div>
            {params?.row?.email.endsWith("@dummy.com")
              ? "-"
              : params?.row?.email}
          </div>
        );
      },
    },
    {
      field: "phoneNumber",
      headerName: t(constantString.CUSTOMER_MOBILE),
      sortable: false,
      headerClassName: "appointment-table-header analytics-table-header",
      flex: 1,
      id: "phoneNumber",
      displayName: "Customer Mobile",
      renderCell: (params: any) => {
        return (
          <div>{params?.row != null ? params?.row?.phoneNumber : "-"}</div>
        );
      },
    },

    {
      field: "gender",
      headerName: `${t(constantString.CUSTOMER)} ${t(constantString.GENDER)}`,
      sortable: false,
      headerClassName: "appointment-table-header analytics-table-header",
      flex: 1,
      id: "gender",
      displayName: "Gender",
      renderCell: (params: any) => {
        return (
          <div className="price-align">
            {params?.row != null ? capitalize(params?.row?.gender) : "-"}
          </div>
        );
      },
    },
    // {
    //   field: "status",
    //   headerName: `${t(constantString.CUSTOMER)}  ${t(constantString.VERIFY)}`,
    //   sortable: false,
    //   headerClassName: "appointment-table-header analytics-table-header",
    //   flex: 1,
    //   id: "status",
    //   displayName: "Customer Verification",
    //   renderCell: (props: any) => {
    //     return (
    //       <div className={`customer-status ${props?.row?.status}`}>
    //         {props?.row?.status == "active" ? "Verified" : "Not Verify"}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "action",
      headerName: "View History",
      sortable: false,
      headerClassName: "appointment-table-header analytics-table-header",
      headerAlign: "center",
      filterable: false,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <Tooltip title="View past appointments" placement="bottom">
            <div
              className="view-action"
              onClick={() => dispatch(setAppointmentHistory(params?.row))}
            >
              <TbHistory style={{ fontSize: 24 }} />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    const paginationUrl = `&offset=${pagination?.page}&limit=${pagination?.pageSize}`;
    dispatch(fetchUserData({ companyId, paginationUrl }));
  }, []);

  useEffect(() => {
    setFilterCustomer(customerDetails);
  }, [customerDetails]);

  useEffect(() => {
    const skip = pagination.page * pagination.pageSize;
    const limit = pagination.pageSize;
    const paginationUrl = `&offset=${skip}&limit=${limit}`;

    dispatch(fetchUserData({ companyId, paginationUrl }));
  }, [pagination]);

  const onHandleSearch = (val: string) => {
    if (val?.length == 0) {
      setFilterCustomer(customerDetails);
    } else {
      const inputValueLowerCase = val.toLowerCase();
      const filteredArray = customerDetails?.filter((item: Users) => {
        const searchFields = [
          item.firstName,
          item.lastName,
          item.email,
          item.phoneNumber,
        ].join(" ");
        const searchFieldsLowerCase = searchFields.toLowerCase();
        return searchFieldsLowerCase.includes(inputValueLowerCase);
      });
      setFilterCustomer(filteredArray);
    }
    setSearchUser(val);
  };

  return (
    <div className="calender-container">
      {isLoading && <CircularLoader />}

      <NavBar
        leftPart={
          <div className="customer-details-search-navbar">
            <Search
              name="search"
              placeholder="Search Customers"
              handleOnChange={(e: any) => {
                onHandleSearch(e.target.value);
              }}
              value={searchUser}
            />
          </div>
        }
      />
      <div className="calender-table-wrap">
        <Box sx={{ maxWidth: "100%", maxHeight: "80vh", height: "100vh" }}>

          <PaginationDatagrid
            row={filterCustomer}
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
            rowCounts={rowCounts}
          />
        </Box>
      </div>

      {openAppointmentHistory && (
        <AppointmentHistoryModal open={openAppointmentHistory} />
      )}
    </div>
  );
};
export default CustomerDetails;
