import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function NavItem({ linkTo, itemText, icon }) {
  return (
    <Link to={linkTo} style={{ textDecoration: "none", color: "#000" }}>
      <ListItem disablePadding>
        <ListItemButton sx={{ textAlign: "center" }}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={itemText} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

export default NavItem;
