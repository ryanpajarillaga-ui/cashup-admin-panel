import { Badge, Box, Divider, Link, Tooltip, Typography } from "@mui/material";
import React, { Fragment, useState } from "react";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { format } from "date-fns";

const ContactSupport = ({ fetchNotifications, notifications, userData }) => {
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const toggleNotificationsDrawer = () => {
    setIsNotificationDrawerOpen((open) => !open);
    fetchNotifications("adminHome/getNotificationContactSupport");
  };

  return (
    <Fragment>
      <Badge
        badgeContent={userData.contact_notification == true ? "" : null}
        color="error"
        sx={{
          "& .MuiBadge-badge": {
            minWidth: "8px",
            height: "12px",
            transform: "translate(-10%, 1%)",
          },
        }}
      >
        <NavIconButton
          title="Contact support"
          icon={SupportAgentIcon}
          onClick={toggleNotificationsDrawer}
        />
      </Badge>

      <Drawer anchor="right" open={isNotificationDrawerOpen} onClose={toggleNotificationsDrawer}>
        <Box sx={{ width: 350 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box px={1} py={1.5} sx={{ display: "flex", alignItems: "center" }}>
              <NavIconButton icon={SupportAgentIcon} />
              <Typography variant="body1" color={"black"}>
                Contact Support ({notifications.length})
              </Typography>
            </Box>
            <Link
              href="/view-all"
              color="rgba(67,160,71)"
              variant="body2"
              sx={{ textDecoration: "none" }}
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
              <li key={notification.contact_support_id}>
                <Box
                  mx={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center", // Aligns the content to the left
                    borderRadius: 2, // Custom border radius
                    bgcolor: "rgb(232, 245, 233)", // Custom background color
                    border: 2, // Sets the border width
                    marginBottom: "1rem",
                    color: "rgba(196, 196, 196)",
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
                      {notification.message_sender}
                    </Typography>
                    <Typography color={"#2b2827"} fontSize={".8rem"}>
                      Date Sent:{" "}
                      {format(new Date(notification.message_timestamp), "dd/MM/yyyy hh:mm a")}
                    </Typography>
                    <Typography color={"#2b2827"} fontSize={".75rem"}>
                      Message: {notification.message_preview}
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

export default ContactSupport;

const NavIconButton = ({ title, icon: Icon, onClick }) => (
  <Tooltip title={title}>
    <IconButton aria-label={title} onClick={onClick} sx={{ color: "rgba(67,160,71)" }}>
      <Icon fontSize="medium" />
    </IconButton>
  </Tooltip>
);
