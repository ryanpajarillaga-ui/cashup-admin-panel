import * as Yup from "yup";

import { Box, Button, Divider, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";

import { Avatar } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import Cookies from "js-cookie";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Profile = ({ anchorEl, submenuOpen, handleClose, userData, updateState }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    fullname: Yup.string().required("Full Name is required"),
    designation: Yup.string().required("Designation is required"),
    username: Yup.string().required("User Name is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    retypePassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Retype Password is required"),
  });

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const fetchUserData = async (userId) => {
    const url = `${baseURLv1}/adminHome/getUserMainInfo/${userId}`; // Replace with your API endpoint for menu items

    try {
      const response = await axios.get(url);
      const data = await response.data;
      Cookies.remove("userData");
      Cookies.set("userData", JSON.stringify(data), { expires: 7 }); // Store menu items in cookies for 1 day
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const initialValues = {
    fullname: userData.full_name,
    designation: userData.designation,
    username: userData.user_name,
    password: "123456789012345",
    retypePassword: "123456789012345",
  };

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      const headers = { in_platform_type_id: "4" };
      const data = {
        in_user_id: userData.user_id,
        in_full_name: values.fullname,
        in_designation: values.designation,
        in_user_name: values.username,
        in_password: values.password,
      };
      const res = await axios.post(`${baseURLv1}/adminManageUser/updateUserProfile`, data, {
        headers,
      });
      await fetchUserData(userData.user_id);
      enqueueSnackbar(res.data.message, { variant: "success" });

      handleClose();
      updateState(data.in_full_name);
    } catch (error) {
      console.error("There was a problem with the axios request:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("userData"); // Remove user data cookie
    // Perform additional logout actions, such as redirecting to the login page
    window.location.href = "/";
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={submenuOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: "300px",
          padding: "16px",
        },
      }}
    >
      <MenuItem
        sx={{
          pointerEvents: "none",
          cursor: "default",
        }}
      >
        <Avatar sx={{ bgcolor: "#2e7d32", mr: 2 }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="body1">User Profile</Typography>
      </MenuItem>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Box mb={2} mt={2}>
              <Field
                as={TextField}
                name="fullname"
                label="Full Name"
                color="success"
                fullWidth
                required
                error={touched.fullname && Boolean(errors.fullname)}
                helperText={touched.fullname && errors.fullname}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{ sx: { fontSize: 14 } }}
                InputLabelProps={{ sx: { fontSize: 14 } }}
              />
            </Box>
            <Box mb={2}>
              <Field
                as={TextField}
                name="designation"
                label="Designation"
                color="success"
                fullWidth
                required
                error={touched.designation && Boolean(errors.designation)}
                helperText={touched.designation && errors.designation}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{ sx: { fontSize: 14 } }}
                InputLabelProps={{ sx: { fontSize: 14 } }}
              />
            </Box>
            <Divider />
            <Box mb={2} mt={2}>
              <Field
                as={TextField}
                name="username"
                label="User Name"
                color="success"
                fullWidth
                required
                inputProps={{ maxLength: 20 }}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{ sx: { fontSize: 14 } }}
                InputLabelProps={{ sx: { fontSize: 14 } }}
              />
            </Box>
            <Box mb={2}>
              <Field
                as={TextField}
                name="password"
                type="password"
                label="Password"
                color="success"
                fullWidth
                required
                inputProps={{ maxLength: 15 }}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{ sx: { fontSize: 14 } }}
                InputLabelProps={{ sx: { fontSize: 14 } }}
              />
            </Box>
            <Box mb={2}>
              <Field
                as={TextField}
                name="retypePassword"
                type="password"
                label="Retype Password"
                color="success"
                fullWidth
                required
                inputProps={{ maxLength: 15 }}
                error={touched.retypePassword && Boolean(errors.retypePassword)}
                helperText={touched.retypePassword && errors.retypePassword}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{ sx: { fontSize: 14 } }}
                InputLabelProps={{ sx: { fontSize: 14 } }}
              />
            </Box>
            {userData.system_settings ? (
              <>
                <Divider sx={{ my: 2 }} />
                <Box
                  mt={2}
                  mb={1.5}
                  sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}
                >
                  <BuildIcon color="customGreen" />
                  <Typography variant="body2" sx={{ color: "#4caf50" }}>
                    Manage System Settings
                  </Typography>
                </Box>
              </>
            ) : null}

            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="button"
                variant="contained"
                width="80%"
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.75rem",
                  backgroundColor: "rgba(67,160,71)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(46, 112, 49)" },
                  borderRadius: 2,
                }}
                onClick={handleLogout}
              >
                Log Out
              </Button>
              <Button
                type="submit"
                variant="contained"
                width="80%"
                size="20px"
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.75rem",
                  backgroundColor: "rgba(67,160,71)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(46, 112, 49)" },
                  borderRadius: 2,
                }}
              >
                Save
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Menu>
  );
};

export default Profile;
