import { styled } from "@mui/material";

export const GameExpandWrapper = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    maxHeight: "120px",
    overflow: "auto",
  },
  [theme.breakpoints.up("md")]: {
    maxHeight: "60vh",
    overflow: "auto",
  },
}));

export const ChartWrapper = styled("div")(({ theme }) => ({
  border: "3px #62626221",
  borderStyle: "solid",
  borderRadius: "2px",
  [theme.breakpoints.down("md")]: {
    maxHeight: "40vh",
    overflow: "auto",
  },
  [theme.breakpoints.up("md")]: {
    maxHeight: "60vh",
  },
}));
