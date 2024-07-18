import dayjs, { Dayjs } from "dayjs";
import {
  Comments,
  ResponseAppointment,
  ResponseBussinessList,
  ResponseServiceList,
  ServiceBookedAppointment,
} from "./types/responseType";
import { regx } from "./regx";
import { EditAppointmentFormProps } from "./types/dataTypes";
import { setShowAlert } from "../redux/meta/slice";
import store from "../redux";
import { messages } from "./messages";
import translateLabel from "../components/hooks/translationLable";

export const formatDuration = (value: number) => {
  const totalSeconds = value * 60;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  return [`${hours}hr`, `${minutes}min`, `${seconds}sec`]
    .filter((item) => item[0] !== "0")
    .join(" ");
};

export const onHandleSearch = (val: string, item: any) => {
  if (val?.length == 0) {
    return item;
  } else {
    const inputValueLowerCase = val.toLowerCase();
    const filteredArray = item?.filter((i: any) =>
      i.title.toLowerCase().includes(inputValueLowerCase.toLowerCase())
    );
    return filteredArray;
  }
};

export const calculateEndTime = (time: string, minutes: number) => {
  const [hoursStr, minutesStr] = dayjs(time).format("HH:mm").split(":");
  let hours = parseInt(hoursStr);
  let newMinutes = parseInt(minutesStr) + minutes;

  hours += Math.floor(newMinutes / 60);
  newMinutes %= 60;
  hours %= 24;

  const newHoursStr = String(hours).padStart(2, "0");
  const newMinutesStr = String(newMinutes).padStart(2, "0");

  return `${newHoursStr}:${newMinutesStr}:00`;
};

export const getFormattedDateTime = (date: string, time: string) => {
  const datetimeString = `${date} ${time}`;
  const dateTimeObject = new Date(datetimeString);

  const formattedDateTime = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(dateTimeObject);

  return formattedDateTime;
};

export const getFormattedDate = (date: string) => {
  if (date) {
    const datetimeString = `${date}`;
    const dateTimeObject = new Date(datetimeString);
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateTimeObject);

    return formattedDateTime;
  }
};

export const capitilizeName = (text: string) => {
  return text?.charAt(0)?.toUpperCase() + text?.slice(1);
};

export const userName = (firstName: string, lastName: string) => {
  return `  ${capitilizeName(lastName)} ${capitilizeName(firstName)}`;
};

export const appointmentObject = (item: ResponseAppointment) => {
  const data = item?.servicesBooked?.map(
    (element: ServiceBookedAppointment) => {
      return {
        appointmentId: item?.id,
        id: element?.id,
        title: userName(item?.client?.firstName, item?.client?.lastName),
        employeeName: userName(
          element?.employeeBookedData?.firstName,
          element?.employeeBookedData?.lastName
        ),
        staffs: [element?.employeeBookedData?.id],
        comments: item?.comments,
        status: item?.status,
        apptStatus: item?.apptStatus,
        client: item?.client,
        serviceDataArr: shortArrayByTime(item?.servicesBooked),
        serviceName: element?.svcCtlgItemsData?.title,
        price: parseInt(element?.svcCtlgItemsData?.price ?? ""),
        startDate: new Date(
          dayjs(
            getFormattedDateTime(
              item?.appointmentDate,
              element?.empSvcBkgStartTime
            )
          ).format("YYYY-MM-DD HH:mm")
        ),
        endDate: new Date(
          dayjs(
            getFormattedDateTime(
              item?.appointmentDate,
              element?.empSvcBkgEndTime
            )
          ).format("YYYY-MM-DD HH:mm")
        ),
      };
    }
  );
  return data;
};

export const shortArrayByTime = (data: ServiceBookedAppointment[]) => {
  const sortedData = data?.slice()?.sort((a: any, b: any) => {
    const timeA = a?.empSvcBkgStartTime?.split(":").map(Number);
    const timeB = b?.empSvcBkgStartTime?.split(":").map(Number);
    if (timeA?.[0] !== timeB?.[0]) {
      return timeA?.[0] - timeB?.[0];
    }
    return timeA?.[1] - timeB?.[1];
  });

  return sortedData;
};

export const formateTime = (date: any) => {
  const hours = date?.getHours().toString().padStart(2, "0");
  const minutes = date?.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const convertPrice = (price: string) => {
  const parts = price?.split(".");
  return parts[0];
};

export const fetchAppointmentList = (data: ResponseAppointment[]) => {
  let temp: any = [];

  data?.forEach((item: ResponseAppointment) => {
    const tempData = appointmentObject(item);
    temp?.push(...tempData);
  });

  return temp;
};

export const camelCaseToSpaceCase = (camelCaseString: string) => {
  return camelCaseString.replace(regx.camel_space_case, " $1").trim();
};

export const convertSeconds = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(":");
  return `${hours}:${minutes}:00`;
};

export const getHourAndMinuteFromString = (
  businessOpenEndTime: ResponseBussinessList[]
) => {
  if (businessOpenEndTime?.[0]?.prefKey == "startTime") {
    const [openHours, openMin] =
      businessOpenEndTime?.[0]?.prefValue?.split(":");
    const [endHours, endMin] = businessOpenEndTime?.[1]?.prefValue?.split(":");
    return { openHours, endHours };
  } else {
    const [openHours, openMin] =
      businessOpenEndTime?.[1]?.prefValue?.split(":");
    const [endHours, endMin] = businessOpenEndTime?.[0]?.prefValue?.split(":");
    return { openHours, endHours };
  }
};

export const getNextPreviousWeekDate = (date: Dayjs) => {
  const currentDate = dayjs(date);
  const monday = currentDate.startOf("week").format("YYYY-MM-DD");
  const sunday = currentDate.endOf("week").format("YYYY-MM-DD");

  return { monday, sunday };
};

export const sortComments = (comments: Comments[]) => {
  let data = [...comments]?.sort((a: Comments, b: Comments) => {
    const aDate = dayjs(a?.createdAt);
    const bDate = dayjs(b?.createdAt);
    if (aDate?.isBefore(bDate)) return 1;
    if (aDate?.isAfter(bDate)) return -1;
    return 0;
  });
  return data;
};

export const checkMessage = (error: any) => {
  store.dispatch(
    setShowAlert({ message: error.response?.data?.message, type: "error" })
  );
  // if (error?.response?.data?.messageCode) {
  //   store.dispatch(
  //     setShowAlert({
  //       message: translateLabel(
  //         messages?.[error.response?.data?.messageCode]?.message
  //       ),
  //       type: "error",
  //     })
  //   );
  // } else if (error?.response?.data?.success == false) {
  //   if (typeof error?.response?.data?.message === "string") {
  //     store.dispatch(
  //       setShowAlert({
  //         message: translateLabel(error?.response?.data?.message),
  //         type: "error",
  //       })
  //     );
  //   } else if (Array.isArray(error?.response?.data?.message)) {
  //     if (
  //       error?.response?.data?.message.length > 0 &&
  //       error?.response?.data?.message?.length == 1
  //     ) {
  //       store.dispatch(
  //         setShowAlert({
  //           message: translateLabel(error?.response?.data?.message),
  //           type: "error",
  //         })
  //       );
  //     } else {
  //       store.dispatch(
  //         setShowAlert({
  //           message: translateLabel(error?.response?.data?.message),
  //           type: "error",
  //         })
  //       );
  //     }
  //     store.dispatch(
  //       setShowAlert({
  //         message: translateLabel(error?.response?.data?.message),
  //         type: "error",
  //       })
  //     );
  //   }
  // }
};

export const getActiveService = (serviceListOptions: ResponseServiceList[]) => {
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
    return temp;
  }
};

export const getBussinessSetUpData = (
  bussinessSetData: ResponseBussinessList[]
) => {
  const companyPreference = bussinessSetData?.reduce(
    (
      prefs: any,
      {
        prefKey,
        prefValue,
        id,
      }: { prefKey: string; prefValue: string; id: string }
    ) => {
      if (prefKey.includes("startTime"))
        prefs.startTime = { id: id, value: prefValue };
      if (prefKey.includes("endTime"))
        prefs.endTime = { id: id, value: prefValue };
      if (prefKey.includes("dasmid"))
        prefs.dasmid = { id: id, value: prefValue };
      if (prefKey.includes("secret"))
        prefs.secretKey = { id: id, value: prefValue };
      if (prefKey.includes("currency"))
        prefs.currency = { id: id, value: prefValue };
      if (prefKey.includes("gatewayurl"))
        prefs.gatewayurl = { id: id, value: prefValue };
      if (prefKey.includes("xapikey"))
        prefs.xapikey = { id: id, value: prefValue };

      return prefs;
    },
    {
      dasmid: {},
      startTime: {},
      endTime: {},
      secretKey: {},
      currency: {},
      gatewayurl: {},
      xapikey: {},
    }
  );

  return companyPreference;
};
