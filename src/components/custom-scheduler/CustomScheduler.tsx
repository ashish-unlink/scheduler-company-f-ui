import React, { useEffect, useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import {
  ViewState,
  GroupingState,
  IntegratedGrouping,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Resources,
  Appointments,
  AppointmentTooltip,
  GroupingPanel,
  DayView,
} from "@devexpress/dx-react-scheduler-material-ui";
import { DeleteOutline } from "@mui/icons-material";
import { classes } from "./components/classes";
import dayjs from "dayjs";
import "./style.css";
import CustomPopup from "../../custom-popup/CustomPopup";
import { customerSendSuccessfully } from "../custom-appointment-popup/style";
import { useAppDispatch, useAppSelector } from "../../redux";
import { selectRecentlyAddedCustomer } from "../../redux/users/selector";
import { selectCustomerEmailOTP } from "../../redux/auth/selector";
import { constantString } from "../../utils/constantString";
import CustomerAppointmentModal from "../custom-appointment-popup/CustomerAppointmentModal";
import {
  resetAppointment,
  setAppointmentData,
  setCreateAppData,
  setEditAppointmentForm,
  setEmployeeLeaveStatus,
  setSelectedAppointmentEditData,
  setSelectedClient,
  setShowAppointmentSuccess,
  setShowCustomerAppointmentModal,
  setSuccessAppointmentData,
  setUpdateAppointmentId,
} from "../../redux/appointment/slice";
import {
  selectAppointmentFilterData,
  selectCalenderAppointmentDate,
  selectCreateAppData,
  selectData,
  selectDuplicateSuccessAppointmentData,
  selectEmployeeLeaveStatus,
  selectOpenQrModal,
  selectShowAppointmnetSuccess,
  selectShowCustomerAppointmnetModal,
  selectSuccessedAppointmentData,
  selectSuccessedAppointmentLoading,
  selectUpdateAppointmentId,
} from "../../redux/appointment/selector";
import {
  selectEmployeeList,
  selectServiceEmployeeRelationList,
} from "../../redux/staff/selector";
import { Box, Button } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useTranslation } from "react-i18next";
import {
  ResopnseAppointmentBlockData,
  ResponseAppointment,
  ResponseServiceList,
  ResponseServiceStaffRelation,
  ServiceListItem,
  UserStaffs,
} from "../../utils/types/responseType";
import AppointmentDetails from "./components/appointment-details/AppointmentDetails";
import {
  appointmentObject,
  capitilizeName,
  convertSeconds,
  getActiveService,
  userName,
} from "../../utils/general";
import Typography from "@mui/material/Typography";
import CircularLoader from "../loading/CircularLoader";
import {
  selectBusinessSeteTime,
  selectShowTourGuidence,
} from "../../redux/meta/selector";
import { setShowTourGuidence } from "../../redux/meta/slice";
import { selectServiceList } from "../../redux/service/selector";
import TourGuide from "../toor-guide/ToorGuide";
import { CurrentTimeIndicator } from "@devexpress/dx-react-scheduler-material-ui";
import {
  fetchAppointmentAPI,
  fetchAppointmentTimeBlockAPI,
} from "../../redux/appointment/action";
import { PopupMessage } from "../popup-message/PopupMessage";
import { useCompanyData } from "../hooks/useCompanyData";
import StyledCell from "./components/StyledCell";
import { GroupSelect } from "../group-select/GroupSelect";
import translateLabel from "../hooks/translationLable";
import { setServiceStaffRelationList } from "../../redux/staff/slice";
import { MultiSelectAutoComplete } from "../user-list-dropdown";
import { fetchEmployeeServiceRelationData } from "../../redux/staff/action";
import { useCountyPrice } from "../hooks/useCountyPrice";
import QrCode from "../qr-code/QrCode";
const CustomScheduler = () => {
  const openOtpPopup: boolean = useAppSelector(selectCustomerEmailOTP);
  const recentlyAddedCustomer = useAppSelector(selectRecentlyAddedCustomer);
  const selectedDate = useAppSelector(selectCalenderAppointmentDate);
  const staffMembers = useAppSelector(selectEmployeeList);
  const isLoading = useAppSelector(selectSuccessedAppointmentLoading);
  const openGuiderModal = useAppSelector(selectShowTourGuidence);
  const serviceList = useAppSelector(selectServiceList);
  const serviceEmployeeRelation = useAppSelector(
    selectServiceEmployeeRelationList
  );
  const companyId = useCompanyData();
  const businessOpenEndTime = useAppSelector(selectBusinessSeteTime);

  const showAppointmentSuccessModal = useAppSelector(
    selectShowAppointmnetSuccess
  );
  const showCustomerAppModal = useAppSelector(
    selectShowCustomerAppointmnetModal
  );
  const showSuccessedAppData: ResponseAppointment = useAppSelector(
    selectSuccessedAppointmentData
  );
  const duplicateSucessedData: ResponseAppointment = useAppSelector(
    selectDuplicateSuccessAppointmentData
  );
  const employeeLeaveStatus: string[] = useAppSelector(
    selectEmployeeLeaveStatus
  );
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  const createAppData = useAppSelector(selectCreateAppData);
  const selectedUpdateAppointmetId = useAppSelector(selectUpdateAppointmentId);
  const [employeeIds, setUpdatedStaffList] = useState<string[]>([]);
  const [filterServiceData, setFilterServiceData] = useState<
    ResponseServiceList[]
  >([]);
  const { format } = useCountyPrice();
  const selectFilterData = useAppSelector(selectAppointmentFilterData);
  const generateQR = useAppSelector(selectOpenQrModal);

  useEffect(() => {
    const ids = serviceEmployeeRelation?.map(
      (rel: ResponseServiceStaffRelation) => rel?.employeeId
    );
    setUpdatedStaffList(ids);
  }, [serviceEmployeeRelation]);

  useEffect(() => {
    dispatch(setServiceStaffRelationList([]));
  }, []);

  const resources = [
    {
      fieldName: "staffs",
      title: "Staff",
      instances:
        employeeIds?.length > 0
        ? staffMembers?.filter((i: UserStaffs) => {
            return (
              employeeIds?.includes(i?.id) &&
              i?.isEmplPermanent === true &&
              i?.status === "active" &&
              !employeeLeaveStatus?.includes(i?.id)
            );
          }) || []
        : staffMembers?.filter((i: UserStaffs) => {
            return (
              i?.isEmplPermanent === true &&
              i?.status === "active" &&
              !employeeLeaveStatus?.includes(i?.id)
            );
          }) || [],

      allowMultiple: true,
    },
  ];

  useEffect(() => {
    if (!isLoading && staffMembers?.length == 0 && serviceList?.length == 0) {
      dispatch(setShowTourGuidence(true));
    }
  }, [isLoading]);

  useEffect(() => {
    dispatch(
      fetchAppointmentAPI({
        companyId: companyId,
        appointmentDate: dayjs(new Date()).format("YYYY-MM-DD"),
      })
    );
    dispatch(
      fetchAppointmentTimeBlockAPI({
        companyId: companyId,
        date: dayjs().format("YYYY-MM-DD"),
      })
    );
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      let temp: any = [];

      data?.forEach((item: any) => {
        if (item?.status == "pending" || item?.status == "completed") {
          const tempData = appointmentObject(item);
          temp?.push(...tempData);
        }
      });
      dispatch(setCreateAppData(temp));
    }
  }, [data]);

  useEffect(() => {
    if (selectFilterData?.length > 0) {
      var temp: string[] = [];
      selectFilterData.forEach((item: ResopnseAppointmentBlockData) => {
        if (item?.status == "leave" && item?.apptBkgData == null) {
          temp?.push(item?.employeeId);
        }
      });
      dispatch(setEmployeeLeaveStatus(temp));
    }
  }, [selectFilterData]);

  useEffect(() => {
    if (showSuccessedAppData != null) {
      const cloneArr = [...createAppData];
      if (selectedUpdateAppointmetId != "") {
        if (showSuccessedAppData?.status == "pending") {
          const removeOldServices = cloneArr?.filter((i) => {
            return i?.appointmentId != selectedUpdateAppointmetId;
          });
          const temp = appointmentObject(showSuccessedAppData);
          dispatch(setCreateAppData([...removeOldServices, ...temp]));
        } else {
          const removeOldServices = cloneArr?.filter((i) => {
            return i?.appointmentId != selectedUpdateAppointmetId;
          });
          dispatch(setCreateAppData(removeOldServices));
        }
      } else {
        const temp = appointmentObject(showSuccessedAppData);
        const newArr = [...createAppData, ...temp];
        dispatch(setCreateAppData(newArr));
      }
    }
  }, [showSuccessedAppData]);

  // tooltip appointment  .......
  const Header = (props: any) => {
    const { appointmentData, ...restProps } = props;
    return (
      <div className="appointment-tooltip-wrap">
        <Typography className="appointment-tooltip-text">
          {appointmentData.serviceName}
        </Typography>
        <div className="appointment-tooltip-actions">
          <Button
            onClick={() => {
              const temp = appointmentData?.serviceDataArr?.map((item: any) => {
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
                  startDate: dayjs(appointmentData?.startDate).format(
                    "DD-MM-YYYY"
                  ),
                  empSvcBkgStartTime: item?.empSvcBkgStartTime,
                  empSvcBkgEndTime: item?.empSvcBkgEndTime,
                };
              });
              dispatch(setAppointmentData(temp));
              dispatch(
                setEditAppointmentForm({
                  status: appointmentData?.status,
                  comments: appointmentData?.comments,
                  apptStatus: appointmentData?.apptStatus,
                })
              );
              dispatch(setUpdateAppointmentId(appointmentData?.appointmentId));
              dispatch(setSelectedClient(appointmentData?.client));
              dispatch(setShowCustomerAppointmentModal(true));

              props?.onHide();
            }}
          >
            <ModeEditIcon fontSize="medium" />
          </Button>
          {/* <Button onClick={() => console.log("Delete clicked")}>
            <DeleteOutline />
          </Button> */}
        </div>
      </div>
    );
  };

  const onCellClick = (props: any) => {
    const updateStartTime = convertSeconds(
      dayjs(props?.startDate).format("DD/MM/YYYY, HH:mm:ss")
    );

    dispatch(setShowCustomerAppointmentModal(true));
    dispatch(
      setSelectedAppointmentEditData({
        staff: [
          {
            firstName: props?.groupingInfo[0]?.text,
            id: props?.groupingInfo[0]?.id,
            value: props?.groupingInfo[0]?.text,
          },
        ],
        staffId: props.groupingInfo[0].id,
        staffIndex: staffMembers?.findIndex((i: any) => {
          return i?.id == props?.groupingInfo[0]?.id;
        }),
        startTime: dayjs(updateStartTime, "DD/MM/YYYY, HH:mm:ss"),
        endTime: dayjs(props.startDate).add(0, "minute"),
        // startDate: selectedDate,
      })
    );
    dispatch(setSuccessAppointmentData(null));
  };

  const GroupingPanelCell = React.memo((props: any) => {
    const { group, ...restProps } = props;

    return (
      <StyledCell
        className={classes.headerCell}
        group={group}
        {...restProps}
      ></StyledCell>
    );
  });

  useEffect(() => {
    const data = getActiveService(serviceList);
    setFilterServiceData(data ?? []);
  }, []);

  const renderStaffDropDown = useMemo(() => {
    return (
      <MultiSelectAutoComplete
        label={translateLabel(constantString.SELECT_STAFF)}
        placeholder="Search Staffs.."
        option={staffMembers?.map((i: UserStaffs) => {
          return {
            ...i,
            title: userName(i?.firstName, i.lastName),
          };
        })}
        onChange={(e, newValue) => {
          const ids = newValue?.map((rel: UserStaffs) => rel?.id);
          setUpdatedStaffList(ids);
        }}
        multiple={true}
      />
    );
  }, []);

  const renderServiceDropDown = useMemo(() => {
    return (
      <GroupSelect
        name="services"
        onChange={(e: any, val: ServiceListItem) => {
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
        value=""
        options={filterServiceData}
        label={translateLabel(constantString.SELECT_SERVICE)}
        placeholder={translateLabel(constantString.SELECT_SERVICE)}
      />
    );
  }, [filterServiceData]);

  return (
    <Paper className="paper-wrap">
      {isLoading && <CircularLoader />}
      <div className="wrap-filters-calender">
        <div className="wrap-calender-drop-down">{renderServiceDropDown}</div>
        <div className="wrap-calender-drop-down">{renderStaffDropDown}</div>
      </div>
      {staffMembers?.length > 0 && resources?.[0]?.instances?.length > 0 ? (
        <Scheduler height={580} data={createAppData}>
          <ViewState currentDate={new Date(selectedDate)} />
          <GroupingState />
          <DayView
            // startDayHour={parseInt(businessOpenEndTime?.open)}
            // endDayHour={parseInt(businessOpenEndTime?.close)}
            startDayHour={0}
            endDayHour={24}
            intervalCount={1}
            dayScaleCellComponent={() => {
              return <></>;
            }}
            timeTableCellComponent={(props) => {
              const { ...rest } = props;
              const afterTime = dayjs(props?.startDate).isAfter(new Date());
              return (
                <DayView.TimeTableCell
                  {...props}
                  {...(afterTime && {
                    onDoubleClick: () => onCellClick(props),
                  })}
                />
              );
            }}
          />
          <Appointments />
          <AppointmentTooltip
            showOpenButton
            showCloseButton
            headerComponent={Header}
          />
          <CurrentTimeIndicator
            shadePreviousCells={true}
            shadePreviousAppointments={true}
            updateInterval={1000}
          />
          <Resources data={resources} mainResourceName="staffs" />
          <IntegratedGrouping />
          <GroupingPanel cellComponent={GroupingPanelCell} />
        </Scheduler>
      ) : (
        // <UserGuidence open={openGuiderModal} />
        <TourGuide open={openGuiderModal} />
      )}

      {showCustomerAppModal && (
        <CustomerAppointmentModal
          open={showCustomerAppModal}
          onClose={() => {
            dispatch(resetAppointment());
            dispatch(setUpdateAppointmentId(""));
            // dispatch(setSelectedCalenderAppointmentDate(dayjs(new Date())));
            dispatch(setShowCustomerAppointmentModal(false));
            dispatch(setServiceStaffRelationList([]));
            dispatch(setEditAppointmentForm(null));
            dispatch(setSelectedClient(null));
          }}
        />
      )}

      {/* Appointment Completed Popup */}
      {showAppointmentSuccessModal &&
        (duplicateSucessedData?.status == "pending" ? (
          <AppointmentDetails
            appointment={duplicateSucessedData}
            open={showAppointmentSuccessModal}
            onClose={() => {
              dispatch(setShowAppointmentSuccess(false));
            }}
          />
        ) : duplicateSucessedData?.status == "completed" ? (
          <PopupMessage
            open={showAppointmentSuccessModal}
            onClose={() => {
              dispatch(setShowAppointmentSuccess(false));
            }}
            heading="Thanks!"
            title="The Appointment has been successfully completed."
          />
        ) : duplicateSucessedData?.status == "canceled" ? (
          <PopupMessage
            open={showAppointmentSuccessModal}
            onClose={() => {
              dispatch(setShowAppointmentSuccess(false));
            }}
            heading="Cancel!"
            title="The Appointment has been cancelled."
          />
        ) : duplicateSucessedData?.status == "clientrejected" ? (
          <PopupMessage
            open={showAppointmentSuccessModal}
            onClose={() => {
              dispatch(setShowAppointmentSuccess(false));
            }}
            heading="Client Rejected!"
            title="The Appointment has been marked as Client Rejected."
          />
        ) : (
          <PopupMessage
            open={showAppointmentSuccessModal}
            onClose={() => {
              dispatch(setShowAppointmentSuccess(false));
            }}
            heading="Client No Show!"
            title="The Appointment has been marked as no show."
          />
        ))}

      {generateQR && <QrCode QrCodeLink={generateQR} />}
    </Paper>
  );
};

export default CustomScheduler;
