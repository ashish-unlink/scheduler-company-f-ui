import React,{useEffect} from "react";
import Alert from "@mui/material/Alert";
import { useAppDispatch } from "../../redux";
import { setShowAlert } from "../../redux/meta/slice";
import './alertStyle.css';

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  message: string;
}

export const AlertWrap = (props: AlertProps) => {
  
  const {message,variant} = props;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (message != "") {
      const timer = setTimeout(() => {
        dispatch(setShowAlert({message:"", type:'info'}));
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, message]);

  return (
    <div className="alert-container">
       <Alert severity={variant} onClose={()=>{dispatch(setShowAlert({message:"", type:'info'}))}}>{message}</Alert>
    </div>
  );
};

