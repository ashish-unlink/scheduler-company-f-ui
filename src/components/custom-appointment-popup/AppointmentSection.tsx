import { AppointmentCreateDetails } from "../appointment-create-details/AppointmentCreateDetails";
import convertMinutesToHoursAndMinutes from "../hooks/convertMinutesToHoursAndMinutes";
import AppointmentTextField from "../appointment-popup/AppointmentTextField";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../redux";
import { status } from "../custom-scheduler/data";
import AppointmentSelectBox2 from "../appointment-popup/AppointmentSelectBox2";
import {
  selectAppointmentData,
  selectCalenderAppointmentDate,
  selectEditAppointmentForm,
  selectSelectedClient,
  selectSuccessedAppointmentLoading,
  selectTotalPrice,
  selectTotalTime,
  selectUpdateAppointmentId,
} from "../../redux/appointment/selector";
import dayjs from "dayjs";
import {
  createAppointmentAPI,
  updateAppointmentAPI,
} from "../../redux/appointment/action";
import { AddAppoinmentRequest } from "../../utils/types/requestType";
import "./appointmentStyle.css";
import CircularLoader from "../loading/CircularLoader";
import { shortArrayByTime } from "../../utils/general";
import { useEffect, useState } from "react";
import { Comments } from "../../utils/types/responseType";
import { useCountyPrice } from "../hooks/useCountyPrice";
import { useCompanyData } from "../hooks/useCompanyData";
import {
  appointmentSuccessColumns,
  constantString,
  validationMessages,
} from "../../utils/constantString";
import { AppointmentTableView } from "./AppointmentTableView";
import translateLabel from "../hooks/translationLable";
import { setServiceStaffRelationList } from "../../redux/staff/slice";

export const AppointmentSection = ({
  setErrorState,
}: {
  setErrorState: (error: string) => void;
}) => {
  const appointmentData = useAppSelector(selectAppointmentData);
  const totalTime = useAppSelector(selectTotalTime);
  const totalPrice = useAppSelector(selectTotalPrice);
  const selectedClientData = useAppSelector(selectSelectedClient);
  const companyId = useCompanyData();
  const selectedDate = useAppSelector(selectCalenderAppointmentDate);
  const selectedUpdateAppointmetId = useAppSelector(selectUpdateAppointmentId);
  let discount = 0;
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectSuccessedAppointmentLoading);
  const editForm = useAppSelector(selectEditAppointmentForm);
  const [updateComments, setUpdateComments] = useState<
    { commentId: string; content: string }[]
  >([]);
  const { format } = useCountyPrice();

  useEffect(() => {
    if (editForm?.comments?.length > 0) {
      const temp = editForm?.comments?.map((i: Comments) => {
        return { commentId: i?.id, content: i?.content };
      });
      setUpdateComments(temp);
    }
  }, [editForm]);

  interface AppointmentSectionProps {
    comment: string;
    status: string;
  }

  const initialValues: AppointmentSectionProps = {
    comment: "",
    status: editForm?.status ?? "pending",
  };

  const sortData = shortArrayByTime(appointmentData);
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      if (selectedClientData) {
        const tempStatus = editForm?.apptStatus?.find((i: any) => {
          return i?.status === values?.status;
        });

        const obj: AddAppoinmentRequest = {
          ...(selectedUpdateAppointmetId != "" && {
            id: selectedUpdateAppointmetId,
          }),
          clientId: selectedClientData?.id,
          companyId: companyId,
          appointmentDate: dayjs(selectedDate).format("YYYY-MM-DD"),
          startTime: sortData?.[0]?.empSvcBkgStartTime,
          endTimeExpected: sortData?.[sortData?.length - 1]?.empSvcBkgEndTime,
          endTime: sortData?.[sortData?.length - 1]?.empSvcBkgEndTime,
          totalDuration: totalTime,
          priceExpected: totalPrice,
          priceFull: totalPrice,
          ...(discount > 0 && {
            discount: discount,
          }),
          priceFinal: totalPrice,
          status: values.status,
          // canceled
          // cancelationReason
          appointmentComments: editForm
            ? values?.comment
              ? [...updateComments, { content: values?.comment }]
              : []
            : values?.comment
            ? [{ content: values?.comment }]
            : [],
          svcBooked: appointmentData?.map((i: any) => {
            return {
              svcCtlgItemsId: i.serviceId,
              employeeBookedId: i.staffId,
              price: parseFloat(i.price),
              empSvcBkgDuration: i.serviceTime,
              empSvcBkgStartTime: i.startTime,
              empSvcBkgEndTime: i.endTime,
            };
          }),

          appointmentStatus: editForm
            ? tempStatus == undefined
              ? [{ status: values?.status }]
              : []
            : [{ status: values?.status }],
        };
        {
          selectedUpdateAppointmetId != ""
            ? dispatch(updateAppointmentAPI(obj))
            : dispatch(createAppointmentAPI(obj));
        }

        dispatch(setServiceStaffRelationList([]));
      } else {
        setErrorState(validationMessages.CLIENT_REQUIRED);
      }
    },
  });

  const {
    handleSubmit,
    handleReset,
    handleChange,
    values,
    handleBlur,
    setFieldValue,
    errors,
    touched,
  } = formik;
  return (
    <div className="appointment-flex">
      {isLoading && <CircularLoader />}

      <AppointmentCreateDetails appointmentData={appointmentData} />
      <div className="service-table">
        <AppointmentTableView />
      </div>
      <div className="total-amount">
        <div>
          {" "}
          {translateLabel(appointmentSuccessColumns.TOTAL_AMOUNT)} :{" "}
          {format(totalPrice)}
        </div>

        <div>
          {translateLabel(appointmentSuccessColumns.TOTAL_TIME)} :{" "}
          {convertMinutesToHoursAndMinutes(totalTime)}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{ display: "flex", alignItems: "center", gap: "20px" }}
          className="appoint-form-select-box"
        >
          <div style={{ width: "100%" }}>
            <AppointmentTextField
              name="comment"
              label={translateLabel(constantString.BOOKING_COMMENTS)}
              placeholder={translateLabel(constantString.BOOKING_COMMENTS)}
              onChange={(e: any) => {
                handleChange(e);
              }}
              value={values.comment}
              onBlur={handleBlur}
              error={touched.comment && errors.comment}
              maxLength={150}
            />
          </div>

          <AppointmentSelectBox2
            name="status"
            label={translateLabel(constantString.STATUS)}
            options={status?.slice(1)}
            placeholder={translateLabel(constantString.STATUS)}
            onChange={(e) => {
              handleChange(e);
            }}
            value={values.status}
            error={touched.status && errors.status}
            mandatory
          />
        </div>

        <div className="submit-div">
          <button
            className="add-new"
            type="submit"
            // onClick={(e) => onSubmitAppointmentForm(e)}
            // disabled = {appointment?.Services?.length == 0}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
