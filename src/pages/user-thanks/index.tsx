import React, { useEffect } from "react";
import PublicWrapper from "../../components/wrappers/PublicWrapper";
import tick from "../../assets/tick-icon-png-20.png";
import "./userThanksStyle.css";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../redux";
import { verifyCustomer } from "../../redux/users/action";
import { RequestClientVerification } from "../../utils/types/requestType";

export const CustomerVerify = () => {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.hash);

  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchParams) {
      const body: RequestClientVerification = {
        token: searchParams?.get("hash") ?? "",
        email: searchParams?.get("email") ?? "",
      };

      dispatch(verifyCustomer(body));
    }
  }, []);

  return (
    <div className="user-container">
      <img src={tick} className="tick-icon-img" alt="" />
      <h2 className="heading">Thankyou!</h2>
      <p className="user-text">Your email has been verified.</p>
    </div>
  );
};
