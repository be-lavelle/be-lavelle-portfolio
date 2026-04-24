import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MenuButton } from "./MenuButton";
import { h6Style, toolbarBoxStyle, toolbarStyle } from "./utils/StylingConsts";
import * as React from "react";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={toolbarStyle}>
        <Typography variant="h6" component={Link} to="/" sx={h6Style}>
          Be Lavelle
        </Typography>

        <Box sx={toolbarBoxStyle}>
          <MenuButton to="/standings" name="NHL Standings" />
          <MenuButton to="/game-breakdowns" name="NHL Game Breakdowns" />
          <MenuButton to="/about" name="About" />
          <MenuButton to="/contact" name="Contact" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
