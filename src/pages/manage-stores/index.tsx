import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { constantString } from "../../utils/constantString";
import { RiEditFill } from "react-icons/ri";
import { MdFilterListAlt } from "react-icons/md";
import { NavBar } from "../../components/nav-bar/NavBar";
import { useAppDispatch, useAppSelector } from "../../redux";
import { fetchMultiStoreList } from "../../redux/multi-store/action";
import {
  selectMultiStoreList,
  selectMultiStoreLoading,
  selectOpenStoreModal,
  selectStoreOpenModal,
} from "../../redux/multi-store/selector";
import AddEditStore from "../../components/add-edit-store/AddEditStore";
import "./style.css";
import { setOpenLocation, setOpenStoreModal } from "../../redux/multi-store/slice";
import { Address, BusinessLocation } from "../../utils/types/responseType";
import { selectOwnerData } from "../../redux/auth/selector";
import CircularLoader from "../../components/loading/CircularLoader";
import AddStoreAddress from "../../components/add-edit-store/AddStoreAddress";
import { capitilizeName } from "../../utils/general";
import dayjs from "dayjs";
import translateLabel from "../../components/hooks/translationLable";
import { IoLocationSharp } from "react-icons/io5";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Tooltip } from "@mui/material";
import { selectCountryList } from "../../redux/meta/selector";

const ManageStores = () => {
  const rowCounts = 10;
  const [deletePopup, setDeletePopup] = useState({
    open: false,
    store_code: "",
  });
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const multiStoreDataList = useAppSelector(selectMultiStoreList);
  const isOpenAddEditModal = useAppSelector(selectStoreOpenModal);
  const [selectEditData, setSelectEditData] = useState<BusinessLocation | null>(null);
  const ownerData = useAppSelector(selectOwnerData);
  const ownerId = ownerData?.ownerBusiness?.ownerId;
  const isLoading = useAppSelector(selectMultiStoreLoading);
  const openAddressModal = useAppSelector(selectOpenStoreModal);
  const countryList = useAppSelector(selectCountryList);


  useEffect(() => {
    dispatch(fetchMultiStoreList(ownerId));
  }, []);

  const actionButtons = [
    {
      title: translateLabel(constantString.UPDATE_STORE_LOCATION),
      icon: <IoLocationSharp   />,
      onClick: (data: BusinessLocation) => {
        setSelectEditData(data);
        dispatch(setOpenLocation(true));
      },
    },
    {
      title: translateLabel(constantString.UPDATE_STORE),
      icon: <RiEditFill />,
      onClick: (data: BusinessLocation) => {
        setSelectEditData(data); dispatch(setOpenStoreModal(true));
      },
    },
    // {
    //   title: translateLabel(constantString.DELETE_STORE),
    //   icon: <MdDelete color="red" />,
    //   onClick: (data: BusinessLocation) => {
    //     // setDeletePopup({ open: true });
    //   },
    // },
  ];

  const columns: any = [
    {
      field: "title",
      headerName: t("Store Name"),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      renderCell: ({ row }: any) => {
        return  <div className="store-address">{row.title}</div>;
      },
    },
    {
      field: "location",
      headerName: t("Location"),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      renderCell: ({ row }: any) => {
        const {companyAddress} = row;
        console.log("companyAddress.country",companyAddress?.country);
        
        const countryName = countryList?.find((i:Address)=>{return (i?.id === companyAddress?.country?.id)})
        return companyAddress ? <div className="store-address">{companyAddress.street }, <br/>{companyAddress.city }, {companyAddress.state },<br/> {companyAddress.postal}, {countryName?.title} </div> : <div>-</div>;
      },
    },
    {
      field: "contactPhone",
      headerName: t("contact"),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
        renderCell: ({ row }: any) => {
       
        return row?.contactName ? <div>{capitilizeName(row.contactName)}, <br/>{row.contactEmail }, <br/>{row.contactPhone }</div> : <div>-</div>;
      },
    },
    {
      field: "openTime",
      headerName: t("Open Time"),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 0.5,
      renderCell: ({ row }: any) => {
        return row.openTime ? <div className="store-address">{row.openTime}</div> : <div>-</div>;
      },
    },
    {
      field: "closeTime",
      headerName: t("Close Time"),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 0.5,
      renderCell: ({ row }: any) => {
        return row.closeTime ?<div className="store-address">{row.closeTime}</div> : <div>-</div>;
      },
    },
    {
      field: "status",
      headerName: t("Status"),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 0.5,
      renderCell: ({ row }: any) => {
        return <div>{row?.status === "active" ? "Open" : "Close"}</div>;
      },
    },
    {
      field: "Action",
      headerName: t(constantString.ACTION),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <div className="store-actions">
            {actionButtons?.map((item, index) => {
              return (
                <Tooltip title={item.title} placement="bottom">
                  <div className="view-action">
                    <Button variant="outlined" className="outline-btn" onClick={() => item.onClick(params?.row)}>
                      {item.icon}
                    </Button>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        );
      },
    },
  ];

  // TODO deleted code
  // const [row, setRow] = useState([]);

  // const handleCloseDeletePopup = () =>
  //   setDeletePopup({ open: false, store_code: "" });

  // const handleConfirmDelete = () => {
  //   const temp = row;
  //   const newRows = temp?.filter(
  //     (item: any) => item.store_code !== deletePopup.store_code
  //   );
  //   setRow(newRows);
  //   handleCloseDeletePopup();
  // };

  return (
    <div>
      {isLoading && <CircularLoader />}
      <div className="w-100 flex space-between mb-1rem">
        <NavBar
          leftPart={<div className="staff-btn"></div>}
          rightPart={
            <div className="add-store-btn">
              <div className="view-action">
                  <Button variant="outlined" className="outline-btn" onClick={() =>dispatch(setOpenStoreModal(true))}>
                  {t(constantString.ADD_STORE)}
                  </Button>
                </div>
            </div>
          }
        />
      </div>

      <DataGrid
        rows={multiStoreDataList ? multiStoreDataList?.businessLocations : []}
        columns={columns}
        rowCount={rowCounts}
        rowHeight={70}
        hideFooter
      />

      {isOpenAddEditModal && (
        <AddEditStore
          open={isOpenAddEditModal}
          {...(selectEditData !== null && { data: selectEditData })} 
          clearEditState={setSelectEditData}
        />
      )}

    {openAddressModal && selectEditData && <AddStoreAddress open={openAddressModal} selectedAddress={selectEditData} clearEditState={setSelectEditData}
    />}

      {/*  TODO deleted code */}
      {/* <DeleteModal
        open={deletePopup.open}
        onClose={handleCloseDeletePopup}
        confirmDelete={handleConfirmDelete}
        heading={t(constantString.CONFIRM_DELETE)}
        title={t(constantString.DELETE)}
      /> */}
    </div>
  );
};

export default ManageStores;
