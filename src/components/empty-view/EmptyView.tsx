import React from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import "./emptyViewStyle.css";

interface EmptyViewProps {
  src?: string;
  title?: string;
  text: string;
  width?: number;
  height?: number;
  //   onHandleClick = () => void
}
export const EmptyView = (props: any) => {
  const { src, text, title, onHandleClick, width = 250, height = 250 } = props;
  return (
    <div className="empty-view-wrap">
      <img src={src} width={width} height={height} />
      {title && (
        <Typography variant="h6" sx={{ marginTop: "10px" , color:'#000'}}>
          {title}
        </Typography>
      )}
      <Button
        variant="contained"
        className="contained-empty-btn"
        sx={{ marginTop: "15px" }}
        onClick={() => onHandleClick()}
      >
        {text}
      </Button>
    </div>
  );
};
