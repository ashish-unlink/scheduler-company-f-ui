import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import { classes } from "./classes";

const StyledIconButton = styled(IconButton)(() => ({
  [`&.${classes.commandButton}`]: {
    backgroundColor: "rgba(255,255,255,0.65)",
  },
}));

export default StyledIconButton;
