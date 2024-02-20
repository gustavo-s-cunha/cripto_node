import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function NavButton({ buttonText, linkTo }) {
  return (
    <Button color="inherit" component={Link} to={linkTo}>
      {buttonText}
    </Button>
  );
}

export default NavButton;
