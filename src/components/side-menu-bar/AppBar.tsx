import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import { Logout, PersonOutlined } from "@mui/icons-material";
import smallLogo from "../assets/small-logo.png";
// import schedulerText from "../assets/scheduler-text.png";
import MenuRightItems from "./Profile";
import Eng from "../assets/eng.png";
import { PrivatePath, PublicPath } from "../constants/routes.c";
import { constantString } from "../../utils/constantString";
import { logout } from "../../redux/auth/action";
import { useAppDispatch, useAppSelector } from "../../redux";
import { selectUserGuidenceModal } from "../../redux/meta/selector";
import { selectCurrentOutlet, selectOwnerData } from "../../redux/auth/selector";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setSettingBussinessSetUP, setShowSearch } from "../../redux/meta/slice";
import "./profileStyle.css";
import { userName } from "../../utils/general";
import { MdLanguage } from "react-icons/md";
import { setChangeStoreModal } from "../../redux/multi-store/slice";

const drawerWidth = 80;

const Header = () => {
  const ownerData = useAppSelector(selectOwnerData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const store = useAppSelector(selectCurrentOutlet);
  const onClickLanguageChange = (e: any) => {
    const lang = e;
    i18n?.changeLanguage(lang);
  };

  return (
    <AppBar
      position="fixed"
      style={{ background: "#rgb(116, 105, 182)", color: "#fff" }}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        height: "4rem",
      }}
    >
      <Toolbar>
        <div className="scheduler-toolbar">
          <div className="logo-div">
            {/* <img src={smallLogo} alt="smallLogo" />
            <img src={schedulerText} alt="schedulerText" /> */}
            <h3>{process.env.REACT_APP_APPLICATION_NAME}</h3>
          </div>

          <div className="scheduler-toolbar-right-section">

            <p className="store-name">({store?.title})</p>
            <div
              className="search-icons-sidebar"
              onClick={() => dispatch(setShowSearch(true))}
            >
              {" "}
              <SearchIcon />
            </div>
            <MenuRightItems
              title={i18n?.language == "en" ? "English" : "Japanese"}
              icon={
                <div className="lang-icon">
                  <MdLanguage color="#fff" fontSize="24px"/>
                </div>
              }
              direction="left"
              content={
                <ul className="log-out-wrap">
                  <li
                    className="language-item  header-menu-items"
                    onClick={(e) => {
                      onClickLanguageChange(
                        i18n?.language == "en" ? "de" : "en"
                      );
                    }}
                  >
                    {i18n?.language == "en" ? "Japanese" : "English"}
                  </li>
                </ul>
              }
            />

            <MenuRightItems
              title={userName(ownerData?.firstName, ownerData?.lastName)}
              icon={
                <div className="profile-icon">
                  <PersonOutlined />
                </div>
              }
              direction="right"
              content={
                <ul className="log-out-wrap">
                  <li onClick={(e) => {dispatch(setSettingBussinessSetUP(true))}} className="header-menu-items setting">
                    {/* <Link to={PrivatePath.home} className="setting-link"> */}
                      Setting
                    {/* </Link> */}
                  </li>
                  <li
                    onClick={(e) => {
                      dispatch(setChangeStoreModal(true));
                    }}
                    className="header-menu-items setting"
                  >
                    {constantString.CHANGE_STORE}
                  </li>
                  <li className="header-menu-items">
                    <button
                      className="button flex-row color-orange logout-button"
                      onClick={() => {
                        dispatch(logout());
                        navigate(PublicPath.login);
                      }}
                    >
                      <Logout />
                      {t(constantString.LOGOUT)}
                    </button>
                  </li>
                </ul>
              }
            />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
