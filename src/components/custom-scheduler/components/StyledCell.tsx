

import styled from "@emotion/styled";
import { classes } from "./classes";
import { GroupingPanel } from "@devexpress/dx-react-scheduler-material-ui";

const StyledCell = styled(GroupingPanel.Cell)(() => ({
  [`&.${classes.headerCell}`]: {
    color: "white",
    backgroundColor: "#7469B6",
    height: 20,
    width: 250,

    "&:hover": {
        backgroundColor: "#7469B6",
      },
      "&:focus": {
        backgroundColor: "#7469B6",
      },
  },
}));

export default StyledCell;