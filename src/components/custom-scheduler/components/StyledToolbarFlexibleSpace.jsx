import styled from "@emotion/styled";
import { classes } from "./classes";
import { Toolbar } from "@devexpress/dx-react-scheduler-material-ui";

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    flex: "none",
  },
  [`& .${classes.flexContainer}`]: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  }
}));

export default StyledToolbarFlexibleSpace;
