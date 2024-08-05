import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Box, Divider, Drawer, IconButton, List, Toolbar, Typography, } from "@mui/material";
import { AutoGraph, Home, Menu } from "@mui/icons-material";

import NavItem from "./components/NavItem";
import NavButton from "./components/NavButton";

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return ( <>
    <AppBar component="nav" position="static" color="inherit" sx={{ zIndex: 1, borderBottom: "4px solid #3fcb4d", boxShadow: "none" }} >
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" 
          onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }} >
          <Link to="/">
            <img
              src="/assets/coinext.svg"
              alt="Logo coinext"
              style={{
                width: "40px",
                verticalAlign: "middle",
              }}
            />
          </Link>
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <NavButton buttonText="Principal" linkTo="/" icon={<Home color="success" sx={{mr: '5px'}}/>} />
          <NavButton buttonText="Analisar" linkTo="/analises" icon={<AutoGraph color="success" sx={{mr: '5px'}}/>} />
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
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            Analises para tabela da Coinext
          </Typography>
          <Divider />
          <List>
            <NavItem linkTo="/" itemText="Principal" icon={<Home color="success" sx={{mr: '5px'}}/>} />
            <NavItem linkTo="/analises" itemText="Analisar" icon={<AutoGraph color="success" sx={{mr: '5px'}}/>} />
          </List>
        </Box>
      </Drawer>
    </nav>
  </> );
}

export default Nav;
