import CustomPopup from "../../custom-popup/CustomPopup";
import AppointmentPopupHeader from "../../components/appointment-popup/AppointmentPopupHeader";
import "./viewStaffStyle.css";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  setSelectedStaffDetail,
  setShowViewStaffModal,
} from "../../redux/staff/slice";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  selectEmployeeList,
  selectEmployeeLoading,
  selectServiceEmployeeRelationList,
} from "../../redux/staff/selector";
import {
  ResponseServiceStaffRelation,
  ServiceListItem,
} from "../../utils/types/responseType";
import { deleteServiceStaffRelation } from "../../redux/staff/action";
import { userName } from "../../utils/general";
import { useNavigate } from "react-router-dom";
import { PrivatePath } from "../constants/routes.c";

export const ViewStaffModal = ({ open }: { open: ServiceListItem }) => {
  const dispatch = useAppDispatch();
  const staffServiceList = useAppSelector(selectServiceEmployeeRelationList);
  const navigate = useNavigate();

  const customStyle = {
    position: "absolute",
    top: "22vh",
    left: "32%",
    transform: "translate(-50%, -50%)",
    width: "35%",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "1rem",
    boxShadow: 24,
    // p: 4,
  };

  const onVisitEmployeeDetail = (item: ResponseServiceStaffRelation) => {
    navigate(`${PrivatePath.staff}?employee=${item?.employeeId}`);
  };

  return (
    <>
      <CustomPopup open={open ? true : false} style={customStyle}>
        <AppointmentPopupHeader
          onClose={() => {
            dispatch(setShowViewStaffModal(null));
          }}
        >
          <b>
            Team Members assign to{" "}
            <span className="color-text">{open?.title}</span> service{" "}
          </b>
        </AppointmentPopupHeader>
        <List className="staff-member-list">
          {staffServiceList?.length > 0 ? (
            staffServiceList?.map(
              (item: ResponseServiceStaffRelation, index: number) => {
                return (
                  <>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon
                            onClick={() =>
                              dispatch(deleteServiceStaffRelation(item?.id))
                            }
                          />
                        </IconButton>
                      }
                      className="list-item"
                    >
                      <ListItemText
                        className="list-item-text"
                        onClick={() => {
                          onVisitEmployeeDetail(item);
                        }}
                      >
                        {userName(
                          item?.employee?.firstName,
                          item?.employee?.lastName
                        )}
                      </ListItemText>
                    </ListItem>
                  </>
                );
              }
            )
          ) : (
            <Typography
              sx={{ textAlign: "center", mt: 3, mb: 3 }}
              fontWeight={700}
            >
              {" "}
              No member assign to{" "}
              <span className="color-text">{open?.title}</span> service
            </Typography>
          )}
        </List>
      </CustomPopup>
    </>
  );
};
