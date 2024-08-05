import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

function NavButton({ buttonText, linkTo, icon }) {
  return (
    <Button color="inherit" component={Link} to={linkTo}>
      {icon}
      {buttonText}
    </Button>
  );
}

export default NavButton;
