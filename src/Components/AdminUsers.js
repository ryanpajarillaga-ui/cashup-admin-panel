import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Header from "./Header";
import PersonIcon from "@mui/icons-material/Person";
import VerticalNav from "./VerticalNav";
import axios from "axios";

const AdminUsers = () => {
  const permissionsList = [
    "Menu > Account management",
    "Menu > Account management > Merchant",
    "Menu > Account management > Consumer",
    "Menu > Account management > Users",
    "Menu > My Network",
    "Menu > eShop Dashboard",
    "Menu > eShop Admin Site",
    "Menu > Transactions",
    "Menu > Reports",
    "Menu > Withdraw Request",
    "Menu > License Verification",
    "Menu > contact Support",
    "Merchant - Register",
    "Merchant - View Profile",
    "Merchant - Transactions",
    "Merchant - Change Status",
    "Consumer - View Profile",
    "Consumer - Transactions",
    "Consumer - change Status",
    "Admin Users - Full Control",
    "Notifications - Contact Support",
    "Notifications - License Verify",
    "Notifications - withdrawal",
    "Process - License Verification",
    "Process - Withdrawal",
    "Process - Contact Support",
    "Systems Settings",
  ];

  const SuperAdminPermissionsList = permissionsList;
  const AdministratorPermissionsList = [
    "Menu > Account management",
    "Menu > Account management > Merchant",
    "Menu > Account management > Consumer",
    "Menu > My Network",
    "Menu > eShop Dashboard",
    "Menu > eShop Admin Site",
    "Menu > Transactions",
    "Menu > Reports",
    "Menu > Withdraw Request",
    "Menu > License Verification",
    "Menu > contact Support",
    "Merchant - Register",
    "Merchant - View Profile",
    "Merchant - Transactions",
    "Merchant - Change Status",
    "Consumer - View Profile",
    "Consumer - Transactions",
    "Consumer - change Status",
    "Notifications - Contact Support",
    "Notifications - License Verify",
    "Notifications - withdrawal",
    "Process - License Verification",
    "Process - Withdrawal",
    "Process - Contact Support",
  ];
  const AccountsPermissionsList = [
    "Menu > My Network",
    "Menu > eShop Dashboard",
    "Menu > Reports",
    "Menu > Withdraw Request",
    "Notifications - withdrawal",
    "Process - Withdrawal",
    "Menu > Transactions",
  ];
  const GeneralUserPermissionsList = [
    "Menu > Account management > Merchant",
    "Menu > Account management > Consumer",
    "Menu > My Network",
    "Menu > Transactions",
    "Menu > eShop Dashboard",

    "Notifications - Contact Support",
    "Notifications - License Verify",
    "Menu > License Verification",
    "Menu > contact Support",

    "Merchant - View Profile",
    "Merchant - Transactions",
    "Process - License Verification",
    "Process - Contact Support",
    "Consumer - View Profile",
    "Consumer - Transactions",
  ];

  const [adminUsers, setAdminUsers] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    userId: null,
    full_name: "",
    is_active: true,
    designation: "",
    user_name: "",
    user_type: null,
    password: "",
    permissions: [],
  });

  const [errors, setErrors] = useState({});
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState();

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];
  const currentUserId = userData.user_id;

  const fetchAdminUsers = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminManageUser/getAdminUserAccountList`);
      setAdminUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  };

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllUserType`);
      setUserTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching User types:", error);
    }
  };

  useEffect(() => {
    if (openDeleteDialog) {
      setOpenAddDialog(false);
    }
    fetchAdminUsers();
    fetchUserTypes();
  }, [openDeleteDialog]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
    setOpenAddDialog(false);
  };

  const handleAddClick = (user) => {
    let permissions = [];
    if (user.user_type_id == 1) {
      permissions = GeneralUserPermissionsList;
    } else if (user.user_type_id == 2) {
      permissions = AccountsPermissionsList;
    } else if (user.user_type_id == 3) {
      permissions = AccountsPermissionsList;
    } else {
      permissions = SuperAdminPermissionsList;
    }
    setOpenAddDialog(true);
    if (user) {
      setNewUser({
        userId: user.user_id,
        full_name: user.full_name,
        is_active: user.is_active,
        designation: user.designation,
        user_name: user.user_name,
        password: user.user_id ? "12345678" : "",
        permissions: permissions,
      });
      setSelectedUserType(user.user_type_id);
    }
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    const data = {
      in_user_id: selectedUser.user_id,
      in_logged_user_id: currentUserId,
    };
    const headers = { in_platform_type_id: "4" };

    if (selectedUser) {
      try {
        await axios.post(`${baseURLv1}/adminManageUser/deleteAdminUserAccount`, data, { headers });
        setAdminUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== selectedUser.user_id)
        );
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        handleDeleteClose();
      }
    }
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
    setNewUser({
      userId: null,
      full_name: "",
      is_active: true,
      designation: "",
      user_name: "",
      user_type: null,
      password: "",
      permissions: [],
    });
    setErrors({});
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevNewUser) => ({ ...prevNewUser, [name]: value }));

    // Validate field on change
    if (value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.replace("_", " ")} is required`,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleAddCheckboxChange = (permission) => {
    setNewUser((prevNewUser) => {
      const permissions = prevNewUser.permissions.includes(permission)
        ? prevNewUser.permissions.filter((perm) => perm !== permission)
        : [...prevNewUser.permissions, permission];
      return { ...prevNewUser, permissions };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (newUser.full_name.trim() === "") newErrors.full_name = "Full Name is required";
    if (newUser.designation.trim() === "") newErrors.designation = "Designation is required";
    if (newUser.user_name.trim() === "") newErrors.user_name = "User Name is required";
    if (newUser.user_type < 1) newErrors.user_type = "User Type is requireddd";
    if (newUser.password.trim() === "") newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddConfirm = async () => {
    console.log("useridh:", newUser.userId);
    if (!validateForm()) return;
    const headers = { in_platform_type_id: "4" };
    let data = {
      in_full_name: newUser.full_name,
      in_designation: newUser.designation,
      in_user_name: newUser.user_name,
      in_password: newUser.password,
      in_user_type_id: selectedUserType,
      in_is_active: newUser.is_active ? 1 : 0,
      in_prm_menu_account_main: newUser.permissions.includes("Menu > Account management") ? 1 : 0,
      in_prm_menu_account_merchant: newUser.permissions.includes(
        "Menu > Account management > Merchant"
      )
        ? 1
        : 0,
      in_prm_menu_account_consumer: newUser.permissions.includes(
        "Menu > Account management > Consumer"
      )
        ? 1
        : 0,
      in_prm_menu_users: newUser.permissions.includes("Menu > Account management > Users") ? 1 : 0,
      in_prm_menu_network: newUser.permissions.includes("Menu > My Network") ? 1 : 0,
      in_prm_menu_eshop_dash: newUser.permissions.includes("Menu > eShop Dashboard") ? 1 : 0,
      in_prm_menu_eshop_page: newUser.permissions.includes("Menu > eShop Admin Site") ? 1 : 0,
      in_prm_menu_transactions: newUser.permissions.includes("Menu > Transactions") ? 1 : 0,
      in_prm_menu_reports: newUser.permissions.includes("Menu > Reports") ? 1 : 0,
      in_prm_menu_withdraw: newUser.permissions.includes("Menu > Withdraw Request") ? 1 : 0,
      in_prm_menu_license: newUser.permissions.includes("Menu > License Verification") ? 1 : 0,
      in_prm_menu_support: newUser.permissions.includes("Menu > contact Support") ? 1 : 0,
      in_prm_notification_support: newUser.permissions.includes("Notifications - Contact Support")
        ? 1
        : 0,
      in_prm_notification_license: newUser.permissions.includes("Notifications - License Verify")
        ? 1
        : 0,
      in_prm_notification_withdraw: newUser.permissions.includes("Notifications - withdrawal")
        ? 1
        : 0,
      in_prm_system_settings: newUser.permissions.includes("Systems Settings") ? 1 : 0,
      in_prm_merchant_register: newUser.permissions.includes("Merchant - Register") ? 1 : 0,
      in_prm_merchant_view: newUser.permissions.includes("Merchant - View Profile") ? 1 : 0,
      in_prm_merchant_transactions: newUser.permissions.includes("Merchant - Transactions") ? 1 : 0,
      in_prm_merchant_status: newUser.permissions.includes("Merchant - Change Status") ? 1 : 0,
      in_prm_consumer_view: newUser.permissions.includes("Consumer - View Profile") ? 1 : 0,
      in_prm_consumer_transactions: newUser.permissions.includes("Consumer - Transactions") ? 1 : 0,
      in_prm_consumer_status: newUser.permissions.includes("Consumer - change Status") ? 1 : 0,
      in_prm_users_full: newUser.permissions.includes("Admin Users - Full Control") ? 1 : 0,
      in_prm_license_process: newUser.permissions.includes("Process - License Verification")
        ? 1
        : 0,
      in_prm_withdraw_process: newUser.permissions.includes("Process - Withdrawal") ? 1 : 0,
      in_prm_support_process: newUser.permissions.includes("Process - Contact Support") ? 1 : 0,
      in_logged_user_id: currentUserId,
    };
    if (newUser.userId) {
      data = { ...data, in_user_id: newUser.userId };
    }
    try {
      const response = null;
      if (newUser.userId) {
        response = await axios.post(`${baseURLv1}/adminManageUser/updateAdminUserAccount`, data, {
          headers,
        });
        setAdminUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === newUser.userId
              ? {
                  ...user,
                  designation: newUser.designation,
                  full_name: newUser.full_name,
                  is_active: newUser.is_active,
                  user_name: newUser.user_name,
                  user_type: selectedUserType,
                }
              : user
          )
        );
      } else {
        response = await axios.post(`${baseURLv1}/adminManageUser/insertAdminUserAccount`, data, {
          headers,
        });
        const AddedUser = {
          designation: newUser.designation,
          full_name: newUser.full_name,
          is_active: newUser.is_active,
          user_id: response.data.data.new_inserted_ID,
          user_name: newUser.user_name,
          user_type: newUser.user_type,
          user_type_id: newUser.user_type,
        };
        setAdminUsers((prevUsers) => [...prevUsers, AddedUser]);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      handleAddClose();
    }
  };

  // const handleEditConfirm = async () => {
  //   if (!validateForm()) return;

  //   const data = {
  //     in_user_id: editUser.user_id,
  //     in_full_name: editUser.full_name,
  //     in_designation: editUser.designation,
  //     in_user_name: editUser.user_name,
  //     in_password: editUser.password,
  //     in_user_type_id: 1,
  //     in_is_active: editUser.is_active ? 1 : 0,
  //     in_prm_menu_account_main: editUser.permissions.includes("Permission 1") ? 1 : 0,
  //     in_prm_menu_account_merchant: editUser.permissions.includes("Permission 2") ? 1 : 0,
  //     // Add other permissions accordingly
  //     in_logged_user_id: currentUserId,
  //   };
  //   try {
  //     await axios.post(`${baseURLv1}/adminManageUser/updateAdminUserAccount`, data);
  //     setAdminUsers((prevUsers) =>
  //       prevUsers.map((user) => (user.user_id === editUser.user_id ? editUser : user))
  //     );
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //   } finally {
  //     handleEditClose();
  //   }
  // };

  const handleUserType = (e) => {
    const { name, value } = e.target;
    setNewUser((prevNewUser) => ({ ...prevNewUser, [name]: value }));
    const userType = value;
    if (value < 1) {
      console.log("value less than 1");
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.replace("_", " ")} is required`,
      }));
    } else {
      console.log("value greater than 1");

      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
    setSelectedUserType(userType);

    if (userType == 1) {
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        permissions: GeneralUserPermissionsList,
      }));
    } else if (userType == 2) {
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        permissions: AccountsPermissionsList,
      }));
    } else if (userType == 3) {
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        permissions: AdministratorPermissionsList,
      }));
    } else if (userType == 4) {
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        permissions: SuperAdminPermissionsList,
      }));
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <VerticalNav />
      <Box component="main" marginTop="4%" sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
            <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, mb: 1 }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Admin Users
            </Typography>
          </Box>
          <Link
            component="button"
            onClick={handleAddClick}
            color="rgba(67,160,71)"
            variant="body2"
            sx={{ textDecoration: "none" }}
            fontWeight={"bold"}
          >
            ADD NEW +
          </Link>
        </Box>

        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", margin: "auto" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: "4px" }}>Full Name</TableCell>
                  <TableCell sx={{ padding: "4px" }}>Status</TableCell>
                  <TableCell sx={{ padding: "4px" }}>Designation</TableCell>
                  <TableCell sx={{ padding: "4px" }}>User name</TableCell>
                  <TableCell sx={{ padding: "4px" }}>User Type</TableCell>
                  <TableCell sx={{ padding: "4px" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminUsers.map((user) => (
                  <TableRow
                    key={user.user_id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)", // Change this to your desired color
                      },
                    }}
                    onClick={() => handleAddClick(user)}
                  >
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>{user.full_name}</Box>
                    </TableCell>
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      {user.is_active ? (
                        <Chip
                          label={
                            <span className="flex gap-3 items-center justify-center">Active</span>
                          }
                          color="success"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label={
                            <span className="flex gap-3 items-center justify-center">Inactive</span>
                          }
                          color="error"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      {user.designation}
                    </TableCell>
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      {user.user_name}
                    </TableCell>
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      {user.user_type}
                    </TableCell>
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      <IconButton
                        aria-label="Delete"
                        color="customRed"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: "14px" }}>
              Are you sure you want to delete this User?
              <br />
              This action cannot to undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="customGreen" sx={{ fontWeight: "bold" }}>
              CANCEL
            </Button>
            <Button onClick={handleDeleteConfirm} color="customRed" sx={{ fontWeight: "bold" }}>
              DELETE
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openAddDialog}
          onClose={handleAddClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="form-dialog-title">
            {newUser.userId ? "Edit Admin User" : "Add New Admin User"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ paddingTop: 0 }}>
              <Grid item xs={4}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="full_name"
                  label="Full Name"
                  type="text"
                  color="customGreen"
                  required
                  fullWidth
                  value={newUser.full_name}
                  onChange={handleAddChange}
                  error={Boolean(errors.full_name)}
                  helperText={errors.full_name}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: 14 } }}
                  InputLabelProps={{ sx: { fontSize: 14 } }}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="designation"
                  label="Designation"
                  type="text"
                  color="customGreen"
                  fullWidth
                  required
                  value={newUser.designation}
                  onChange={handleAddChange}
                  error={Boolean(errors.designation)}
                  helperText={errors.designation}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: 14 } }}
                  InputLabelProps={{ sx: { fontSize: 14 } }}
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="user_name"
                  label="User Name"
                  type="text"
                  color="customGreen"
                  fullWidth
                  required
                  value={newUser.user_name}
                  onChange={handleAddChange}
                  error={Boolean(errors.user_name)}
                  helperText={errors.user_name}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: 14 } }}
                  InputLabelProps={{ sx: { fontSize: 14 } }}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>
              <Grid item xs={4} marginTop={"8px"}>
                <FormControl fullWidth required error={!!errors.user_type}>
                  <InputLabel
                    id="usertype-dropdown"
                    color="customGreen"
                    style={{ fontSize: "14px" }}
                  >
                    User Type
                  </InputLabel>
                  <Select
                    labelId="usertype-dropdown"
                    id="dropdown"
                    name="user_type"
                    value={selectedUserType}
                    onChange={handleUserType}
                    label="Select an Option"
                    color="customGreen"
                    sx={{
                      borderRadius: 2,
                      fontSize: "14px",
                    }}
                  >
                    {userTypes.map((option) => (
                      <MenuItem
                        key={option.user_type_id}
                        value={option.user_type_id}
                        style={{ fontSize: "14px" }}
                      >
                        {option.user_type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.user_type && <FormHelperText>{errors.user_type}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="password"
                  label="Password"
                  type="password"
                  color="customGreen"
                  fullWidth
                  required
                  value={newUser.password}
                  onChange={handleAddChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: 14 } }}
                  InputLabelProps={{ sx: { fontSize: 14 } }}
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newUser.is_active}
                      color="customGreen"
                      onChange={() =>
                        setNewUser((prev) => ({ ...prev, is_active: !prev.is_active }))
                      }
                      name="is_active"
                    />
                  }
                  label="Active User"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: 14, // Adjust the font size as needed
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom marginBottom={"16px"}>
                  Permissions
                </Typography>
                <Grid container spacing={2}>
                  {permissionsList.map((permission, index) => (
                    <Grid item xs={4} key={index} style={{ paddingTop: 0 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={newUser.permissions.includes(permission)}
                            color="customGreen"
                            onChange={() => handleAddCheckboxChange(permission)}
                            name={permission}
                          />
                        }
                        label={permission}
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: 14, // Adjust the font size as needed
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleAddClose} color="customGreen" sx={{ fontWeight: "bold" }}>
              CANCEL
            </Button>
            <Button onClick={handleAddConfirm} color="customGreen" sx={{ fontWeight: "bold" }}>
              SAVE
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminUsers;
