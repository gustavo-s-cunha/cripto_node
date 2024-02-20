import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Box, Button, Divider, Drawer, IconButton, List, Toolbar, Typography, } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HomeIcon from "@mui/icons-material/Home";

import NavItem from "./components/NavItem";
import NavButton from "./components/NavButton";

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Analises para tabela da Coinext
      </Typography>
      <Divider />
      <List>
        <NavItem linkTo="/" itemText="Principal" icon={<HomeIcon />} />
        <NavItem linkTo="/analises" itemText="Analisar" icon={<CloudUploadIcon />} />
      </List>
    </Box>
  );
  return ( <>
    <AppBar component="nav" position="static" color="inherit" sx={{ zIndex: 1, borderBottom: "4px solid #3fcb4d", boxShadow: "none" }} >
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" 
          onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }} >
          <Link to="/">
            <img
              src="/assets/coinext.svg"
              alt="Logo test"
              style={{
                width: "40px",
                verticalAlign: "middle",
              }}
            />
          </Link>
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <NavButton buttonText="Principal" linkTo="/" />
          <NavButton buttonText="Analisar" linkTo="/analises" />
        </Box>
      </Toolbar>
    </AppBar>
    <nav>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240, },
        }}
      >
        {drawer}
      </Drawer>
    </nav>
  </> );
}

export default Nav;
