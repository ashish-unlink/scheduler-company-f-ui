import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  selectFirstTimeUserGuidence,
  selectShowTourGuidence,
} from "../../redux/meta/selector";
import { selectEmployeeList } from "../../redux/staff/selector";
import CircularLoader from "../../components/loading/CircularLoader";
import TourGuide from "../../components/toor-guide/ToorGuide";
import {
  setFirstTimeUserGuide,
  setShowTourGuidence,
} from "../../redux/meta/slice";
import {
  selectAppointmentApiData,
  selectSuccessedAppointmentLoading,
} from "../../redux/appointment/selector";
import { HomeChart, optionsA, optionsB } from "../../components/charts/HomeChart";
import { PieChart } from "../../components/charts/PieChart";
import { fetchAppointmentAPI } from "../../redux/appointment/action";
import dayjs from "dayjs";
import Stats from "../../components/charts/Stats";
import { useCompanyData } from "../../components/hooks/useCompanyData";
import {
  ResponseAppointment,
  ResponseServiceList,
  ServiceBookedAppointment,
  ServiceListItem,
  UserStaffs,
} from "../../utils/types/responseType";
import { fetchEmployeeServiceRelationData } from "../../redux/staff/action";
import { selectDataCounts } from "../../redux/auth/selector";
import { selectServiceList } from "../../redux/service/selector";
import translateLabel from "../../components/hooks/translationLable";
import { constantString } from "../../utils/constantString";

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectShowTourGuidence);
  const employeeList = useAppSelector(selectEmployeeList);
  const isLoading = useAppSelector(selectSuccessedAppointmentLoading);
  const firstTimeUserGuide = useAppSelector(selectFirstTimeUserGuidence);
  const companyId = useCompanyData();
  const appointmentData = useAppSelector(selectAppointmentApiData);
  const countData = useAppSelector(selectDataCounts);
  const serviseList = useAppSelector(selectServiceList);
  const [employeeAppointmentCount, setEmployeeAppointmentCount] = useState<{
    [key: string]: number;
  }>({});
  const [serviceCount, setServiceCount] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    dispatch(
      fetchAppointmentAPI({
        companyId: companyId,
        appointmentDate: dayjs(new Date()).format("YYYY-MM-DD"),
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      fetchEmployeeServiceRelationData({
        companyId: companyId,
        employeeId: employeeList?.[0]?.id,
      })
    );
  }, [employeeList]);

  useEffect(() => {
    if (
      countData?.bussinessSetUpDataCount == 0 || 
      countData?.employeeCount == 0 ||
      countData?.serviceCount == 0 ||
      countData?.appointmentCount == 0
    ) {
      dispatch(setShowTourGuidence(true));
      dispatch(
        setFirstTimeUserGuide({ ...firstTimeUserGuide, dashboard: false })
      );
    }
  }, [countData]);

  const getTopSevenData = (dataCounts: { [key: string]: number }) => {
    let appointmentsArray = Object.entries(dataCounts);
    appointmentsArray.sort((a, b) => b[1] - a[1]);

    let sortedAppointments = Object.fromEntries(appointmentsArray.slice(0, 7));
    return sortedAppointments;
  };

  const countEmployeeAppointments = () => {
    const employeeCounts: { [key: string]: number } = {};
    appointmentData?.forEach((ap: ResponseAppointment) => {
      ap?.servicesBooked?.forEach((service: ServiceBookedAppointment) => {
        const empId = service?.employeeBookedId;
        employeeCounts[empId] = (employeeCounts[empId] || 0) + 1;
      });
    });
    return getTopSevenData(employeeCounts);
  };

  const countServiceAppointments = () => {
    const serviceCount: { [key: string]: number } = {};
    appointmentData?.forEach((ap: ResponseAppointment) => {
      ap?.servicesBooked?.forEach((service: ServiceBookedAppointment) => {
        const srvId = service.svcCtlgItemsId;
        serviceCount[srvId] = (serviceCount[srvId] || 0) + 1;
      });
    });
    return getTopSevenData(serviceCount);
  };

  useEffect(() => {
    const data = countEmployeeAppointments();
    setEmployeeAppointmentCount(data);

    const srvdata = countServiceAppointments();
    setServiceCount(srvdata);
  }, [appointmentData, employeeList]);

  const getEmployeeList = (type: string) => {
    if (employeeAppointmentCount) {
      let data: string[] = [];
      let count: number[] = [];
      employeeList?.forEach((i: UserStaffs) => {
        if (employeeAppointmentCount.hasOwnProperty(i.id)) {
          data?.push(i?.firstName);
          count?.push(employeeAppointmentCount[i?.id]);
        }
      });
      if (type == "label") {
        return data;
      } else {
        return count;
      }
    } else {
      const data = employeeList.map((i: UserStaffs) => {
        return i?.firstName;
      });
      return data;
    }
  };

  const getServiceList = (type: string) => {
    if (serviceCount) {
      let data: string[] = [];
      let count: number[] = [];

      serviseList?.forEach((i: ResponseServiceList) => {
        i?.svcCtlgItems?.forEach((j: ServiceListItem) => {
          if (serviceCount.hasOwnProperty(j.id)) {
            data?.push(i?.title);
            count?.push(serviceCount[j?.id]);
          }
        });
      });

      if (type == "label") {
        return data;
      } else {
        return count;
      }
    } else {
      const data = employeeList.map((i: UserStaffs) => {
        return i?.lastName;
      });
      return data;
    }
  };

  const teamGraphData = {
    labels: getEmployeeList("label"),
    datasets: [
      {
        label: translateLabel(constantString.TEAM_MEMBER),
        data: getEmployeeList("dataSet"),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const serviceGraphData = {
    labels: getServiceList("label"),
    datasets: [
      {
        label: translateLabel(constantString.SERVICES),
        data: getServiceList("dataSet"),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    // <Suspense fallback={<Loader />}>
    <>
      {isLoading && <CircularLoader />}
      <div className="scheduler-container dashboard-container">
        <div className="scheduler-stats">
          <Stats />
        </div>
        <div className="scheduler-charts">
          <div className="chasts-lst">
            <HomeChart data={teamGraphData} options={optionsA} />
          </div>
          <div className="chasts-lst pie-chart-wrap">
            {appointmentData?.length > 0 ? (
              <PieChart />
            ) : (
              <div className="no-data-appointment">
                <div> {t(constantString.TODAYS_APPOINTMENT)}</div>
                <div className="NoData">{t(constantString.NO_APPOINTMENTS)}</div>
              </div>
            )}
          </div>
          <div className="chasts-lst">
            <HomeChart data={serviceGraphData} options={optionsB} />
          </div>
        </div>
      </div>

      {/* <UserGuidence open={open} /> */}
      <TourGuide open={open} />
      {/* <SetUpBussinessModal open={open} /> */}
    </>
    // </Suspense>
  );
};

export default Home;
