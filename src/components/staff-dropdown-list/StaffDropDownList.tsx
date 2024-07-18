import React, { useEffect, useState } from "react";
import "./style.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddIcon from "@mui/icons-material/Add";
import AppointmentSelectBox from "../appointment-popup/AppointmentSelectBox";
import Delete from "../staff-dropdown-list/delete.png";
import Editing from "../staff-dropdown-list/editing.png";
import { constantString } from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import {
  setSelectedCategoryItem,
  setShowCategoryModal,
  setShowSubCategoryModal,
} from "../../redux/service/slice";
import { useAppDispatch, useAppSelector } from "../../redux";
import MoreItems from "../more-items/MoreItems";
import { MoreActionProps } from "../more-items/type";
import {
  ResponseServiceList,
  ServiceListItem,
} from "../../utils/types/responseType";
import { selectServiceList } from "../../redux/service/selector";
import { deleteServiceCategoryAPI } from "../../redux/service/action";
import { Search } from "../search/Search";
import DeleteModal from "../delete-confirmation/DeleteModal";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import translateLabel from "../hooks/translationLable";

export const StaffDropDownList = ({ item }: { item: ResponseServiceList }) => {
  const [staffList, setStaffList] = useState(false);
  const [showDeletePopup, setShowDelete] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [selectedDeleteData, setSelectedDeleteData] =
    useState<ResponseServiceList>();

  const options: MoreActionProps[] = [
    {
      name:translateLabel(constantString.EDIT),
      icon: <EditOutlinedIcon fontSize="small" className="delete-popup-img" />,
      onClickHandle: (data) => {
        dispatch(setShowCategoryModal(true));
        dispatch(setSelectedCategoryItem(data));
      },
    },
    {
      name:translateLabel(constantString.DELETE_BTN),
      icon: (
        <DeleteOutlineOutlinedIcon
          fontSize="small"
          className="delete-popup-img"
        />
      ),
      onClickHandle: (data) => {
        setSelectedDeleteData(data);
        setShowDelete(true);
      },
    },
  ];

  return (
    <div className="wrap-actions">
      {/* <div className="view-staff-btn-wrap">
        <button
          className="view-staff-btn space-center"
          onClick={(e) => {
            e.stopPropagation();
            setStaffList(!staffList);
          }}
        >
           {t(constantString.VIEW_STAFFS)}
        
          <div className="arrow-wrap">
            <ArrowDropUpIcon fontSize="small" />
            <ArrowDropDownIcon fontSize="small" />
          </div>
        </button>
      </div> */}
      <div className="view-staff-btn-wrap">
        <button
          className="view-staff-btn"
          disabled={item?.status == "inactive"}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setSelectedCategoryItem(item));
            dispatch(setShowSubCategoryModal(true));
          }}
        >
          <AddIcon fontSize="medium" />
          {t(constantString.ADD_SERVICES)}
        </button>
      </div>
      {showDeletePopup && (
        <DeleteModal
          open={showDeletePopup}
          onClose={setShowDelete}
          selectedDeleteData={selectedDeleteData}
          confirmDelete={() => {
            setShowDelete(false);
            if (selectedDeleteData != null) {
              dispatch(
                deleteServiceCategoryAPI({
                  // values: { status: "delete" },
                  id: selectedDeleteData?.id,
                  // company: selectedDeleteData?.company,
                })
              );
            }
          }}
          // subtitle={t(constantString.DELETE_TEXT)}
          heading={t(constantString.CONFIRM_DELETE)}
          title={t(constantString.DELETE)}
        />
      )}

      <div className="view-staff-btn-wrap">
        <EditOutlinedIcon
          fontSize="small"
          className="delete-popup-img"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setShowCategoryModal(true));
            dispatch(setSelectedCategoryItem(item));
          }}
        />
        <DeleteOutlineOutlinedIcon
          fontSize="small"
          className="delete-popup-img"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDeleteData(item);
            setShowDelete(true);
          }}
        />
      </div>

      {/* <MoreItems
        options={options}
        item={item}
      /> */}
    </div>
  );
};
