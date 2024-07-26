import { useEffect, useState } from "react";
import { GroupSelect } from "../group-select/GroupSelect";
import AppointmentTimepicker from "../appointment-popup/AppointmentTimepicker";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../redux";
import { selectServiceList } from "../../redux/service/selector";
import dayjs, { Dayjs } from "dayjs";
import {
  setAppointmentData,
  setDoubleAppointmentPopup,
  setSelectedAppointmentEditData,
} from "../../redux/appointment/slice";
import {
  ResopnseAppointmentBlockData,
  ResponseServiceList,
  ResponseServiceStaffRelation,
  ServiceListItem,
  UserStaffs,
  Users,
} from "../../utils/types/responseType";
import {
  calculateEndTime,
  capitilizeName,
  userName,
} from "../../utils/general";
import {
  selectEmployeeList,
  selectServiceEmployeeRelationList,
} from "../../redux/staff/selector";
import AppointmentSelectBox from "../appointment-popup/AppointmentSelectBox";
import {
  selectAppointmentFilterData,
  selectCalenderAppointmentDate,
  selectSelectedAppointmentEditData,
} from "../../redux/appointment/selector";
import { DatePick } from "../date-pick";
import { setShowAlert } from "../../redux/meta/slice";
import { fetchAppointmentTimeBlockAPI } from "../../redux/appointment/action";
import { fetchEmployeeServiceRelationData } from "../../redux/staff/action";
import { MultiSelectAutoComplete } from "../user-list-dropdown";
import { TimePicker } from "../time-picker/TimePicker";
import { useCompanyData } from "../hooks/useCompanyData";
import { AddAppointmentDataProps } from "../../utils/types/dataTypes";
import { requiredObjectSchema, requiredSchema } from "../../utils/validation";
import * as Yup from "yup";
import translateLabel from "../hooks/translationLable";
import {
  appointmentSuccessColumns,
  constantString,
} from "../../utils/constantString";
import { Box, Typography } from "@mui/material";
import { useCountyPrice } from "../hooks/useCountyPrice";
import DoubleBookingAllowModal from "../double-booking/DoubleBookingAllowModal";

export const AppointmentCreateDetails = ({
  appointmentData,
}: {
  appointmentData: AddAppointmentDataProps[];
}) => {
  const serviceListOptions = useAppSelector(selectServiceList);
  const staffListOptions = useAppSelector(selectEmployeeList);
  const selectedAppointmetDetails = useAppSelector(
    selectSelectedAppointmentEditData
  );
  const dispatch = useAppDispatch();
  const [disableObj, setDisableObj] = useState({
    time: true,
    staff: true,
  });
  const [selectedService, setSelectedService] =
    useState<ServiceListItem | null>(null);
  const appointmentFilterData = useAppSelector(selectAppointmentFilterData);
  const companyId = useCompanyData();
  const selectedDate = useAppSelector(selectCalenderAppointmentDate);
  const [updateStartTime, setUpdateStartTime] = useState(
    selectedAppointmetDetails?.startTime ?? null
  );
  const [filterServiceData, setFilterServiceData] = useState<
    ResponseServiceList[]
  >([]);
  const staffServiceList = useAppSelector(selectServiceEmployeeRelationList);
  const minimumTime = dayjs(selectedDate).isSame(dayjs(), "day");
  const { format } = useCountyPrice();

  useEffect(() => {
    setUpdateStartTime(selectedAppointmetDetails?.startTime ?? null);
  }, [appointmentData]);

  useEffect(() => {
    if (selectedAppointmetDetails?.catalogueId) {
      const selectedServiceData = serviceListOptions?.findIndex((i: any) => {
        return i.id == selectedAppointmetDetails?.catalogueId;
      });

      const data = serviceListOptions?.[
        selectedServiceData
      ]?.svcCtlgItems?.find((i: any) => {
        return i.id == selectedAppointmetDetails?.serviceId;
      });
      setSelectedService(data);
    }
  }, [selectedAppointmetDetails]);

  const employeeIds = staffServiceList?.map(
    (rel: ResponseServiceStaffRelation) => rel?.employeeId
  );

  interface AddAppointmentProps {
    services: ServiceListItem | null;
    startTime: Dayjs;
    staff: UserStaffs;
  }

  const initialValues: AddAppointmentProps = {
    services: selectedService ?? null,
    startTime: selectedAppointmetDetails?.startTime ?? null,
    staff:
      selectedAppointmetDetails?.staff?.length > 0
        ? staffListOptions[selectedAppointmetDetails?.staffIndex]
        : null,
  };

  const validationSchema = Yup.object({
    services: requiredObjectSchema("Service"),
    startTime: requiredObjectSchema("Start time"),
    staff: requiredObjectSchema("Staff"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    // enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      
      if (values?.staff && values?.services && values?.startTime) {
        dispatch(
          fetchAppointmentTimeBlockAPI({
            companyId: companyId,
            date: dayjs(selectedDate).format("YYYY-MM-DD"),
            employeeId: values?.staff?.id,
          })
        );
      } else {
        dispatch(
          setShowAlert({
            message: "Select serice, time and staff",
            type: "error",
          })
        );
      }
    },
  });

  const getAppointmentObject = () => {
    if (values?.services != null && updateStartTime && values?.staff) {
      const endTime = calculateEndTime(
        updateStartTime,
        values?.services?.duration ?? 0
      );

      const obj = {
        id: appointmentData?.length + 1,
        serviceId: values?.services?.id,
        services: values?.services?.title,
        staffId: values?.staff?.id,
        staff: values?.staff?.firstName,
        price: parseInt(values?.services?.price),
        serviceTime: values?.services?.duration,
        startTime: dayjs(updateStartTime).format("HH:mm:ss"),
        endTime: endTime,
        empSvcBkgStartTime: dayjs(updateStartTime).format("HH:mm:ss"),
        empSvcBkgEndTime: endTime,
        startDate: dayjs(
          selectedAppointmetDetails?.startDate ?? new Date()
        ).format("DD-MM-YYYY"),
        // endTime: dayjs().format("HH:mm"),
      };

      dispatch(setAppointmentData([...appointmentData, obj]));
      dispatch(
        setSelectedAppointmentEditData({
          ...selectedAppointmetDetails,
          startTime: dayjs(endTime, "HH:mm"),
          catalogueId: values?.services?.catalogueId,
          serviceId: values?.services?.id,
          staff: [
            {
              firstName: values?.staff?.firstName,
              id: values?.staff?.id,
              value: values?.staff?.firstName,
            },
          ],
        })
      );
    } else {
      dispatch(
        setShowAlert({
          message: "Required service, staff, date and time",
          type: "error",
        })
      );
    }
  };

  // var doubleBooking = true;
  useEffect(() => {
    if (values?.services) {
      const appShiftDataLength = appointmentFilterData?.length;
      const selectedTime = dayjs(updateStartTime).format("HH:mm:ss");
      
      if (appShiftDataLength) {
        const allSheduledData = appointmentFilterData?.map((item: any) => {
          if (item?.status == "present") {
            const scheduleStartTime = item?.from;
            const scheduleEndTime = item?.to;
            if (scheduleStartTime > selectedTime) {
              return false;
            } else if (
              scheduleStartTime < selectedTime &&
              scheduleEndTime > selectedTime
            ) {
              return true;
            } else if (scheduleEndTime < selectedTime) {
              return false;
            }
          } else {
            return "absent";
          }
        });
        if (allSheduledData.some((bool: boolean) => bool === true)) {
          
          if (appointmentFilterData?.length > 0) {
            appointmentFilterData?.map(
              (i: ResopnseAppointmentBlockData, index: number) => {
                const filterData = appointmentFilterData?.[index]?.apptBkgData;

                if (filterData && Object.keys(filterData).length > 0) {
                  const confirmAppointment = Object.entries(filterData)?.map(
                    ([key, val]) => {
                      const startTime = filterData[key]?.empSvcBkgStartTime;
                      const endTime = filterData[key]?.empSvcBkgEndTime;
                      if (startTime > selectedTime) {
                        return true;
                      } else if (
                        startTime < selectedTime &&
                        endTime > selectedTime
                      ) {
                        return false;
                      } else if (endTime < selectedTime) {
                        return true;
                      }
                    }
                  );


                  if (confirmAppointment.every((bool) => bool === true)) {
                    getAppointmentObject();
                  } else {
                    dispatch(
                      setDoubleAppointmentPopup({
                        heading: "Overlapping Appointment Alert!",
                        title:
                          "This time slot overlaps with another appointment for this employee.",
                      })
                    );
                  }
                }else{
                  const confirmLocalAppointment = appointmentData?.map((i: any) => {
                    const startTime = i?.empSvcBkgStartTime;
                    const endTime = i?.empSvcBkgEndTime;
                    const staffMember = i?.staffId;
    
                    if (values?.staff?.id == staffMember) {
                      if (startTime > selectedTime) {
                        const difference = dayjs(startTime, "HH:mm").diff(
                          dayjs(selectedTime, "HH:mm"),
                          "minute"
                        );
                        if (
                          values?.services?.duration != undefined &&
                          values?.services?.duration <= difference
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      } else {
                        if (endTime > selectedTime) {
                          return false;
                        } else if (endTime == selectedTime) {
                          return true;
                        } else {
                          return true;
                        }
                      }
                    } else {
                      return true;
                    }
                  });
    
                  if (
                    confirmLocalAppointment.every((bool: boolean) => bool === true)
                  ) {
                    getAppointmentObject();
                  } else {
                    dispatch(
                      setDoubleAppointmentPopup({
                        heading: "Service Overlap Detected!",
                        title:
                          "This service time overlaps with another booked service in the same appointment.",
                      })
                    );
                  }
                }
               
            }
            );
          } else if (appointmentData?.length > 0) {
            {
              
              const confirmLocalAppointment = appointmentData?.map((i: any) => {
                const startTime = i?.empSvcBkgStartTime;
                const endTime = i?.empSvcBkgEndTime;
                const staffMember = i?.staffId;

                if (values?.staff?.id == staffMember) {
                  if (startTime > selectedTime) {
                    const difference = dayjs(startTime, "HH:mm").diff(
                      dayjs(selectedTime, "HH:mm"),
                      "minute"
                    );
                    if (
                      values?.services?.duration != undefined &&
                      values?.services?.duration <= difference
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    if (endTime > selectedTime) {
                      return false;
                    } else if (endTime == selectedTime) {
                      return true;
                    } else {
                      return true;
                    }
                  }
                } else {
                  return true;
                }
              });

              if (
                confirmLocalAppointment.every((bool: boolean) => bool === true)
              ) {
                getAppointmentObject();
              } else {
                dispatch(
                  setDoubleAppointmentPopup({
                    heading: "Service Overlap Detected!",
                    title:
                      "This service time overlaps with another booked service in the same appointment.",
                  })
                );
              }
            }
          } else {
            getAppointmentObject();
          }
        } else {
          dispatch(
            setDoubleAppointmentPopup({
              heading: "Out of Shift Timings!",
              title: "This time slot is outside the employee's shift hours.",
            })
          );
        }

        if (allSheduledData[0] == "absent") {
          dispatch(
            setDoubleAppointmentPopup({
              heading: "Absence of employee",
              title:
                "Appointment Scheduling Unavailable Due to Absence of employee",
            })
          );
        }
      }
    }
  }, [appointmentFilterData]);
  // const onAddAppointment = (values: AddAppointmentProps) => {
  //   if (values?.staff && values?.services && values?.startTime) {
  //     dispatch(
  //       fetchAppointmentTimeBlockAPI({
  //         companyId: companyId,
  //         date: dayjs(selectedDate).format("YYYY-MM-DD"),
  //         employeeId: values?.staff?.id,
  //       })
  //     );
  //   } else {
  //     dispatch(
  //       setShowAlert({
  //         message: "Select serice, time and staff",
  //         type: "error",
  //       })
  //     );
  //   }
  // };

  useEffect(() => {
    if (serviceListOptions?.length > 0) {
      let temp: ResponseServiceList[] = [];

      serviceListOptions?.forEach((i: any) => {
        if (i?.status == "active") {
          const filterList = i?.svcCtlgItems?.filter((j: any) => {
            return j?.status == "active";
          });
          temp?.push({ ...i, svcCtlgItems: filterList });
        }
      });
      setFilterServiceData(temp);
    }
  }, []);

  const {
    handleSubmit,
    handleReset,
    handleChange,
    values,
    handleBlur,
    setFieldValue,
    errors,
    touched,
    resetForm,
  } = formik;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="appointment-inputs-wrap">
          <GroupSelect
            name="services"
            onChange={(e: any, val: ServiceListItem) => {
              handleChange(e);
              setFieldValue("services", val);
              setDisableObj({
                time: false,
                staff: false,
              });
              dispatch(
                fetchEmployeeServiceRelationData({
                  companyId: companyId,
                  serviceId: val?.id,
                  status: "active",
                  isEmplPermanent: true,
                })
              );
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props} className="group-options">
                <Typography>{option?.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {format(parseFloat(option?.price))}
                </Typography>
              </Box>
            )}
            value={values?.services}
            error={touched?.services && errors?.services && errors?.services}
            options={filterServiceData}
            label={translateLabel(constantString.SELECT_SERVICE)}
            placeholder={translateLabel(constantString.SELECT_SERVICE)}
            mandatory
          />

          <TimePicker
            value={updateStartTime}
            name="startTime"
            disable={disableObj?.time}
            onChange={(value) => {
              setFieldValue("startTime", value, true);
              setUpdateStartTime(value);
            }}
            label={translateLabel(appointmentSuccessColumns.START_TIME)}
            error={touched?.startTime && errors?.startTime && errors?.startTime}
            // error={touched?.startTime && errors?.startTime}
            {...(minimumTime && { minTime: dayjs() })}
            mandatory
            timeSteps={true}
          />

          <div style={{ width: "-webkit-fill-available" }}>
            <MultiSelectAutoComplete
              label={translateLabel(constantString.SELECT_STAFF)}
              placeholder="Select Staff"
              option={staffListOptions
                .filter((emp: UserStaffs) => employeeIds?.includes(emp.id))
                .map((i: UserStaffs) => ({
                  ...i,
                  title: userName(i?.firstName, i?.lastName),
                }))}
              disabled={disableObj?.staff}
              onChange={(e, newValue) => {
                handleChange(e);
                setFieldValue("staff", newValue);
              }}
              value={
                values?.services
                  ? employeeIds?.includes(values?.staff?.id)
                    ? {
                        ...values?.staff,
                        title: userName(
                          values?.staff?.firstName,
                          values?.staff?.lastName
                        ),
                      }
                    : null
                  : values?.staff
                  ? {
                      ...values?.staff,
                      title: userName(
                        values?.staff?.firstName,
                        values?.staff?.lastName
                      ),
                    }
                  : null
              }
              error={touched.staff && errors.staff && errors.staff}
              onBlur={handleBlur}
              mandatory
            />
          </div>

          <button
            // type="submit"
            className="add-new mt-0"
            // onClick={(e) => {
            //   e.preventDefault();
            //   onAddAppointment(values);
            // }}
          >
            Add
          </button>
        </div>
      </form>
      <DoubleBookingAllowModal
        onCreateAppointment={() => {
          getAppointmentObject();
          dispatch(setDoubleAppointmentPopup(null));
        }}
      />
    </>
  );
};
