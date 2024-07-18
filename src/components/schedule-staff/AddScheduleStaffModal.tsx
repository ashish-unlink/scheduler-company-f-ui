import React, { useState, useEffect } from "react";
import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../appointment-popup/AppointmentPopupHeader";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  setAddDateStaff,
  setAddStaffScheduleModal,
  setShowShiftDeleteModal,
} from "../../redux/staff/slice";
import { useFormik } from "formik";
import {
  appointmentSuccessColumns,
  constantString,
} from "../../utils/constantString";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import {
  TimeShiftProps,
  rowStaffScheduleData,
} from "../../utils/types/dataTypes";
import { TimePicker } from "../time-picker/TimePicker";
import "./style.css";
import { AddFloatingButton } from "../addFloatingButton/AddFloatingButton";
import { DeleteOutline } from "@mui/icons-material";
import {
  selectAddDateStaff,
  selectAddScheduleStaff,
  selectDeletedShiftItem,
  selectSelectedStaffDetails,
  selectShowShiftDelete,
} from "../../redux/staff/selector";
import dayjs, { Dayjs } from "dayjs";
import { DatePick } from "../date-pick";
import { requiredArraySchema, requiredSchema } from "../../utils/validation";
import * as Yup from "yup";
import {
  addEmployeeShiftSchedule,
  deleteSheduleShift,
} from "../../redux/staff/action";
import {
  RequestAddEmployeeShift,
  RequestTimeShiftsProps,
} from "../../utils/types/requestType";
import { useCompanyData } from "../hooks/useCompanyData";
import DeleteModal from "../delete-confirmation/DeleteModal";
import {
  selectBusinessSeteTime,
} from "../../redux/meta/selector";
import { setShowAlert } from "../../redux/meta/slice";
import translateLabel from "../hooks/translationLable";
import { Checkbox, Typography } from "@mui/material";
import { useCurrentWeek } from "../hooks/useCurrentWeek";
import { useSearchParams } from "react-router-dom";

export const AddScheduleStaffModal = ({
  data,
  dateRange,
}: {
  data: rowStaffScheduleData;
  dateRange: string | null;
}) => {
  const dispatch = useAppDispatch();
  const [timeArray, setTimeArray] = useState<RequestTimeShiftsProps[]>([]);
  const { t } = useTranslation();
  const selectedStaff = useAppSelector(selectSelectedStaffDetails);
  const companyId = useCompanyData();
  const showDeletePopup = useAppSelector(selectShowShiftDelete);
  const showStaffScheduleModal = useAppSelector(selectAddScheduleStaff);
  const deletedShiftItemId = useAppSelector(selectDeletedShiftItem);
  const bussinessSetupTime = useAppSelector(selectBusinessSeteTime);
  const [allErrors, setAllErrors] = useState<{} | null>(null);
  const [isCheckAllDays, setCheckALlDays] = useState<boolean>(false);
  const { monday, sunday } = useCurrentWeek();
  const [searchParams] = useSearchParams();
  const dateRangeData = searchParams?.get("dtRange");

  const nextWeekEndDate = dateRangeData?.slice(12, 22);

  const customStyle = {
    position: "absolute",
    top: "22vh",
    left: "30%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "1rem",
    boxShadow: 24,
    // p: 4,
  };

  useEffect(() => {
    if (deletedShiftItemId) {
      const data = showStaffScheduleModal?.shifts?.filter(
        (i: RequestTimeShiftsProps) => {
          return i?.id != deletedShiftItemId;
        }
      );
      dispatch(
        setAddStaffScheduleModal({ ...showStaffScheduleModal, shifts: data })
      );
      setTimeArray(data);
    }
  }, [deletedShiftItemId]);

  useEffect(() => {
    setTimeArray([...showStaffScheduleModal?.shifts]);
  }, []);

  interface InitialValueProps {
    time_range: RequestTimeShiftsProps[];
    startDate: Dayjs;
    endDate: Dayjs;
  }

  const initialValues: InitialValueProps = {
    time_range: [...timeArray],
    startDate: dayjs(showStaffScheduleModal?.date),
    endDate: isCheckAllDays
      ? dateRangeData == null
        ? dayjs(sunday)
        : dayjs(nextWeekEndDate)
      : dayjs(showStaffScheduleModal?.date),
  };

  const validationSchema = Yup.object({
    startDate: requiredSchema("Start Date"),
    endDate: requiredSchema("End Date"),
    time_range: requiredArraySchema(),
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const tt = onCheckShiftAvaibility();

      if (tt.includes(false)) {
        dispatch(
          setShowAlert({
            message: translateLabel(constantString.MESSAGE_ANOTHER_TIME),
            type: "error",
          })
        );
      } else {
        const shiftsArray: RequestTimeShiftsProps[] = values?.time_range?.map(
          (i: RequestTimeShiftsProps, index: number) => {
            return {
              shiftId: index + 1,
              from: dayjs(i?.from, "HH:mm:ss").format("HH:mm:ss"),
              to: dayjs(i?.to, "HH:mm:ss").format("HH:mm:ss"),
            };
          }
        );

        const body: RequestAddEmployeeShift = {
          employeeId: selectedStaff?.id,
          startDate: dayjs(values?.startDate).format("YYYY-MM-DD"),
          endDate: dayjs(values?.endDate).format("YYYY-MM-DD"),
          shiftData: [
            {
              targetDays: isCheckAllDays
                ? ["Sunday","Monday","Tuesday", "Wednesday","Thursday","Friday","Saturday"]
                : showStaffScheduleModal?.day?.day != null
                ? [showStaffScheduleModal?.day?.day]
                : [],
              shiftNTimeData: shiftsArray,
            },
          ],
        };

        dispatch(
          addEmployeeShiftSchedule({
            body,
            companyId: companyId,
            dateRange: dateRange,
          })
        );
      }
    },
  });

  const {
    handleSubmit,
    setFieldValue,
    handleChange,
    values,
    handleBlur,
    errors,
    touched,
  } = formik;

  const onClickDelete = (item: RequestTimeShiftsProps) => {
    if (item?.id) {
      dispatch(deleteSheduleShift(item?.id));
    } else {
      const dd = timeArray?.filter((i) => {
        return i?.shiftId != item?.shiftId;
      });
      setTimeArray(dd);
      dispatch(setShowShiftDeleteModal(null));
    }
  };

  const onCheckShiftAvaibility = () => {
    const tempArray = timeArray?.map((item, i) => {
      const startTime = dayjs(item?.from, "HH:mm:ss");
      const endTime = dayjs(item?.to, "HH:mm:ss");

      const selectedStartTime = dayjs(timeArray[i + 1]?.from, "HH:mm:ss");
      const selectedEndTime = dayjs(timeArray[i + 1]?.to, "HH:mm:ss");

      if (selectedStartTime < endTime || selectedEndTime < endTime) {
        return false;
      } else {
        return true;
      }
    });
    return tempArray;
  };

  return (
    <CustomPopup
      open={showStaffScheduleModal ? true : false}
      style={customStyle}
    >
      <AppointmentPopupHeader
        onClose={() => {
          dispatch(setAddStaffScheduleModal(null));
        }}
      >
        <div>
          <b className="shift-title">
            Update{" "}
            {showStaffScheduleModal?.day?.day != null &&
              showStaffScheduleModal?.day?.day}
            's Shift
          </b>
        </div>
      </AppointmentPopupHeader>
      <form onSubmit={handleSubmit}>
        <div className="time-picker-wrap">
          <div className="grp-date-range ">
            <DatePick
              name="startDate"
              label={translateLabel(constantString.START_DATE)}
              placeholder="Start Date"
              onChange={(e: any) => {
                setFieldValue("startDate", e, true);
              }}
              value={dayjs(values.startDate)}
              onBlur={handleBlur}
              error={touched.startDate && errors.startDate && errors.startDate}
              mandatory
            />
            -
            <DatePick
              name="endDate"
              label={translateLabel(constantString.END_DATE)}
              placeholder="End Date"
              onChange={(e: any) => {
                setFieldValue("endDate", e, true);
              }}
              value={dayjs(values.endDate)}
              onBlur={handleBlur}
              error={touched.endDate && errors.endDate && errors.endDate}
              mandatory
              minDate={dayjs(values?.startDate)}
            />
            <></>
          </div>

          <div className="grp-label-time-range">
            <label className="label-text">
              {t(appointmentSuccessColumns.START_TIME)}
            </label>
            <label className="label-text">
              {t(appointmentSuccessColumns.END_TIME)}
            </label>
          </div>

          <div className="grp-date-range" key={0}>
            <TimePicker
              value={dayjs(timeArray?.[0]?.from, "HH:mm:ss")}
              name={`from-0`}
              onChange={(e) => {
                setFieldValue(`time_range.${0}.from`, e);

                const newTimeArray = [...timeArray];
                newTimeArray[0] = { ...newTimeArray[0], from: e };
                setTimeArray(newTimeArray);
              }}
           
            />
            -
            <TimePicker
              value={dayjs(timeArray?.[0]?.to, "HH:mm:ss")}
              name={`to-0`}
              onChange={(e) => {
                setFieldValue(`time_range.${0}.to`, e);
                const newTimeArray = [...timeArray];
                newTimeArray[0] = { ...newTimeArray[0], to: e };
                setTimeArray(newTimeArray);
              }}
            />
          </div>

          {timeArray?.slice(1)?.map((item, index) => {
            return (
              <div className="grp-time-range" key={index + 1}>
                <TimePicker
                  value={dayjs(item?.from, "HH:mm:ss")}
                  minTime={dayjs(values?.time_range[index]?.to, "HH:mm")}
                  name="from"
                  onChange={(e) => {
                    setFieldValue(`time_range.${index + 1}.from`, e);

                    const newTimeArray = [...timeArray];
                    newTimeArray[index + 1] = {
                      ...newTimeArray[index + 1],
                      from: e,
                    };
                    setTimeArray(newTimeArray);
                  }}
                  error={
                    errors?.time_range?.[index + 1] != undefined &&
                    touched?.time_range?.[index + 1] != undefined &&
                    touched?.time_range?.[index + 1]?.from &&
                    // errors?.time_range?.[index + 1]
                    "Start time is required"
                  }
                />
                -
                <TimePicker
                  value={dayjs(item?.to, "HH:mm:ss")}
                  // name={`to-${index + 1}`}
                  minTime={dayjs(values?.time_range[index + 1]?.from, "HH:mm")}
                  name="to"
                  onChange={(e) => {
                    setFieldValue(`time_range.${index + 1}.to`, e);

                    const newTimeArray = [...timeArray];
                    newTimeArray[index + 1] = {
                      ...newTimeArray[index + 1],
                      to: e,
                    };
                    setTimeArray(newTimeArray);
                  }}
                  error={
                    errors?.time_range?.[index + 1] != undefined &&
                    touched?.time_range?.[index + 1] != undefined &&
                    touched?.time_range?.[index + 1]?.to &&
                    // errors?.time_range?.[index + 1]
                    "End time is required"
                  }
                />
                <DeleteOutline
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch(setShowShiftDeleteModal(item))}
                />
              </div>
            );
          })}

          <div
            className="floating-btn-wrap"
            onClick={() => {
              setTimeArray([
                ...timeArray,
                {
                  shiftId: timeArray?.length + 1,
                  from: "",
                  to: "",
                },
              ]);
            }}
          >
            <AddFloatingButton
              onClick={() => {}}
              type="border-btn"
              title="Add Shift"
            />
            <p className="shift-text">{t(constantString.ADD_SHIFT)}</p>
          </div>
          <div className="copy-shift-checkbox-wrap">
            <Checkbox
              edge="start"
              name="appointment"
              tabIndex={-1}
              checked={isCheckAllDays}
              onChange={(e, isCheck) => {
                setCheckALlDays(isCheck);
              }}
            />
            <Typography variant="body1">
              {t(constantString.COPY_SCHEDULE_TITLE)}
            </Typography>
          </div>
          <div className="btn-div">
            <Button variant="contained" className="contained-btn" type="submit">
              {t(constantString.SAVE)}
            </Button>
          </div>
        </div>
      </form>

      {showDeletePopup && (
        <DeleteModal
          open={showDeletePopup}
          onClose={() => dispatch(setShowShiftDeleteModal(null))}
          confirmDelete={() => {
            onClickDelete(showDeletePopup);
          }}
          heading={t(constantString.CONFIRM_DELETE)}
          title={`${t(constantString.DELETE)} ${t(constantString.THIS_SHIFT)} `}
        />
      )}
    </CustomPopup>
  );
};
