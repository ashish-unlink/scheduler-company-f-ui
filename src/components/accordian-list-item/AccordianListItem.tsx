import { useState } from "react";
import { List, ListItem, ListItemButton } from "@mui/material";
import "./accordionListItemStyle.css";
import MoreItems from "../more-items/MoreItems";
import { MoreActionProps } from "../more-items/type";
import {
  ResponseServiceList,
  ServiceListItem,
} from "../../utils/types/responseType";
import notFoundImage from "../assets/not-found.png";
import { useAppDispatch, useAppSelector } from "../../redux";
import { constantString } from "../../utils/constantString";
import { formatDuration } from "../../utils/general";
import {
  setSelectedCategoryItem,
  setSelectedSubCategoryItem,
  setShowSubCategoryModal,
} from "../../redux/service/slice";
import { deleteServiceSubCategoryAPI } from "../../redux/service/action";
import { useTranslation } from "react-i18next";
import { EmptyView } from "../empty-view/EmptyView";
import DeleteModal from "../delete-confirmation/DeleteModal";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { setShowViewStaffModal } from "../../redux/staff/slice";
import { fetchEmployeeServiceRelationData } from "../../redux/staff/action";
import { useCountyPrice } from "../hooks/useCountyPrice";
import { FaRegClock } from "react-icons/fa";
import { useCompanyData } from "../hooks/useCompanyData";
import translateLabel from "../hooks/translationLable";

export const AccordianListItem = ({
  serviceItem,
}: {
  serviceItem: ResponseServiceList;
}) => {
  const dispatch = useAppDispatch();
  const [showDeletePopup, setShowDelete] = useState(false);
  const [selectedDeleteData, setSelectedDeleteData] =
    useState<ResponseServiceList>();
  const companyId = useCompanyData();
  const { format } = useCountyPrice();

  const { t } = useTranslation();

  const options: MoreActionProps[] = [
    {
      name: translateLabel(constantString.EDIT),
      icon: <EditOutlinedIcon fontSize="small" className="delete-popup-img" />,
      onClickHandle: (data) => {
        dispatch(setShowSubCategoryModal(true));
        dispatch(setSelectedSubCategoryItem(data));
        dispatch(setSelectedCategoryItem(serviceItem));
      },
    },
    {
      name:  translateLabel(constantString.DELETE_BTN),
      icon: (
        <DeleteOutlineOutlinedIcon
          fontSize="small"
          className="delete-popup-img"
        />
      ),
      onClickHandle: (data) => {
        setShowDelete(true);
        setSelectedDeleteData(data);
      },
    },
    {
      name: translateLabel(constantString.VIEW_STAFFS),
      icon: (
        <PersonOutlineOutlinedIcon
          fontSize="small"
          className="delete-popup-img"
        />
      ),
      onClickHandle: (data) => {
        dispatch(
          fetchEmployeeServiceRelationData({
            companyId: companyId,
            serviceId: data?.id,
          })
        );
        dispatch(setShowViewStaffModal(data));
      },
    },
  ];

  
  return (
    <List
      sx={{
        width: "100%",
        paddingLeft: "30px",
        "& .MuiAccordionDetails-root": {
          marginTop: "0px !important",
        },
        paddingRight: "30px",
      }}
      className="accordion-list"
    >
      {serviceItem?.svcCtlgItems?.length > 0 ? (
        serviceItem?.svcCtlgItems?.map(
          (item: ServiceListItem, index: number) => {
            if (item?.status != "delete") {
              return (
                <ListItem key={`item-${index}`} disablePadding>
                  <ListItemButton role={undefined} dense className="wrap-item">
                    <div className="checkbox-wrap">
                      <p className="service-text">{item?.title}</p>
                      {item?.description && (
                        <Tooltip title={item?.description} placement="bottom">
                          <InfoOutlinedIcon
                            fontSize="small"
                            className="info-icon"
                          />
                        </Tooltip>
                      )}
                    </div>
                    <div className="item-text-time-wrap">
                      <p className="service-text">
                        <FaRegClock />
                        {formatDuration(item?.duration)}
                      </p>
                    </div>
                    <div className="item-text-wrap text-align-end">
                      <p className="service-text service-price">
                        {format(parseFloat(item?.price))}
                      </p>
                    </div>
                    <div className="item-text-wrap text-align-end">
                      <MoreItems
                        options={options}
                        item={item}
                        // disabled={
                        //   serviceItem?.status == "inactive" ||
                        //   item?.status == "inactive"
                        // }
                      />
                    </div>
                    {showDeletePopup && (
                      <DeleteModal
                        open={showDeletePopup}
                        onClose={setShowDelete}
                        selectedDeleteData={selectedDeleteData}
                        confirmDelete={() => {
                          if (selectedDeleteData != null) {
                            dispatch(
                              deleteServiceSubCategoryAPI({
                                // values: { status: "delete" },
                                id: selectedDeleteData?.id,
                                catalogue: serviceItem?.id,
                              })
                            );
                          }
                          setShowDelete(false);
                        }}
                        subtitle={t(constantString.DELETE_TEXT)}
                        heading={t(constantString.CONFIRM_DELETE)}
                        title={t(constantString.DELETE)}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            }
          }
        )
      ) : (
        <EmptyView
          src={notFoundImage}
          text={t(constantString.ADD_SERVICE)}
          title="No service available, You can add a new service."
          onHandleClick={() => {
            dispatch(setShowSubCategoryModal(true));
            dispatch(setSelectedCategoryItem(serviceItem));
          }}
        />
      )}
    </List>
  );
};
