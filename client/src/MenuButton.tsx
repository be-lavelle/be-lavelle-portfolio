import Button from "@mui/material/Button";
import * as React from "react";
import { Link } from "react-router-dom";

type MenuButtonProps = {
  to: string;
  name: string;
};

export const MenuButton = ({ to, name }: MenuButtonProps) => {
  return (
    <Button
      color="inherit"
      component={Link}
      to={to}
      sx={{ fontFamily: "Faculty Glyphic", marginLeft: 2, }}
    >
      {name}
    </Button>
  );
};
