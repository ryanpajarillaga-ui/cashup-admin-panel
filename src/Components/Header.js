import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore, Person as PersonIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

import Admin from "../Images/admin.png";
import ContactSupport from "./NotificationPages/ContactSupport";
import Cookies from "js-cookie";
import LicenceVerification from "./NotificationPages/LicenceVerification";
import Profile from "./Profile";
import WithdrawalRequests from "./NotificationPages/WithdrawalRequests";
import axios from "axios";

const Header = ({ updateState }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [contactSupportNotifications, setContactSupportNotifications] = useState([]);
  const [licenceNotifications, setLicenceNotifications] = useState([]);
  const [withdrawalNotifications, setWithdrawalNotifications] = useState([]);

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const fetchNotifications = async (endpoint, setter) => {
    const url = `${baseURLv1}/${endpoint}`;

    try {
      const response = await axios.get(url);
      setter(response.data.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  const handleSubmenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSubmenuOpen((prev) => !prev);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubmenuOpen(false);
  };

  useEffect(() => {
    fetchNotifications("adminHome/getNotificationWithdrawals", setWithdrawalNotifications);
    fetchNotifications("adminHome/getNotificationContactSupport", setContactSupportNotifications);
    fetchNotifications("adminHome/getNotificationLicenseVerification", setLicenceNotifications);
  }, []);

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
          <LicenceVerification
            fetchNotifications={fetchNotifications}
            notifications={licenceNotifications}
            userData={userData}
          />
          <WithdrawalRequests
            fetchNotifications={fetchNotifications}
            notifications={withdrawalNotifications}
            userData={userData}
          />
          <Button
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            onClick={handleSubmenuClick}
          >
            <img src={Admin} alt="Logo" style={{ width: "50px", marginRight: ".5rem" }} />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography
                variant="body"
                color="black"
                fontSize=".75rem"
                fontWeight="700"
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
                fontSize=".7rem"
                fontWeight="500"
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
          </Button>
          <Profile
            anchorEl={anchorEl}
            submenuOpen={submenuOpen}
            handleClose={handleClose}
            userData={userData}
            updateState={updateState}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
