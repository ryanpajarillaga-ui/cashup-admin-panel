import { Badge, Box, Divider, Tooltip, Typography } from "@mui/material";
import React, { Fragment, useState } from "react";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const ContactSupport = ({ fetchNotifications, notifications, userData }) => {
  const navigate = useNavigate();
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const toggleNotificationsDrawer = () => {
    setIsNotificationDrawerOpen((open) => !open);
    fetchNotifications("adminHome/getNotificationContactSupport");
  };

  const handleNotificationClick = (notificationId) => {
    navigate("/contactsupport", { state: { contact_support_id: notificationId } });
  };

  return (
    <Fragment>
      <Badge
        badgeContent={userData.contact_notification == true ? "" : null}
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
          title="Contact Support"
          icon={SupportAgentIcon}
          onClick={toggleNotificationsDrawer}
          size="small"
        />
      </Badge>

      <Drawer anchor="right" open={isNotificationDrawerOpen} onClose={toggleNotificationsDrawer}>
        <Box sx={{ width: 380 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box px={1} py={1.5} sx={{ display: "flex", alignItems: "center" }}>
              <NavIconButton icon={SupportAgentIcon} size="medium" />
              <Typography variant="h6" fontSize={"1.2rem"}>
                Contact Support ({notifications.length})
              </Typography>
            </Box>
            <Link
              to="/contactsupport"
              state={{ message: "View All Clicked" }}
              style={{ color: "rgba(67,160,71)", fontSize: "0.8rem", textDecoration: "none" }}
            >
              View All &gt;
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
                    justifyContent: "flex-start", // Aligns the content to the left
                    borderRadius: 2, // Custom border radius
                    bgcolor: "rgb(232, 245, 233)", // Custom background color
                    border: 2, // Sets the border width
                    marginBottom: "1rem",
                    color: "rgba(196, 196, 196)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => handleNotificationClick(notification.contact_support_id)}
                >
                  <Link
                    to="/contactsupport"
                    state={{
                      message: "Notification Clicked",
                      notification: notification,
                    }}
                    style={{ color: "rgba(67,160,71)", fontSize: "0.8rem", textDecoration: "none" }}
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
                  </Link>
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

const NavIconButton = ({ title, icon: Icon, onClick, size }) => (
  <Tooltip title={title}>
    <IconButton aria-label={title} onClick={onClick} sx={{ color: "rgba(67,160,71)" }}>
      <Icon fontSize={size} />
    </IconButton>
  </Tooltip>
);
