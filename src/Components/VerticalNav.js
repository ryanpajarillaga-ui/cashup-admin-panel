import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { Avatar } from "@mui/material";
import Cookies from "js-cookie";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Diversity1RoundedIcon from "@mui/icons-material/Diversity1Rounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Face6OutlinedIcon from "@mui/icons-material/Face6Outlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Logo from "../Images/cashup-logo-colored.png";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import PersonIcon from "@mui/icons-material/Person";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import StorefrontSharpIcon from "@mui/icons-material/StorefrontSharp";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TaskIcon from "@mui/icons-material/Task";

const drawerWidth = 240;

const VerticalNav = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmenuClick = () => {
    setSubmenuOpen(!submenuOpen);
  };

  const menuItems = [
    {
      text: "Manage Account",
      icon: <AccountCircleOutlinedIcon />,
      permission: "menu_accounts_main",
      submenu: [
        {
          text: "Merchants",
          icon: <StoreOutlinedIcon />,
          path: "/merchants",
          permission: "menu_accounts_merchant",
        },
        {
          text: "Consumers",
          icon: <AccountCircleIcon />,
          path: "/consumers",
          permission: "menu_accounts_consumer",
        },
        {
          text: "Admin Users",
          icon: <PersonIcon />,
          path: "/adminusers",
          permission: "menu_accounts_user",
        },
      ],
    },
    {
      text: "My Network",
      icon: <Diversity1RoundedIcon />,
      path: "/mynetwork",
      permission: "menu_network",
    },
    {
      text: "eShop Management",
      icon: <StorefrontSharpIcon />,
      path: "/eshopmanagement",
      permission: "menu_eshop_dashboard",
    },
    {
      text: "Transactions",
      icon: <ArticleOutlinedIcon />,
      path: "/transactions",
      permission: "menu_transactions",
    },
    {
      text: "Reports",
      icon: <DescriptionOutlinedIcon />,
      path: "/reports",
      permission: "menu_reports",
    },
  ];

  const belowMenuItems = [
    {
      text: "Withdrawal Request",
      icon: <MonetizationOnOutlinedIcon />,
      path: "/withdrawalrequest",
      permission: "menu_withdraw",
    },
    {
      text: "License Verification",
      icon: <TaskIcon />,
      path: "/licenseverification",
      permission: "menu_license",
    },
    {
      text: "Contact Support",
      icon: <SupportAgentIcon />,
      path: "/contactsupport",
      permission: "menu_support",
    },
  ];

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];

  const filterMenuItems = (items) => {
    return items
      .filter((item) => userData[item.permission])
      .map((item) => {
        if (item.submenu) {
          return {
            ...item,
            submenu: filterMenuItems(item.submenu),
          };
        }
        return item;
      });
  };

  let filteredMenuItems = filterMenuItems(menuItems);
  filteredMenuItems = [
    { text: "Home", icon: <HomeRoundedIcon />, path: "/home", permission: "home" },
    ...filteredMenuItems,
  ];

  const filteredBelowMenuItems = filterMenuItems(belowMenuItems);
  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "rgb(232, 245, 233)",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ width: "190px", padding: "1rem", marginLeft: "1rem", marginBottom: "1rem" }}
        />
        <List>
          {filteredMenuItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <>
                  <ListItem button onClick={handleSubmenuClick}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: isActive(item.path) ? "#2e7d32" : "#91d9a4" }}>
                        {item.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.8rem",
                        fontWeight: isActive(item.path) ? "bold" : null,
                      }}
                    />
                    {submenuOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={submenuOpen} timeout="auto">
                    <List component="div" disablePadding>
                      {item.submenu.map((subItem, subIndex) => (
                        <ListItem
                          button
                          key={subIndex}
                          sx={{
                            pl: 4,
                            bgcolor: isActive(subItem.path) ? "rgba(67,160,71, 0.2)" : null,
                          }}
                          onClick={() => navigate(subItem.path)}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{ bgcolor: isActive(subItem.path) ? "#2e7d32" : "#91d9a4" }}
                            >
                              {subItem.icon}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: "0.8rem",
                              fontWeight: isActive(subItem.path) ? "bold" : null,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem
                  button
                  sx={{ bgcolor: isActive(item.path) ? "rgba(67,160,71, 0.2)" : null }}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: isActive(item.path) ? "#2e7d32" : "#91d9a4" }}>
                      {item.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.8rem",
                      fontWeight: isActive(item.path) ? "bold" : null,
                    }}
                  />
                </ListItem>
              )}
            </div>
          ))}
        </List>
        <Divider />
        <List>
          {filteredBelowMenuItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <>
                  <ListItem button onClick={handleSubmenuClick}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: isActive(item.path) ? "#2e7d32" : "#91d9a4" }}>
                        {item.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.8rem",
                        fontWeight: isActive(item.path) ? "bold" : null,
                      }}
                    />
                    {submenuOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.submenu.map((subItem, subIndex) => (
                        <ListItem
                          button
                          key={subIndex}
                          sx={{
                            pl: 4,
                            bgcolor: isActive(subItem.path) ? "rgba(67,160,71, 0.2)" : null,
                          }}
                          onClick={() => navigate(subItem.path)}
                        >
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: isActive(item.path) ? "#2e7d32" : "#91d9a4" }}>
                              {item.icon}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: "0.8rem",
                              fontWeight: isActive(item.path) ? "bold" : null,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem
                  button
                  sx={{ bgcolor: isActive(item.path) ? "rgba(67,160,71, 0.2)" : null }}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: isActive(item.path) ? "#2e7d32" : "#91d9a4" }}>
                      {item.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.8rem",
                      fontWeight: isActive(item.path) ? "bold" : null,
                    }}
                  />
                </ListItem>
              )}
            </div>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default VerticalNav;
