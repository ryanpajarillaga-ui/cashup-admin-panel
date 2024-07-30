import { Badge, Box, Divider, Link, Tooltip, Typography } from "@mui/material";
import React, { Fragment, useState } from "react";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TaskIcon from "@mui/icons-material/Task";
import { format } from "date-fns";

const LicenceVerification = ({ fetchNotifications, notifications, userData }) => {
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  // const [notifications, setNotifications] = useState([]);
  const toggleNotificationsDrawer = () => {
    setIsNotificationDrawerOpen((open) => !open);
    fetchNotifications("adminHome/getNotificationLicenseVerification");
  };

  return (
    <Fragment>
      <Badge
        badgeContent={userData.license_notification == true ? "" : null}
        color="customRed"
        sx={{
          "& .MuiBadge-badge": {
            minWidth: "10px",
            height: "10px",
            padding: "0",
            fontSize: "0.7rem",
            transform: "translate(-1px, 5px)",
          },
        }}
      >
        <NavIconButton
          title="Licence Verification"
          icon={TaskIcon}
          onClick={toggleNotificationsDrawer}
          size="small"
        />
      </Badge>
      <Drawer anchor="right" open={isNotificationDrawerOpen} onClose={toggleNotificationsDrawer}>
        <Box sx={{ width: 380 }}>
          <Box
            px={1}
            py={1.5}
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <NavIconButton icon={TaskIcon} size="medium" />
              <Typography variant="h6" fontSize={"1.2rem"}>
                Licence Verification ({notifications.length})
              </Typography>
            </Box>
            <Link
              href="/view-all"
              color="rgba(67,160,71)"
              variant="body1"
              fontSize={"0.8rem"}
              sx={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              View All >
            </Link>
          </Box>
          <Divider />
          <ul
            style={{
              listStyleType: "none",
              padding: "0",
              Width: "90%",
            }}
          >
            {notifications.map((notification) => (
              <li key={notification.merchant_license_id}>
                <Box
                  mx={2}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start", // Aligns the content to the left
                    borderRadius: 2, // Custom border radius
                    bgcolor: "rgb(227, 242, 244)", // Custom background color
                    border: 2, // Sets the border width
                    marginBottom: "1rem",
                    color: "rgb(194, 201, 192)",
                  }}
                >
                  <Box
                    px={2}
                    py={1}
                    sx={{
                      marginBottom: "2px",
                      width: "100%",
                    }}
                  >
                    <Typography color={"#2b2827"} fontSize={".8rem"} fontWeight={"200"}>
                      {notification.trade_name}
                    </Typography>
                    <Typography color={"#2b2827"} fontSize={".75rem"}>
                      Date Uploaded:{" "}
                      {format(new Date(notification.upload_date), "dd/MM/yyyy hh:mm a")}
                    </Typography>
                  </Box>
                </Box>
              </li>
            ))}
          </ul>
        </Box>
      </Drawer>
    </Fragment>
  );
};

export default LicenceVerification;

const NavIconButton = ({ title, icon: Icon, onClick, size }) => (
  <Tooltip title={title}>
    <IconButton aria-label={title} onClick={onClick} sx={{ color: "rgba(67,160,71)" }}>
      <Icon fontSize={size} />
    </IconButton>
  </Tooltip>
);
