import React from "react";
import { useCompanyData } from "../../components/hooks/useCompanyData";

const PosIframe = () => {
  const companyId = useCompanyData();
  return (
    <div className="">
      <iframe
        src={`pos.php?companyID=${companyId}`}
        title="POS"
        width="100%"
        height="800px"
      ></iframe>
    </div>
  );
};

export default PosIframe;
