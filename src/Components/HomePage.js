import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import Header from "./Header";
import VerticalNav from "./VerticalNav";

const HomePage = () => {
  const [fullname, setFullname] = useState("");
  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject?.data?.[0];

  const updateState = (fullName) => setFullname(fullName);

  useEffect(() => {
    setFullname(userData.full_name);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <VerticalNav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header updateState={updateState} />
        <Typography variant="h5" gutterBottom marginTop="5%">
          Welcome Back, {fullname}!
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
