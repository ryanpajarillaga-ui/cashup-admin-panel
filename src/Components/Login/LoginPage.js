import { Box, Typography } from "@mui/material";

import LoginForm from "./LoginForm";
import Logo from "../../Images/cashup-logo-colored.png";
import NestLogo from "../../Images/logo-gn-it.png";
import React from "react";
import bg from "../../Images/bg-scene-default.svg";
import doodle from "../../Images/login-doodle.png";

const LoginPage = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Column - 40% */}
      <Box
        sx={{
          width: "40%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          p: 2,
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "180px", marginBottom: "3rem" }} />
        <LoginForm />
      </Box>

      {/* Right Column - 60% */}
      <Box
        sx={{
          width: "62%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "white",
        }}
      >
        <img src={doodle} alt="Doodle" width={400} height={400} style={{ position: "absolute" }} />
        <Box
          sx={{
            position: "absolute",
            bottom: "2.5rem",
            left: "2rem",
            textAlign: "left",
            width: "calc(100% - 2rem)",
          }}
        >
          <img src={NestLogo} alt="Nest Logo" width={135} />
          <Typography variant="caption" display="block" color="black" mt={1} fontSize="10px">
            © 2024 Green Nest Information Technology L.L.C. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
