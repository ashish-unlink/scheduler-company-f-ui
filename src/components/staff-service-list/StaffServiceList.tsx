import React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {
  ResponseServiceList,
  ResponseServiceStaffRelation,
} from "../../utils/types/responseType";
import { useAppDispatch } from "../../redux";
import { setStaffServiceDelete } from "../../redux/staff/slice";
import useRandomColor from "../hooks/useRandomColor";

export const StaffServiceList = ({
  item,
}: {
  item: ResponseServiceStaffRelation;
}) => {
  const dispatch = useAppDispatch();
  const randomColor = useRandomColor();
  
  return (
    <Chip
      label={item?.svcCtlgItems?.title}
      variant="outlined"
      // onClick={handleClick}
      onDelete={() => dispatch(setStaffServiceDelete(item))}
      disabled = {item?.employee?.status == "inactive"}
      sx={{
        border: `1px solid ${randomColor}`,
        color: randomColor,
        fontWeight: 700,
      }}
    />
  );
};
