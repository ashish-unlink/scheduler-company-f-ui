import React, { useEffect, useState } from "react";
import "./style.css";
import { Button, Divider } from "@mui/material";
import DummyQR from "../../../assets/QR.png";
import {
  appointmentSuccessColumns,
  constantString,
} from "../../../../utils/constantString";
import { useTranslation } from "react-i18next";
import {
  ResponseAppointment,
  ServiceBookedAppointment,
  Users,
} from "../../../../utils/types/responseType";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import { selectServiceList } from "../../../../redux/service/selector";
import { selectEmployeeList } from "../../../../redux/staff/selector";
import CustomPopup from "../../../../custom-popup/CustomPopup";
import { appointmentpopupstyle } from "../../../custom-appointment-popup/style";
import AppointmentPopupHeader from "../../../appointment-popup/AppointmentPopupHeader";
import { CustomerProfile } from "../../../customer-profile/CustomerProfile";
import convertMinutesToHoursAndMinutes from "../../../hooks/convertMinutesToHoursAndMinutes";
import { Typography } from "@mui/material";
import {
  getFormattedDate,
  shortArrayByTime,
  userName,
} from "../../../../utils/general";
import { useCountyPrice } from "../../../hooks/useCountyPrice";
import { MdOutlineEdit } from "react-icons/md";
import {
  setAppointmentData,
  setEditAppointmentForm,
  setSelectedClient,
  setShowCustomerAppointmentModal,
  setUpdateAppointmentId,
} from "../../../../redux/appointment/slice";
import dayjs from "dayjs";
import AppointmentTextField from "../../../appointment-popup/AppointmentTextField";
import { useCountryCurrency } from "../../../hooks/useCountryCurrency";
import { paymentRequestProps } from "../../../../utils/types/requestType";
import { sendPaymentLinkAPI } from "../../../../redux/appointment/action";
import QRCode from "react-qr-code";
import translateLabel from "../../../hooks/translationLable";
import { selectOpenQrModal } from "../../../../redux/appointment/selector";

interface AppointmentDetailsProps {
  appointment: ResponseAppointment;
  open: boolean;
  onClose: () => void;
}
const AppointmentDetails = ({
  appointment,
  open,
  onClose,
}: AppointmentDetailsProps) => {
  const { t } = useTranslation();
  const serviceList = useAppSelector(selectServiceList);
  const staffList = useAppSelector(selectEmployeeList);
  const clientData = appointment?.client;
  const [appServicesBooked, setAppServicesBooked] = useState<
    ServiceBookedAppointment[]
  >([]);
  const { format } = useCountyPrice();
  const dispatch = useAppDispatch();
  const [payingAmount, setPayingAmount] = useState<number>();
  const generateQR = useAppSelector(selectOpenQrModal);
  const currencySymbol = useCountryCurrency();

  useEffect(() => {
    if (appointment?.servicesBooked?.length > 0) {
      const sortedData = shortArrayByTime(appointment?.servicesBooked);
      setAppServicesBooked(sortedData);
    }
  }, [appointment]);
  return (
    <CustomPopup open={open} onClose={onClose} style={appointmentpopupstyle}>
      <AppointmentPopupHeader onClose={onClose}>
        <b>{t(constantString.APPOINTMENT_COMPLETED)}</b>
      </AppointmentPopupHeader>

      <div className="appointment-info-dialog-box">
        <button
          className="edit-app"
          onClick={() => {
            const temp = appointment?.servicesBooked?.map((item: any) => {
              return {
                id: item?.id,
                serviceId: item?.svcCtlgItemsId,
                services: item?.svcCtlgItemsData?.title,
                staffId: item?.employeeBookedId,
                staff: item?.employeeBookedData?.firstName,
                price: parseInt(item?.price),
                serviceTime: item?.svcCtlgItemsData?.duration,
                startTime: item?.empSvcBkgStartTime,
                endTime: item?.empSvcBkgEndTime,
                startDate: dayjs(appointment?.appointmentDate).format(
                  "DD-MM-YYYY"
                ),
                empSvcBkgStartTime: item?.empSvcBkgStartTime,
                empSvcBkgEndTime: item?.empSvcBkgEndTime,
              };
            });
            dispatch(setAppointmentData(temp));
            dispatch(
              setEditAppointmentForm({
                status: appointment?.status,
                comments: appointment?.comments,
                apptStatus: appointment?.apptStatus,
              })
            );
            dispatch(setUpdateAppointmentId(appointment?.id));
            dispatch(setSelectedClient(appointment?.client));
            dispatch(setShowCustomerAppointmentModal(true));
            onClose();
          }}
        >
          <MdOutlineEdit />
        </button>
        <div className="customer-detail-section">
          <Typography variant="h5" fontWeight={600}>
            {t(constantString.CUSTOMER_DETAILS)}
          </Typography>
          <div className="customer-info">
            <CustomerProfile selectedClientData={clientData} />
            {/* {generateQR && (
              <div className="qr-code-container">
                <QRCode
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={generateQR}
                />
              </div>
            )} */}
            -
          </div>
        </div>

        <Divider />

        <div className="appointment-details">
          <p className="Appointment-heading-text">
            {t(constantString.APPOINTMENT_DETAILS)}
            <span className="date-color">
              {" "}
              ({getFormattedDate(appointment?.appointmentDate)})
            </span>
          </p>
          <div className="appointment-table-header">
            <div className="item-span-service">
              {t(appointmentSuccessColumns.SERVICES)}
            </div>
            <div className="item-span">
              {t(appointmentSuccessColumns.START_TIME)}
            </div>
            <div className="item-span">
              {t(appointmentSuccessColumns.END_TIME)}
            </div>
            <div className="item-span">{t(appointmentSuccessColumns.TIME)}</div>
            <div className="item-span">
              {t(appointmentSuccessColumns.STAFF)}
            </div>
            <div className="price">{t(appointmentSuccessColumns.PRICE)}</div>
          </div>

          {appServicesBooked?.map((item, index) => {
            const duration = item?.svcCtlgItemsData?.duration ?? 0;

            const employee = staffList?.find((i: Users, index: number) => {
              return i.id == item?.employeeBookedId;
            });

            return (
              <div className="appointment-table-body" key={index}>
                <div className="item-span-service">
                  {item?.svcCtlgItemsData?.title}
                </div>
                <div className="item-span">{item?.empSvcBkgStartTime}</div>
                <div className="item-span">{item?.empSvcBkgEndTime}</div>
                <div className="item-span">
                  {convertMinutesToHoursAndMinutes(duration)}
                </div>

                <div className="item-span item-staff">
                  {userName(employee?.firstName, employee?.lastName)}
                </div>
                <div className="price">{format(item?.price)}</div>
              </div>
            );
          })}
        </div>

        <Divider />

        <div className="flex-row-space-between fw-600 mt-2">
          <span>
            {t(appointmentSuccessColumns.TOTAL_TIME)}{" "}
            {convertMinutesToHoursAndMinutes(appointment?.totalDuration)}
          </span>
          <div className="amount-wrap">
            <span>
              {t(appointmentSuccessColumns.TOTAL_AMOUNT)} <>&nbsp;</>{" "}
              {format(parseInt(appointment?.priceFinal))}
            </span>
            <span>
              {t(appointmentSuccessColumns.BALANCE_AMOUNT)} :<>&nbsp;</>{" "}
              {format(appointment?.apmtTxn?.balance ?? appointment?.priceFinal)}
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <p>
                {translateLabel(constantString?.AMOUNT_PAID)} ({currencySymbol})
                :
              </p>
              <>&nbsp;</>
              <p style={{ width: "100px" }}>
                <AppointmentTextField
                  name="amount_paying"
                  placeholder="Amount"
                  onChange={(e: any) => {
                    setPayingAmount(e.target.value);
                  }}
                  value={payingAmount}
                />
              </p>
            </div>
          </div>
        </div>
        <div className="payment-wrap">
          <Button
            onClick={() => {
              onClose();
            }}
            className="skip-btn"
            variant="contained"
          >
            {`${t(constantString.SKIP)} >>`}
          </Button>

          <div className="payment-btn-wrap">
            <Button
              variant="contained"
              onClick={() => {
                const body: paymentRequestProps = {
                  appointmentId: appointment?.id,
                  transaction: {
                    // ...(transactionId )
                    amountReceived: payingAmount,
                  },
                };

                dispatch(sendPaymentLinkAPI(body));
              }}
              disabled={!payingAmount || payingAmount == 0}
              className="payment_btn"
            >
              {t(constantString.SEND_PAYMENT_LINK)}
            </Button>
          </div>
        </div>

        {appointment?.comments && (
          <div style={{ width: "100%" }} className="comments-div">
            <h3>Comments</h3>
            {appointment?.comments?.map((item) => {
              return (
                <div
                  className="comments-cont"
                  style={{ width: "100%" }}
                  key={item.appointmentId}
                >
                  <h5>{item.content}</h5>
                  <h6>
                    {item.createdBy} - {getFormattedDate(item.createdAt)}
                  </h6>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomPopup>
  );
};

export default AppointmentDetails;
