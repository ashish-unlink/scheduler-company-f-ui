import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux";
import {
  selectAppointmentInvoice,
  selectOpenQrModal,
  selectOpenTransaction,
  selectSuccessedAppointmentLoading,
} from "../../redux/appointment/selector";
import { NavBar } from "../../components/nav-bar/NavBar";
import SearchPopup from "../../components/search-popup/SearchPopup";
import {  selectShowSearch } from "../../redux/meta/selector";
import { useCountyPrice } from "../../components/hooks/useCountyPrice";
import CircularLoader from "../../components/loading/CircularLoader";
import { LuUserPlus2 } from "react-icons/lu";
import { Invoice } from "../../components/invoice/Invoice";
import { SlGraph } from "react-icons/sl";
import { GrCatalog } from "react-icons/gr";
import { HiOutlineUsers } from "react-icons/hi2";
import MenuTabs from "../../components/tabs/MenuTabs";
import { AllAppointmentsReport } from "../../components/reports/AllAppointments";
import { SalesByServiceReport } from "../../components/reports/SalesByService";
import { SalesByStaffReport } from "../../components/reports/SalesByStaff";
import { SalesByCustomerReport } from "../../components/reports/SalesByCustomer";
import { PaymentTransactionModal } from "../../components/transaction-modal/PaymentTransactionModal";
import translateLabel from "../../components/hooks/translationLable";
import { constantString } from "../../utils/constantString";
import QrCode from "../../components/qr-code/QrCode";

const AnalyticsReport = () => {
  const { t } = useTranslation();
  const showSearch = useAppSelector(selectShowSearch);
  const isLoading = useAppSelector(selectSuccessedAppointmentLoading);
  const appointmentInvoice = useAppSelector(selectAppointmentInvoice);
  const appointmentPaymentTransaction = useAppSelector(selectOpenTransaction);
  const [selectedTab, setSelectedTab] = useState(0);
  const generateQR = useAppSelector(selectOpenQrModal);

  const options = [
    {
      label: translateLabel(constantString.ALL_APPOINTMENT),
      icon: <SlGraph />,
      value: "all appointmnet",
      title: translateLabel(constantString.ALL_APPOINTMENT),
      component: <AllAppointmentsReport />,
    },
    {
      label: translateLabel(constantString.SALES_BY_SERVICE),
      icon: <GrCatalog />,
      value: "sales by service",
      title: translateLabel(constantString.SALES_BY_SERVICE),
      component: <SalesByServiceReport />,
    },
    {
      label: translateLabel(constantString.SALES_BY_STAFF),
      icon: <HiOutlineUsers />,
      value: "sales by staff",
      title: translateLabel(constantString.SALES_BY_STAFF),
      component: <SalesByStaffReport />,
    },
    {
      label: translateLabel(constantString.SALES_BY_CUSTOMER),
      icon: <LuUserPlus2 />,
      value: "sales by customer",
      title: translateLabel(constantString.SALES_BY_CUSTOMER),
      component: <SalesByCustomerReport />,
    },
  ];

  return (
    <div className="report-container">
      {isLoading && <CircularLoader />}

      <NavBar
      leftPart={
          <div style={{ width: "100%" }}>
            <MenuTabs
              options={options}
              onChangeTab={(val) => {
                setSelectedTab(val);
              }}
            />
            <p className="tab-text"></p>
          </div>
        }
        callingFrom="staff"
      />

      {options?.[selectedTab]?.component}

      {showSearch && <SearchPopup open={showSearch} />}
      {appointmentInvoice && (
        <Invoice open={appointmentInvoice} selectedData={appointmentInvoice} />
      )}

      {appointmentPaymentTransaction && (
        <PaymentTransactionModal
          open={appointmentPaymentTransaction}
          selectedData={appointmentPaymentTransaction}
        />
      )}

      {generateQR && <QrCode QrCodeLink={generateQR} />}
    </div>
  );
};
export default AnalyticsReport;
