import { Box, Typography } from "@mui/material";
import React, { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Cookies from "js-cookie";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TaskIcon from "@mui/icons-material/Task";
import Toolbar from "@mui/material/Toolbar";

const Header = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];

  const handleSubmenuClick = () => {
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        borderLeft: 0,
        borderRight: 0,
        backgroundColor: "white",
        width: `calc(100% - 240px)`,
        ml: 0,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton color="inherit" sx={{ color: "rgba(67,160,71)" }}>
            <SupportAgentIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ color: "rgba(67,160,71)" }}>
            <TaskIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ color: "rgba(67,160,71)" }}>
            <MonetizationOnIcon />
          </IconButton>
          <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "left", ml: 2 }}
            onClick={handleSubmenuClick}
          >
            <Typography
              variant="h2"
              color="black"
              sx={{
                maxWidth: "8rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {userData.full_name.toUpperCase()}
            </Typography>
            <Typography
              variant="body"
              color="textSecondary"
              fontSize={".75rem"}
              sx={{
                maxWidth: "8rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {userData.designation.toUpperCase()}
            </Typography>
          </Box>
          {submenuOpen ? <ExpandLess color="disabled" /> : <ExpandMore color="disabled" />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
