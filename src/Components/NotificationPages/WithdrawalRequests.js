import { Badge, Box, Divider, Link, Tooltip, Typography } from "@mui/material";
import React, { Fragment, useState } from "react";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { format } from "date-fns";

const WithdrawalRequests = ({ fetchNotifications, notifications, userData }) => {
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const toggleNotificationsDrawer = () => {
    setIsNotificationDrawerOpen((open) => !open);
    fetchNotifications("adminHome/getNotificationWithdrawals");
  };

  return (
    <Fragment>
      <Badge
        badgeContent={userData.withdraw_notification == true ? "" : null}
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
          title="Withdrawal Requests"
          icon={MonetizationOnIcon}
          onClick={toggleNotificationsDrawer}
        />
      </Badge>

      <Drawer anchor="right" open={isNotificationDrawerOpen} onClose={toggleNotificationsDrawer}>
        <Box sx={{ width: 350 }}>
          <Box
            px={1}
            py={1.5}
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <NavIconButton icon={MonetizationOnIcon} />
              <Typography variant="body1" color={"black"}>
                Withdrawal Requests ({notifications.length})
              </Typography>
            </Box>
            <Link
              href="/view-all"
              color="rgba(67,160,71)"
              variant="body2"
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
              <li key={notification.contact_support_id}>
                <Box
                  mx={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center", // Aligns the content to the left
                    borderColor: "rgb(199, 225, 188)", // Custom border color
                    borderRadius: 2, // Custom border radius
                    bgcolor: "rgb(252, 252, 242)", // Custom background color
                    border: 2, // Sets the border width
                    marginBottom: "1rem",
                    color: "rgb(247, 178, 57)",
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
                      {notification.requested_by}
                    </Typography>
                    <Typography color={"#2b2827"} fontSize={".75rem"}>
                      Amount: {notification.amount}
                    </Typography>
                    <Typography color={"#2b2827"} fontSize={".75rem"}>
                      Bank: {notification.bank_name}
                    </Typography>
                    <Typography color={"#2b2827"} fontSize={".75rem"}>
                      Date Requested:{" "}
                      {format(new Date(notification.requested_timestamp), "dd/MM/yyyy hh:mm a")}
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

export default WithdrawalRequests;

const NavIconButton = ({ title, icon: Icon, onClick }) => (
  <Tooltip title={title}>
    <IconButton aria-label={title} onClick={onClick} sx={{ color: "rgba(67,160,71)" }}>
      <Icon fontSize="medium" />
    </IconButton>
  </Tooltip>
);
