import React from "react";
import "./customButtonStyle.css";
import { ButtonType } from "./type";
import Button from '@mui/material/Button';

const CustomButton = (props: ButtonType) => {
  const { children ,onClick ,disabled, style ,variant, color, type} = props;
  return (
    <div>
      <button onClick={onClick} className="custom-button" disabled={disabled} style={style} type={type}>
        {children}
      </button>
      {/* <Button className="custom-button" onClick={onClick}  variant={variant} disabled={disabled} style={style} color={color}> {children}</Button> */}
    </div>
  );
};

export default CustomButton;
