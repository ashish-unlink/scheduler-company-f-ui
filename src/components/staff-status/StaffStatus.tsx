import React, { useState, useEffect } from "react";
import "./staffStatusStyle.css";
import { UserListDropDown } from "../user-list-dropdown";
import AppointmentSelectBox from "../appointment-popup/AppointmentSelectBox";
import AppointmentSelectBox2 from "../appointment-popup/AppointmentSelectBox2";
import { List, ListItem, Typography, ListItemButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux";
import { selectEmployeeList, selectSelectedStaffDetails } from "../../redux/staff/selector";
import { UserStaffs, Users } from "../../utils/types/responseType";
import { useTranslation } from "react-i18next";
import { constantString } from "../../utils/constantString";
import { Search } from "../search/Search";
import { setSelectedStaffDetail } from "../../redux/staff/slice";
import { fetchEmployeeServiceRelationData } from "../../redux/staff/action";
import { useCompanyData } from "../hooks/useCompanyData";
import { userName } from "../../utils/general";

export const StaffStatus = () => {
  const [filterEmployeeList, setFilterEmployee] = useState<UserStaffs[]>([]);
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const company_id = useCompanyData();
  const dispatch = useAppDispatch();

  const employeeListData = useAppSelector(selectEmployeeList);
  const selectedStaff = useAppSelector(selectSelectedStaffDetails);

  

  useEffect(() => {
    setFilter("all");
    setFilterEmployee(employeeListData);
  }, [employeeListData]);

  const onHandleSearch = (val: string) => {
    if (val?.length == 0) {
      setFilter("all");
      setFilterEmployee(employeeListData);
    } else {
      const inputValueLowerCase = val.toLowerCase();
      const filteredArray = employeeListData?.filter((item: UserStaffs) => {
        const searchFields = [
          item.firstName,
          item.lastName,
          item.email,
          item.phoneNumber,
          // item. title,
          // item.catagery,
        ].join(" ");
        const searchFieldsLowerCase = searchFields.toLowerCase();
        return searchFieldsLowerCase.includes(inputValueLowerCase);
      });
      setFilter("all");
      setFilterEmployee(filteredArray);
    }
    setSearchUser(val);
  };

  return (
    <div className="employee-status-wrap">
      <Search
        name="search"
        placeholder="Search Team Members"
        handleOnChange={(e) => {
          onHandleSearch(e.target.value);
        }}
        value={searchUser}
      />

      <div className="filter-wrap">
        <AppointmentSelectBox2
          name="filter_staff"
          defaultValue="all"
          onChange={(e: any) => {
            setFilter(e.target.value);
            if (e.target.value == "all") {
              setFilterEmployee(employeeListData);
            } else {
              let filterData = employeeListData?.filter(
                (i: UserStaffs) => i.status == e.target.value
              );
              setFilterEmployee(filterData);
            }
            setSearchUser("");
          }}
          placeholder="Select Service"
          value={filter}
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          error=""
        />
      </div>

      <div className="employee-status-list-wrap">
        <List
          sx={{
            width: "100%",
            "& .MuiAccordionDetails-root": {
              marginTop: "0px !important",
            },
          }}
          className="staff-status-list"
        >
          <ListItem disablePadding>
            <ListItemButton
              role={undefined}
              dense
              className="staff-status-list-item head"
            >
              <div className="staff-item-text-wrap">
                <p className="staff-text-head">{t(constantString.NAME)}</p>
              </div>
              <div className="staff-item-text-wrap">
                <p className="staff-text-head">{t(constantString.STATUS)} </p>
              </div>
            </ListItemButton>
          </ListItem>
          {filterEmployeeList?.length > 0 ? (
            filterEmployeeList?.map((item: UserStaffs, index) => {
              return (
                <ListItem
                  key={`item-${index}`}
                  disablePadding
                  onClick={() => {
                    setFilter(item?.status);
                    dispatch(setSelectedStaffDetail(item));
                    dispatch(fetchEmployeeServiceRelationData({companyId:company_id, employeeId:item?.id}))
                  }}
                  className={selectedStaff?.id == item?.id ? "seletected-user" : ''}
                >
                  <ListItemButton
                    role={undefined}
                    dense
                    className="staff-status-list-item"
                  >
                    <div className="staff-item-text-wrap">
                      <p className="staff-text">{userName(item?.firstName, item?.lastName)}</p>
                    </div>
                    <div className="staff-item-text-wrap">
                      {/* <p className="staff-text"> {item?.status} <span className="dot">.</span> </p> */}
                      <div className= {`dot ${item?.status == "active" ? "active-user": "inactive-user"} `} ></div>
                    </div>
                  </ListItemButton>
                </ListItem>
              );
            })
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", marginTop: "20px" }}
            >
              {t(constantString.NO_DATA)}
            </Typography>
          )}
        </List>
      </div>
    </div>
  );
};
