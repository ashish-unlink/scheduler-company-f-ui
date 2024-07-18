import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import "./accordionStyle.css";
import { styled } from "@mui/material";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import {
  ResponseServiceList,
  ServiceListItem,
  Users,
} from "../../utils/types/responseType";
import { useAppDispatch, useAppSelector } from "../../redux";
import { AccordianListItem } from "../accordian-list-item/AccordianListItem";
import { StaffDropDownList } from "../staff-dropdown-list/StaffDropDownList";
import { updateCategoryStatusAPI } from "../../redux/service/action";
import { selectServiceLoading } from "../../redux/service/selector";
import CircularLoader from "../loading/CircularLoader";
import {
  selectEmployeeLoading,
  selectShowStaffModal,
} from "../../redux/staff/selector";
import { ViewStaffModal } from "../view-staff-modal/ViewStaffModal";
import Tooltip from "@mui/material/Tooltip";

const AccordionList = ({
  item,
  selectedStaff,
}: {
  item: ResponseServiceList;
  selectedStaff?: Users | null;
}) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectServiceLoading);
  const showModal = useAppSelector(selectShowStaffModal);
  const isEmployeeLoading = useAppSelector(selectEmployeeLoading);

  const [expandAccordian, setExpandAccordian] = useState<boolean>(false);

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid #D9D9D9",
  }));

  const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
    borderTop: "1px solid #D9D9D9",
    borderRadius: "8px",
  }));


  return (
    <>
      {(isLoading || isEmployeeLoading) && <CircularLoader />}
      <Accordion
        className="accordian"
        // expanded={expandAccordian}
        // onChange={(event: React.SyntheticEvent, expanded: boolean) =>
        //   setExpandAccordian(!expandAccordian)
        // }
      >
        <AccordionSummary
          className="drop-icons-button"
          expandIcon={<ExpandMoreIcon className="drop-icons" />}
        >
          <div className="accordion-container">
            <div className="wrap-check-box">
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ color: "#000" , textTransform:'capitalize'}}
              >
                {item?.title}
              </Typography>
              <Tooltip title="Service Count" placement="bottom">
                <Typography variant="body1" color="gray" fontWeight={600}>
                  (
                  {
                    item?.svcCtlgItems?.filter((i) => {
                      return i.status != "delete";
                    })?.length
                  }
                  )
                </Typography>
              </Tooltip>
            </div>
            {!selectedStaff && <StaffDropDownList item={item} />}
          </div>
        </AccordionSummary>

        <AccordionDetails>
          <AccordianListItem serviceItem={item} />
        </AccordionDetails>
      </Accordion>
      {!isEmployeeLoading && showModal && <ViewStaffModal open={showModal} />}
    </>
  );
};

export default AccordionList;
