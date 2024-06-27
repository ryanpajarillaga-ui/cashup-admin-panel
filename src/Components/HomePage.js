// src/components/HomePage.js

import { Box, Typography } from "@mui/material";

import Cookies from "js-cookie";
import Header from "./Header";
import React from "react";
import VerticalNav from "./VerticalNav";

const HomePage = () => {
  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];

  return (
    <Box sx={{ display: "flex" }}>
      <VerticalNav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <Typography variant="h5" gutterBottom marginTop={"5%"}>
          Welcome Back, {userData.full_name}!
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
