import { useEffect, useState } from "react";
import "./servicesStyle.css";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  ResponseServiceList,
  ServiceListItem,
} from "../../utils/types/responseType";
import { constantString } from "../../utils/constantString";
import {
  selectServiceList,
  selectShowCategoryModal,
  selectShowSubCategoryModal,
} from "../../redux/service/selector";
import { Search } from "../../components/search/Search";
import { setShowCategoryModal } from "../../redux/service/slice";
import AccordionList from "../../components/accordian/Accordion";
import AddCategoryModal from "../../components/add-category/AddCategoryModal";
import AddServiceModal from "../../components/add-sub-category/AddSubCategoryModal";
import { EmptyView } from "../../components/empty-view/EmptyView";
import { useTranslation } from "react-i18next";
import notFoundImage from "../../components/assets/not-found.png";
import {
  setFirstTimeUserGuide,
  setShowGuiderModal,
} from "../../redux/meta/slice";
import {
  selectFirstTimeUserGuidence,
  selectGuidenceModal,
} from "../../redux/meta/selector";
import { GuiderModal } from "../../components/guider-modal/GuiderModal";
import {
  categorySuccessData,
  serviceSuccessData,
} from "../../components/guider-modal/data";
import AddStaffModal from "../../components/add-staff/AddStaffModal";
import { selectEmployeeList, selectshowAddStaffModal } from "../../redux/staff/selector";
import { NavBar } from "../../components/nav-bar/NavBar";
import { useCompanyData } from "../../components/hooks/useCompanyData";
import translateLabel from "../../components/hooks/translationLable";
import { fetchServiceList } from "../../redux/service/action";

const Services = () => {
  const showCategoryModal = useAppSelector(selectShowCategoryModal);
  const showSubCategoryModal = useAppSelector(selectShowSubCategoryModal);
  const dispatch = useAppDispatch();
  const serviceData = useAppSelector(selectServiceList);
  const companyId = useCompanyData();
  const [filterServiceList, setFilterServiceList] = useState(serviceData);
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const showGuidenceModal = useAppSelector(selectGuidenceModal);
  const [serviceItemCount, setServiceItemCount] = useState(0);
  const showAddStaffModal = useAppSelector(selectshowAddStaffModal);
  const firstTimeUserGuide = useAppSelector(selectFirstTimeUserGuidence);
  const employeeList = useAppSelector(selectEmployeeList);


  // const [searchWithService, setSearchWithService] = useState<boolean>(false);

  useEffect(() => {
    setFilterServiceList(serviceData);
    let count = 0;
    serviceData?.forEach((i: ResponseServiceList) => {
      count =
        count +
        i?.svcCtlgItems?.filter((j: ServiceListItem) => {
          return j?.status != "delete";
        })?.length;
    });
    setServiceItemCount(count);
    if (serviceData?.length == 1 && count == 0) {
      dispatch(setShowGuiderModal(true));
    }
    if (serviceData?.length == 1 && count == 1 && firstTimeUserGuide.service && employeeList?.length == 0) {
      dispatch(setShowGuiderModal(true));
      dispatch(
        setFirstTimeUserGuide({ ...firstTimeUserGuide, service: false })
      );
    }
  }, [serviceData]);

  useEffect(() => {
    dispatch(fetchServiceList({ id: companyId }));
  }, [])
  

  // useEffect(() => {
  //   dispatch(fetchServiceList({ id: company_id }));
  // }, []);

  const onHandleSearch = (val: string) => {
    const inputValueLowerCase = val.toLowerCase();
    if (val?.length == 0) {
      setFilterServiceList(serviceData);
      // }
      //  else if (searchWithService) {
      //   let temp: ResponseServiceList[] = [];

      //   serviceData?.map((categoryItem: ResponseServiceList) => {
      //     const test = categoryItem?.svcCtlgItems?.filter((serviceItem) => {
      //       return (
      //         serviceItem?.title?.toLowerCase().includes(inputValueLowerCase) ||
      //         categoryItem?.title?.toLowerCase().includes(inputValueLowerCase)
      //       );
      //     });
      //     if (test?.length > 0) {
      //       temp?.push({
      //         ...categoryItem,
      //         svcCtlgItems: test,
      //       });
      //     }
      //   });
      //   setFilterServiceList(temp);
      //   setSearchText(val);
    } else {
      // const filteredArray = serviceData?.filter((item: ResponseServiceList) =>
      //   item.title.toLowerCase().includes(inputValueLowerCase)
      // );
      // setFilterServiceList(filteredArray);
      // setSearchText(val);

      let temp: ResponseServiceList[] = [];

      serviceData?.map((categoryItem: ResponseServiceList) => {
        const test = categoryItem?.svcCtlgItems?.filter((serviceItem) => {
          return (
            serviceItem?.title?.toLowerCase().includes(inputValueLowerCase) ||
            categoryItem?.title?.toLowerCase().includes(inputValueLowerCase)
          );
        });
        if (test?.length > 0) {
          temp?.push({
            ...categoryItem,
            svcCtlgItems: test,
          });
        }
      });
      setFilterServiceList(temp);
      setSearchText(val);
    }
  };

  return (
    <>
      <div className="container">
        <NavBar
          leftPart={
            <div className="wrap-search-check-box">
              <div className="search-service-wrap">
                <Search
                  name="search"
                  placeholder={translateLabel(constantString.SEARCH_CATEGORY)}
                  handleOnChange={(e: any) => {
                    onHandleSearch(e.target.value.trim());
                  }}
                />
              </div>
              {/* <div className="wrap--service-check-box">
                <Checkbox
                  edge="start"
                  checked={searchWithService}
                  tabIndex={-1}
                  disableRipple
                  onChange={(e) => {
                    setSearchWithService(e?.target?.checked);
                  }}
                />
                <p className="search-text">Search with Service</p>
              </div> */}
            </div>
          }
          rightPart={
            <Button
              variant="outlined"
              className="outline-btn"
              onClick={() => dispatch(setShowCategoryModal(true))}
            >
              {t(constantString.ADD_NEW_CATEGORY)}
            </Button>
          }
        />

        <div className="wrap-services">
          {filterServiceList?.length > 0 ? (
            filterServiceList?.map(
              (item: ResponseServiceList, index: number) => {
                return <AccordionList key={"list-item " + index} item={item} />;
              }
            )
          ) : (
            <EmptyView
              src={notFoundImage}
              text={t(constantString.ADD_NEW_CATEGORY)}
              title={
                searchText
                  ? // searchWithService
                    //   ?
                    `${translateLabel(constantString.NO_SEARCH)} ${searchText}.`
                  : // : "No category found by the search name."
                    translateLabel(constantString.NO_CATEGORY)
              }
              onHandleClick={() => {
                dispatch(setShowCategoryModal(true));
              }}
            />
          )}
        </div>
      </div>

      {showCategoryModal && <AddCategoryModal open={showCategoryModal} />}
      {showSubCategoryModal && <AddServiceModal open={showSubCategoryModal} />}

      {showGuidenceModal && (
        <GuiderModal
          open={showGuidenceModal}
          data={
            serviceItemCount == 0 ? categorySuccessData : serviceSuccessData
          }
        />
      )}

      {showAddStaffModal && <AddStaffModal open={showAddStaffModal} />}
    </>
  );
};

export default Services;
