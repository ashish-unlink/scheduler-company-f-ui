import { Box } from "@mui/material";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { MenuTabsProps } from "./type";

const MenuTabs = (props: MenuTabsProps) => {
  const { options, onChangeTab } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    onChangeTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        // indicatorColor="#ffa500"
        indicatorColor="primary"
        aria-label="secondary tabs example"
        sx={{
          "&.MuiBox-root": {
            "&.MuiTabs-indicator": {
              height: "10px",
            },
          },
          // "&.MuiTab-root.Mui-selected": {
          //   color: 'red !important'
          // }
        }}

        TabIndicatorProps={{
          style: {
            backgroundColor: "#041e2d",
            color:"#041e2d !important"
          }
        }}
      >
        {options?.map((item, index) => {
          return (
            <Tab
              value={index}
              label={item?.label}
              key={index}
              sx={{
                fontWeight: 700,
                fontFamily: "Kumbh Sans",
                fontSize:"16px"
              }}
            />
          );
        })}
      </Tabs>
    </Box>
  );
};

export default MenuTabs;
