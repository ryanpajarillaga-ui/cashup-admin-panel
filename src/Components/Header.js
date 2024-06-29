import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";

import { Avatar } from "@mui/material";
import ContactSupport from "./NotificationPages/ContactSupport";
import Cookies from "js-cookie";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LicenceVefification from "./NotificationPages/LicenceVerification";
import PersonIcon from "@mui/icons-material/Person";
import Profile from "./Profile";
import WithdrawalRequests from "./NotificationPages/WithdrawalRequests";
import axios from "axios";

const Header = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [contactSupportNotifications, setContactSupportNotifications] = useState([]);
  const [licenceNotifications, setLicenceNotifications] = useState([]);
  const [withdrawalNotifications, setWithdrawalNotifications] = useState([]);

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const fetchNotifications = async (endpoint) => {
    const url = `${baseURLv1}/${endpoint}`;

    try {
      const response = await axios.get(url);
      const data = await response.data.data;
      if (endpoint == "adminHome/getNotificationWithdrawals") {
        setWithdrawalNotifications(data);
      } else if (endpoint == "adminHome/getNotificationContactSupport") {
        setContactSupportNotifications(data);
      } else {
        setLicenceNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const handleSubmenuClick = (e) => {
    setAnchorEl(e.currentTarget);
    setSubmenuOpen(!submenuOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <ContactSupport
            fetchNotifications={fetchNotifications}
            notifications={contactSupportNotifications}
            userData={userData}
          />
          <LicenceVefification
            fetchNotifications={fetchNotifications}
            notifications={licenceNotifications}
            userData={userData}
          />
          <WithdrawalRequests
            fetchNotifications={fetchNotifications}
            notifications={withdrawalNotifications}
            userData={userData}
          />
          <Avatar sx={{ bgcolor: "#4caf50", ml: 2 }}>
            <PersonIcon />
          </Avatar>
          <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}
            onClick={handleSubmenuClick}
          >
            <Typography
              variant="body"
              color="black"
              fontSize={".75rem"}
              fontWeight={"700"}
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
              fontSize={".7rem"}
              fontWeight={"500"}
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
          <Profile
            anchorEl={anchorEl}
            submenuOpen={submenuOpen}
            handleClose={handleClose}
            userData={userData}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
