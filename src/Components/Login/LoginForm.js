import { Button, Card, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const LoginForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name == "username" ? value.replace(/\s/g, "") : value;
    setUserData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const fetchUserData = async (userId) => {
    const url = `${baseURLv1}/adminHome/getUserMainInfo/${userId}`; // Replace with your API endpoint for menu items

    try {
      const response = await axios.get(url);
      const data = await response.data;
      Cookies.set("userData", JSON.stringify(data), { expires: 7 }); // Store menu items in cookies for 1 day
      navigate("/home");
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleLogin = async () => {
    setUsernameError("");
    setPasswordError("");
    let formIsValid = true;

    if (!userData.username) {
      setUsernameError("Please enter your user name");
      formIsValid = false;
    }
    if (!userData.password) {
      setPasswordError("Please enter your password");
      formIsValid = false;
    }
    if (!formIsValid) {
      return;
    }

    const url = `${baseURLv1}/adminLogin/loginAdmin`;
    const headers = { in_platform_type_id: "4" };
    const data = { in_user_name: userData.username, in_password: userData.password };

    try {
      const res = await axios.post(url, data, { headers });
      enqueueSnackbar(res.data.message, { variant: "success" });
      fetchUserData(res.data.data.user_id);
      //navigate("/home");
    } catch (err) {
      const errorMessage = err.response ? err.response.data : "Error occurred";
      enqueueSnackbar(errorMessage.message || errorMessage, { variant: "error" });
    }

    setUserData((prevData) => ({
      ...prevData,
      username: "",
      password: "",
    }));
  };

  return (
    <Card elevation={3} sx={{ p: 2, width: "80%", borderRadius: 2 }}>
      <Typography variant="h5" color="textPrimary" gutterBottom textAlign="center" mt={2} mb={2}>
        Admin Panel Login
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom fontSize="13px">
        Please enter your registered User Name and Password:
      </Typography>
      <form>
        <TextField
          label="User Name"
          id="username"
          name="username"
          variant="outlined"
          color="success"
          focused
          fullWidth
          margin="normal"
          autoComplete="username"
          value={userData.username}
          onChange={handleChange}
          error={!!usernameError}
          helperText={usernameError}
          required
          inputProps={{ maxLength: 20 }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          color="success"
          fullWidth
          margin="normal"
          name="password"
          id="password"
          autoComplete="current-password"
          value={userData.password}
          onChange={handleChange}
          error={!!passwordError}
          helperText={passwordError}
          required
          inputProps={{ maxLength: 15 }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <Button
          variant="contained"
          fullWidth
          type="button"
          onClick={handleLogin}
          sx={{
            mt: 2,
            backgroundColor: "rgba(67,160,71)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(46, 112, 49)" },
            borderRadius: 2,
          }}
        >
          Log In
        </Button>
        <Typography
          variant="body2"
          fontStyle="italic"
          sx={{ fontSize: "10px", mt: 3 }}
          color="textSecondary"
        >
          *** To request password reset, please contact your system administrator.
        </Typography>
      </form>
    </Card>
  );
};

export default LoginForm;
