import React, { useState, useEffect } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import { setAppointmentInvoice } from "../../redux/appointment/slice";
import { useAppDispatch, useAppSelector } from "../../redux";
import { ResponseAppointment, ServiceBookedAppointment } from "../../utils/types/responseType";
import { getFormattedDate, sortComments, userName } from "../../utils/general";
import "./invoiceStyle.css";
import CustomTable from "../custom-table/CustomTable";
import { useCountyPrice } from "../hooks/useCountyPrice";
import convertMinutesToHoursAndMinutes from "../hooks/convertMinutesToHoursAndMinutes";
import { appointmentStatus } from "../../utils/primtive/status";
import { selectOwnerData } from "../../redux/auth/selector";
import dayjs from "dayjs";
import {
  appointmentSuccessColumns,
  constantString,
} from "../../utils/constantString";
import translateLabel from "../hooks/translationLable";
import { selectAppointmentApiData } from "../../redux/appointment/selector";
import { AppointmentListProps } from "../../utils/types/dataTypes";

export const Invoice = ({
  open,
  selectedData,
}: {
  open: boolean;
  selectedData: AppointmentListProps;
}) => {
  const dispatch = useAppDispatch();
  const { format } = useCountyPrice();
  const ownerData = useAppSelector(selectOwnerData);
  const appointmentData = useAppSelector(selectAppointmentApiData);
  const [appointmentDetails, setAppointmentDetails] =
    useState<ResponseAppointment>();
    const [finalPrice, setFinalPrice] =
    useState(0);

  useEffect(() => {
    if (selectedData) {
      const data = appointmentData?.find((i: ResponseAppointment) => {
        return i?.id == selectedData?.appointmentId;
      });
      let sum = 0;
      data?.servicesBooked?.forEach((element:ServiceBookedAppointment) => {
        if(element?.svcCtlgItems){
          sum = sum + parseFloat(element?.svcCtlgItems?.price);
        }
      });
      setFinalPrice(sum)
      setAppointmentDetails(data);
    }
  }, []);
  const customStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0",
    boxShadow: 24,
    height: "100vh",
    // p: 4,
  };

  const columns = [
    {
      field: "title",
      headerName: translateLabel(constantString.TITLE),
      sortable: false,
      headerClassName: "custom-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return <div>{params?.row?.svcCtlgItems?.title}</div>;
      },
    },
    {
      field: "price",
      headerName: translateLabel(appointmentSuccessColumns.PRICE),
      sortable: false,
      headerClassName: "custom-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return <div>{format(params?.row?.svcCtlgItems?.price)}</div>;
      },
    },
    {
      field: "time",
      headerName: translateLabel(appointmentSuccessColumns.TIME),
      sortable: false,
      headerClassName: "custom-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <div>
            {params?.row?.empSvcBkgStartTime} - {params?.row?.empSvcBkgEndTime}
          </div>
        );
      },
    },
    {
      field: "employeName",
      headerName: translateLabel(constantString.EMPLOYEE_NAME),
      sortable: false,
      headerClassName: "custom-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <div>
            {userName(
              params?.row?.employeeBooked?.firstName,
              params?.row?.employeeBooked?.lastName
            )}
          </div>
        );
      },
    },
  ];

  return (
    <CustomPopup open={open} style={customStyle}>
      <AppointmentPopupHeader
        onClose={() => {
          dispatch(setAppointmentInvoice(null));
        }}
      >
        <b>Invoice</b>
      </AppointmentPopupHeader>
      {appointmentDetails && (
        <div className="invoice-container">
          <div className="invoice-user-wrap">
            <div>
              {/* <p className="invoice-text">To,</p> */}
              <p className="invoice-text">
                {userName(
                  appointmentDetails?.client?.firstName,
                  appointmentDetails?.client?.lastName
                )}
              </p>
              <p className="invoice-text">
                {appointmentDetails?.client?.email}
              </p>
              <p className="invoice-text">
                {appointmentDetails?.client?.phoneNumber}
              </p>
            </div>

            <div>
              <p className="invoice-text">Invoice Number</p>
              <p className="invoice-text">
                {getFormattedDate(appointmentDetails?.appointmentDate)}
              </p>
           
            </div>
          </div>

          <div className="invoice-content-table">
            <CustomTable
              columns={columns}
              rows={appointmentDetails?.servicesBooked}
            />
          </div>

          <div className="invoice-comments">
            <p className="invoice-text">
              {translateLabel(constantString.COMMENTS)}:
            </p>
            {sortComments(appointmentDetails?.comments)?.map((i) => {
              return (
                <div className="invoice-comments-data">
                  <p className="invoice-comment-text"> {i?.content}</p>
                  <p className="invoice-comment-text">
                    {" "}
                    ~{" "}
                    <i>{userName(ownerData?.firstName, ownerData?.lastName)}</i>
                    , &nbsp; <i>{dayjs(i?.createdAt).format("DD-MM-YYYY")}</i>
                  </p>
                </div>
              );
            })}
          </div>

          <div className="invoice-footer-wrap">
            <p className="invoice-text">
              {translateLabel(constantString.STATUS)}: {`[ `}
              {appointmentDetails?.apptStatus?.map((i, index) => {
                return (
                  <span className="invoice-comment-text">
                    {appointmentStatus[i?.status]}{" "}
                    {index + 1 != appointmentDetails?.apptStatus?.length && ","}{" "}
                  </span>
                );
              })}
              {`]`}
            </p>
            <p className="invoice-text">
              {translateLabel(appointmentSuccessColumns.TOTAL_TIME)}:{" "}
              {convertMinutesToHoursAndMinutes(
                appointmentDetails?.totalDuration
              )}
            </p>
            <p className="invoice-text">
              {translateLabel(appointmentSuccessColumns.TOTAL_AMOUNT)}:{" "}
              {format(finalPrice)}
            </p>
          </div>
        </div>
      )}
    </CustomPopup>
  );
};
