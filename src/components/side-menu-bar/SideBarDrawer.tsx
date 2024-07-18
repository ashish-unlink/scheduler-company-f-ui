import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import pologo from "../../assets/main-logo.png";
import { ListItemIcon } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { setShowUserGuidence } from "../../redux/meta/slice";
import MenusList from "./MenusList";
import { useAppDispatch } from "../../redux";
import CustomListItem from "./CustomListItem";
import "./profileStyle.css";
import { IoIosSettings } from "react-icons/io";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const SideBarDrawer = ({
  setSettingBussinessSetUP,
}: {
  setSettingBussinessSetUP: (val: boolean) => void;
}) => {
  const drawerWidth = 80;
  const dispatch = useAppDispatch();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        background:"#7469B6",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background:"#7469B6",
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <div className="hamburger">
        <img src={pologo} alt="PO-Logo" />
      </div>
      <Divider />
      <List className="menu-list">
        <div>
          {MenusList.map(
            (
              {
                icon,
                text,
                to,
                label,
              }: {
                icon: React.ReactElement;
                text: string;
                to: string;
                label: string;
              },
              index
            ) => (
              <CustomListItem
                icon={icon}
                text={text}
                key={index}
                to={to}
                label={label}
              />
            )
          )}
          <ListItemIcon
            // className="tour-button"
            sx={{ paddingLeft: "30px", pt: 1, cursor: "pointer", color:"#ffffff" }}
            onClick={() => dispatch(setSettingBussinessSetUP(true))}
          >
            <SettingsOutlinedIcon />
          </ListItemIcon>
        </div>

        <ListItemIcon
          className="tour-button"
          sx={{ paddingLeft: "30px", pt: 1, cursor: "pointer", color:"#ffffff" }}
          onClick={() => dispatch(setShowUserGuidence(true))}
        >
          <TravelExploreIcon fontSize="medium" />
        </ListItemIcon>
      </List>
    </Drawer>
  );
};

export default SideBarDrawer;
