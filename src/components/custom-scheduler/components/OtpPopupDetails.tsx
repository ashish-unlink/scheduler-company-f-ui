
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { constantString } from "../../../utils/constantString";
import { useTranslation } from "react-i18next";

export default function OtpPopupDetails({
  onVerifyOtp,
}: {
  onVerifyOtp: (otp: string) => void;
}) {
  const [otp, setOTP] = useState("");
  const [countdown, setCountdown] = useState(30);
  const { t } = useTranslation();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [countdown]);

  const handleResendOTP = () => {
    setCountdown(30);
  };

  return (
    <div className="otp-popup-content">
      <center>{t(constantString.EMAIL_VERIFICATION_TEXT)}</center>
      <div className="otp-field">
        <OtpInput
          value={otp}
          containerStyle={{
            display: "flex",
            justifyContent: "center",
          }}
          inputStyle={{
            width: "50px",
            height: "45px",
            border: "1px solid #DADADA",
            borderRadius: "5px",
            fontSize: "18px",
          }}
          onChange={setOTP}
          numInputs={4}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
        />
      </div>
      <div
        onClick={() => onVerifyOtp(otp)}
        className={"verify bg-orange white button"}
      >
        {constantString.VERIFY}
      </div>
      <p className="didnt-recieved">{t(constantString.DID_NOT_RECEIVE_CODE)}</p>
      {countdown > 0 ? (
        <div className="color-orange">
         {countdown} second
        </div>
      ) : (
        <div
          onClick={handleResendOTP}
        className="verify color-orange button"
        >
          {t(constantString.RESEND_OTP)}
        </div>
      )}
    </div>
  );
}

