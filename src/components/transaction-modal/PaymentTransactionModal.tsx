import React, { useEffect, useState } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import {
  setOpenQrModal,
  setOpenTranscationModal,
} from "../../redux/appointment/slice";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  appointmentSuccessColumns,
  constantString,
} from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import { DeleteOutline } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { Button, capitalize } from "@mui/material";
import { paymentRequestProps } from "../../utils/types/requestType";
import {
  fetchPaymentTransactionAPI,
  sendPaymentLinkAPI,
} from "../../redux/appointment/action";
import { AppointmentListProps } from "../../utils/types/dataTypes";
import {
  selectOpenQrModal,
  selectPaymentTransationData,
  selectSuccessedAppointmentLoading,
} from "../../redux/appointment/selector";
import { useCountyPrice } from "../hooks/useCountyPrice";
import dayjs from "dayjs";
import AppointmentTextField from "../appointment-popup/AppointmentTextField";
import { CircularProgressBar } from "../loading/CircularLoader";

import { useCountryCurrency } from "../hooks/useCountryCurrency";
import { useCompanyData } from "../hooks/useCompanyData";
import "./paymentTransacionStyle.css";

export const PaymentTransactionModal = ({
  open,
  selectedData,
}: {
  open: boolean;
  selectedData: AppointmentListProps;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { format } = useCountyPrice();
  const paymentTransactionData = useAppSelector(selectPaymentTransationData);
  const [payingAmount, setPayingAmount] = useState<number>();
  const isLoading = useAppSelector(selectSuccessedAppointmentLoading);
  const currencySymbol = useCountryCurrency();
  const companyBranchId = useCompanyData();

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

  useEffect(() => {
    if (paymentTransactionData) {
      const pp = paymentTransactionData[0]
        ? parseInt(paymentTransactionData?.[0]?.balance)
        : 0;
      setPayingAmount(Math.floor(pp));
    }
  }, [paymentTransactionData]);

  useEffect(() => {
    if (selectedData?.appointmentId) {
      const body = {
        id: selectedData?.appointmentId,
        companyBranchId: companyBranchId,
      };
      dispatch(fetchPaymentTransactionAPI(body));
    }
  }, []);

  const columns: any = [
    {
      field: "txnRef",
      headerName: t(constantString.TRANSACTION_ID),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1.2,
      renderCell: (params: any) => {
        return (
          <div>{params?.row?.txnRef ? `${params?.row?.txnRef}` : "-"}</div>
        );
      },
    },
    {
      field: "gatewayTxnRef",
      headerName: t(constantString.GATEWAY_TRANSACTION_ID),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1.2,
      renderCell: (params: any) => {
        return (
          <div>
            {params?.row?.gatewayTxnId ? `${params?.row?.gatewayTxnId}` : "-"}
          </div>
        );
      },
    },

    {
      field: "date",
      headerName: `Payment ${t(constantString.DATE)} & ${t(
        appointmentSuccessColumns.TIME
      )}`,
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <div>
            {params?.row?.txnTime
              ? dayjs(params?.row?.txnTime).format("DD-MM-YYYY HH:mm")
              : "-"}
          </div>
        );
      },
    },

    {
      field: "Create At",
      headerName: t(constantString.CREATED_AT),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <div>{dayjs(params?.row?.createdAt).format("DD-MM-YYYY HH:mm")}</div>
        );
      },
    },

    {
      field: "amount",
      type: "number",
      headerName: t(constantString.AMOUNT),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 0.8,
      renderCell: (params: any) => {
        return <div>{format(params?.row?.amountReceived)}</div>;
      },
    },

    {
      field: "status",
      headerName: t(constantString.STATUS),
      sortable: false,
      headerClassName: "appointment-table-header",
      flex: 1,
      renderCell: (props: any) => {
        return <div>{capitalize(props?.row?.status)}</div>;
      },
    },

    // {
    //   field: "action",
    //   headerName: t(constantString.ACTION),
    //   sortable: false,
    //   headerClassName: "appointment-table-header",
    //   headerAlign: "center",
    //   filterable: false,
    //   flex: 0.5,
    //   renderCell: (params: any) => {
    //     return (
    //       params?.row?.status != "Payment Successful." && (
    //         <button
    //           className="delete-btn delete-align"
    //           onClick={(e) => {
    //             e.preventDefault();
    //             // dispatch(setShowAppointmentDeleteModal(params.row));
    //           }}
    //         >
    //           <DeleteOutline />
    //         </button>
    //       )
    //     );
    //   },
    // },
  ];

  return (
    <>
      {isLoading && <CircularProgressBar />}
      <CustomPopup open={open} style={customStyle}>
        <AppointmentPopupHeader
          onClose={() => {
            dispatch(setOpenTranscationModal(null));
          }}
        >
          <b>{t(constantString.PAYMENT_TRANSACTION)}</b>
        </AppointmentPopupHeader>
        <div className="wrap-table">
          <DataGrid
            rows={
              paymentTransactionData?.[0]?.txnItems?.length > 0
                ? paymentTransactionData?.[0]?.txnItems
                : []
            }
            columns={columns}
          />
          <div className="wrap-payment-btn">
            {paymentTransactionData?.[0] && (
              <div className="wrap-counts">
                <p>
                  {t(constantString?.TOTAL)} :{" "}
                  {format(paymentTransactionData?.[0]?.totalAmount)}
                </p>
                <p>
                  {t(constantString?.BALANCE)} :{" "}
                  {format(paymentTransactionData?.[0]?.balance)}
                </p>
                {paymentTransactionData?.[0]?.balance != 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <p>
                      {t(constantString?.AMOUNT_PAID)} ({currencySymbol}) :
                      &nbsp;
                    </p>
                    <p style={{ width: "100px" }}>
                      <AppointmentTextField
                        name="amount_paying"
                        placeholder="Amount paying"
                        onChange={(e: any) => {
                          setPayingAmount(e.target.value);
                        }}
                        value={payingAmount}
                      />
                    </p>
                  </div>
                )}
              </div>
            )}

            {paymentTransactionData?.[0]?.balance != 0 && (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    const body: paymentRequestProps = {
                      appointmentId: selectedData?.appointmentId,
                      transaction: {
                        amountReceived: payingAmount,
                      },
                    };
                    dispatch(sendPaymentLinkAPI(body));
                  }}
                  disabled={!payingAmount}
                  className="sent_payment_btn"
                >
                  {t(constantString.PROCCED_PAYMENT)}
                </Button>
              </>
            )}
          </div>
        </div>
      </CustomPopup>
    </>
  );
};
