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
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "./Header";
import PersonIcon from "@mui/icons-material/Person";
import VerticalNav from "./VerticalNav";
import axios from "axios";

const AdminUsers = () => {
  const permissionsList = [
    "Menu > Account Management",
    "Menu > Withdraw Request",
    "Consumer - Change Status",
    "Menu > Account > Merchant",
    "Menu > License Verification",
    "Admin Users - Full Control",
    "Menu > Account > Consumer",
    "Menu > Contact Support",
    "Notifications - Contact Support",
    "Menu > Account > Users",
    "Merchant - Register",
    "Notifications - License Verify",
    "Menu > My Network",
    "Merchant - View Profile",
    "Notifications - Withdrawal",
    "Menu > eShop Dashboard",
    "Merchant - Transactions",
    "Process - License Verification",
    "Menu > eShop Admin Site",
    "Merchant - Change Status",
    "Process - Withdrawal",
    "Menu > Transactions",
    "Consumer - View Profile",
    "Process - Contact Support",
    "Menu > Reports",
    "Consumer - Transactions",
    "Systems Settings",
  ];

  const SuperAdminPermissionsList = permissionsList;
  const AdministratorPermissionsList = [
    "Menu > Account Management",
    "Menu > Account > Merchant",
    "Menu > Account > Consumer",
    "Menu > My Network",
    "Menu > eShop Dashboard",
    "Menu > eShop Admin Site",
    "Menu > Transactions",
    "Menu > Reports",
    "Menu > Withdraw Request",
    "Menu > License Verification",
    "Menu > Contact Support",
    "Merchant - Register",
    "Merchant - View Profile",
    "Merchant - Transactions",
    "Merchant - Change Status",
    "Consumer - View Profile",
    "Consumer - Transactions",
    "Consumer - Change Status",
    "Notifications - Contact Support",
    "Notifications - License Verify",
    "Notifications - Withdrawal",
    "Process - License Verification",
    "Process - Withdrawal",
    "Process - Contact Support",
  ];
  const AccountsPermissionsList = [
    "Menu > My Network",
    "Menu > eShop Dashboard",
    "Menu > Reports",
    "Notifications - Withdrawal",
    "Menu > Withdraw Request",
    "Process - Withdrawal",
    "Menu > Transactions",
  ];
  const GeneralUserPermissionsList = [
    "Menu > Account Management",
    "Menu > Account > Merchant",
    "Menu > Account > Consumer",
    "Menu > My Network",
    "Menu > Transactions",
    "Menu > eShop Dashboard",
    "Notifications - Contact Support",
    "Notifications - License Verify",
    "Menu > License Verification",
    "Menu > Contact Support",
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
    User_Id: null,
    Full_Name: "",
    Is_Active: true,
    Designation: "",
    User_Name: "",
    User_Type: null,
    Password: "",
    Permissions: [],
  });
  const [errors, setErrors] = useState({});
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState();
  const [usersListchanged, setUsersListchanged] = useState(false);

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
    setOpenAddDialog(false);
    setNewUser({
      User_Id: null,
      Full_Name: "",
      Is_Active: true,
      Designation: "",
      User_Name: "",
      User_Type: null,
      Password: "",
      Permissions: [],
    });
    setSelectedUserType();

    fetchAdminUsers();
    fetchUserTypes();
  }, [openDeleteDialog, usersListchanged]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`${baseURLv1}/adminHome/getUserMainInfo/${id}`);
      const data = response.data.data[0];
      const Permissions = [
        data.menu_accounts_main ? "Menu > Account Management" : null,
        data.menu_accounts_merchant ? "Menu > Account > Merchant" : null,
        data.menu_accounts_consumer ? "Menu > Account > Consumer" : null,
        data.menu_accounts_user ? "Menu > Account > Users" : null,
        data.menu_network ? "Menu > My Network" : null,
        data.menu_eshop_dashboard ? "Menu > eShop Dashboard" : null,
        data.menu_eshop_page ? "Menu > eShop Admin Site" : null,
        data.menu_transactions ? "Menu > Transactions" : null,
        data.menu_reports ? "Menu > Reports" : null,
        data.menu_withdraw ? "Menu > Withdraw Request" : null,
        data.menu_license ? "Menu > License Verification" : null,
        data.menu_support ? "Menu > Contact Support" : null,
        data.notification_support ? "Notifications - Contact Support" : null,
        data.notification_license ? "Notifications - License Verify" : null,
        data.notification_withdraw ? "Notifications - Withdrawal" : null,
        data.system_settings ? "Systems Settings" : null,
        data.merchant_register ? "Merchant - Register" : null,
        data.merchant_view ? "Merchant - View Profile" : null,
        data.merchant_transactions ? "Merchant - Transactions" : null,
        data.merchant_status ? "Merchant - Change Status" : null,
        data.consumer_view ? "Consumer - View Profile" : null,
        data.consumer_transaction ? "Consumer - Transactions" : null,
        data.consumer_status ? "Consumer - Change Status" : null,
        data.manage_users ? "Admin Users - Full Control" : null,
        data.workflow_license ? "Process - License Verification" : null,
        data.workflow_withdraw ? "Process - Withdrawal" : null,
        data.workflow_support ? "Process - Contact Support" : null,
      ].filter((permission) => permission !== null);
      return Permissions;
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  };

  const handleAddClick = async (user) => {
    setOpenAddDialog(true);
    setSelectedUserType();
    if (user.user_id !== undefined) {
      setSelectedUserType(user.user_type_id);
      let permissions = await fetchUserData(user.user_id);
      setNewUser({
        User_Id: user.user_id,
        Full_Name: user.full_name,
        Is_Active: user.is_active,
        Designation: user.designation,
        User_Name: user.user_name,
        Password: user.user_id ? "12345678" : "",
        Permissions: permissions,
      });
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
      User_Id: null,
      Full_Name: "",
      Is_Active: true,
      Designation: "",
      User_Name: "",
      User_Type: null,
      Password: "",
      Permissions: [],
    });
    setErrors({});
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevNewUser) => ({ ...prevNewUser, [name]: value }));
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
      const Permissions = prevNewUser.Permissions.includes(permission)
        ? prevNewUser.Permissions.filter((perm) => perm !== permission)
        : [...prevNewUser.Permissions, permission];
      return { ...prevNewUser, Permissions };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (newUser.Full_Name.trim() === "") newErrors.Full_Name = "Full Name is required";
    if (newUser.Designation.trim() === "") newErrors.Designation = "Designation is required";
    if (newUser.User_Name.trim() === "") newErrors.User_Name = "User Name is required";
    if (newUser.User_Type < 1) newErrors.User_Type = "User Type is required";
    if (newUser.Password.trim() === "") newErrors.Password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddConfirm = async () => {
    if (!validateForm()) return;
    const headers = { in_platform_type_id: "4" };
    let data = {
      in_full_name: newUser.Full_Name,
      in_designation: newUser.Designation,
      in_user_name: newUser.User_Name,
      in_password: newUser.Password,
      in_user_type_id: selectedUserType,
      in_is_active: newUser.Is_Active ? 1 : 0,
      in_prm_menu_account_main: newUser.Permissions.includes("Menu > Account Management") ? 1 : 0,
      in_prm_menu_account_merchant: newUser.Permissions.includes("Menu > Account > Merchant")
        ? 1
        : 0,
      in_prm_menu_account_consumer: newUser.Permissions.includes("Menu > Account > Consumer")
        ? 1
        : 0,
      in_prm_menu_users: newUser.Permissions.includes("Menu > Account > Users") ? 1 : 0,
      in_prm_menu_network: newUser.Permissions.includes("Menu > My Network") ? 1 : 0,
      in_prm_menu_eshop_dash: newUser.Permissions.includes("Menu > eShop Dashboard") ? 1 : 0,
      in_prm_menu_eshop_page: newUser.Permissions.includes("Menu > eShop Admin Site") ? 1 : 0,
      in_prm_menu_transactions: newUser.Permissions.includes("Menu > Transactions") ? 1 : 0,
      in_prm_menu_reports: newUser.Permissions.includes("Menu > Reports") ? 1 : 0,
      in_prm_menu_withdraw: newUser.Permissions.includes("Menu > Withdraw Request") ? 1 : 0,
      in_prm_menu_license: newUser.Permissions.includes("Menu > License Verification") ? 1 : 0,
      in_prm_menu_support: newUser.Permissions.includes("Menu > Contact Support") ? 1 : 0,
      in_prm_notification_support: newUser.Permissions.includes("Notifications - Contact Support")
        ? 1
        : 0,
      in_prm_notification_license: newUser.Permissions.includes("Notifications - License Verify")
        ? 1
        : 0,
      in_prm_notification_withdraw: newUser.Permissions.includes("Notifications - Withdrawal")
        ? 1
        : 0,
      in_prm_system_settings: newUser.Permissions.includes("Systems Settings") ? 1 : 0,
      in_prm_merchant_register: newUser.Permissions.includes("Merchant - Register") ? 1 : 0,
      in_prm_merchant_view: newUser.Permissions.includes("Merchant - View Profile") ? 1 : 0,
      in_prm_merchant_transactions: newUser.Permissions.includes("Merchant - Transactions") ? 1 : 0,
      in_prm_merchant_status: newUser.Permissions.includes("Merchant - Change Status") ? 1 : 0,
      in_prm_consumer_view: newUser.Permissions.includes("Consumer - View Profile") ? 1 : 0,
      in_prm_consumer_transactions: newUser.Permissions.includes("Consumer - Transactions") ? 1 : 0,
      in_prm_consumer_status: newUser.Permissions.includes("Consumer - Change Status") ? 1 : 0,
      in_prm_users_full: newUser.Permissions.includes("Admin Users - Full Control") ? 1 : 0,
      in_prm_license_process: newUser.Permissions.includes("Process - License Verification")
        ? 1
        : 0,
      in_prm_withdraw_process: newUser.Permissions.includes("Process - Withdrawal") ? 1 : 0,
      in_prm_support_process: newUser.Permissions.includes("Process - Contact Support") ? 1 : 0,
      in_logged_user_id: currentUserId,
    };
    if (newUser.User_Id) {
      data = { ...data, in_user_id: newUser.User_Id };
    }
    try {
      const response = null;
      if (newUser.User_Id) {
        response = await axios.post(`${baseURLv1}/adminManageUser/updateAdminUserAccount`, data, {
          headers,
        });
        setAdminUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === newUser.User_Id
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
          designation: newUser.Designation,
          full_name: newUser.Full_Name,
          is_active: newUser.Is_Active,
          user_id: response.data.data.new_inserted_ID,
          user_name: newUser.User_Name,
          user_type: newUser.User_Type,
          user_type_id: newUser.User_Type,
        };
        setAdminUsers((prevUsers) => [...prevUsers, AddedUser]);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      handleAddClose();
      setUsersListchanged(!usersListchanged);
    }
  };

  const handleUserType = (e) => {
    const { name, value } = e.target;
    setNewUser((prevNewUser) => ({ ...prevNewUser, [name]: value }));
    const userType = value;
    if (value < 1) {
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
    setSelectedUserType(userType);

    if (userType == 1) {
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        Permissions: GeneralUserPermissionsList,
      }));
    } else if (userType == 2) {
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        Permissions: AccountsPermissionsList,
      }));
    } else if (userType == 3) {
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        Permissions: AdministratorPermissionsList,
      }));
    } else if (userType == 4) {
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        Permissions: SuperAdminPermissionsList,
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
            <Typography variant="h6" gutterBottom fontSize={"1.2rem"}>
              Admin Users
            </Typography>
          </Box>
          <Button
            variant="text"
            onClick={handleAddClick}
            size="small"
            sx={{
              color: "rgb(67, 160, 71)",
              fontSize: "0.75rem",
            }}
          >
            ADD NEW +
          </Button>
        </Box>
        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", margin: "auto" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: "4px" }}>Full Name</TableCell>
                  <TableCell sx={{ padding: "4px" }}>Status</TableCell>
                  <TableCell sx={{ padding: "4px" }}>Designation</TableCell>
                  <TableCell sx={{ padding: "4px" }}>User Name</TableCell>
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
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
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
                          sx={{
                            "& .MuiChip-label": {
                              fontSize: "0.7rem",
                            },
                          }}
                        />
                      ) : (
                        <Chip
                          label={
                            <span className="flex gap-3 items-center justify-center">Inactive</span>
                          }
                          color="error"
                          variant="outlined"
                          sx={{
                            "& .MuiChip-label": {
                              fontSize: "0.7rem",
                            },
                          }}
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
                      <Tooltip title={"Delete User"}>
                        <IconButton
                          aria-label="Delete"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
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
          <DialogTitle id="alert-dialog-title">
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, mb: 1 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h6" fontSize={"1.2rem"} gutterBottom>
                Delete User
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: "0.85rem" }}>
              Are you sure you want to delete this User? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="customGreen" sx={{ fontSize: "0.8rem" }}>
              CANCEL
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteConfirm}
              color="error"
              sx={{ fontSize: "0.8rem" }}
            >
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
          <DialogTitle id="form-dialog-title" variant="h6">
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, mb: 1 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h6" fontSize={"1.2rem"} gutterBottom>
                {newUser.User_Id ? "Edit Admin User" : "New Admin User"}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ paddingTop: 0 }}>
              <Grid item xs={4}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="Full_Name"
                  label="Full Name"
                  type="text"
                  color="customGreen"
                  required
                  fullWidth
                  value={newUser.Full_Name}
                  onChange={handleAddChange}
                  error={Boolean(errors.Full_Name)}
                  helperText={errors.Full_Name}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="Designation"
                  label="Designation"
                  type="text"
                  color="customGreen"
                  fullWidth
                  required
                  value={newUser.Designation}
                  onChange={handleAddChange}
                  error={Boolean(errors.Designation)}
                  helperText={errors.Designation}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="User_Name"
                  label="User Name"
                  type="text"
                  color="customGreen"
                  fullWidth
                  required
                  value={newUser.User_Name}
                  onChange={handleAddChange}
                  error={Boolean(errors.User_Name)}
                  helperText={errors.User_Name}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>
              <Grid item xs={4} marginTop={"8px"}>
                <FormControl fullWidth required error={errors.User_Type}>
                  <InputLabel
                    id="usertype-dropdown"
                    color="customGreen"
                    style={{ fontSize: "0.8rem" }}
                  >
                    User Type
                  </InputLabel>
                  <Select
                    labelId="usertype-dropdown"
                    id="dropdown"
                    name="User_Type"
                    value={selectedUserType}
                    onChange={handleUserType}
                    label="Select an Option"
                    color="customGreen"
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {userTypes.map((option) => (
                      <MenuItem
                        key={option.user_type_id}
                        value={option.user_type_id}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {option.user_type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.User_Type && <FormHelperText>{errors.User_Type}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="Password"
                  label="Password"
                  type="password"
                  color="customGreen"
                  fullWidth
                  required
                  value={newUser.Password}
                  onChange={handleAddChange}
                  error={Boolean(errors.Password)}
                  helperText={errors.Password}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newUser.Is_Active}
                      color="customGreen"
                      onChange={() =>
                        setNewUser((prev) => ({ ...prev, Is_Active: !prev.Is_Active }))
                      }
                      name="is_active"
                    />
                  }
                  label="Active User"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.8rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom marginBottom={"16px"} fontSize={"1.1rem"}>
                  Permissions
                </Typography>
                <Grid container spacing={2}>
                  {permissionsList.map((permission, index) => (
                    <Grid item xs={4} key={index} style={{ paddingTop: 0 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={newUser.Permissions.includes(permission)}
                            color="customGreen"
                            onChange={() => handleAddCheckboxChange(permission)}
                            name={permission}
                          />
                        }
                        label={permission}
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.8rem", // Adjust the font size as needed
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
            <Button
              onClick={handleAddClose}
              color="customGreen"
              size="small"
              sx={{
                fontSize: "0.75rem",
                lineHeight: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              CANCEL
            </Button>
            <Button
              onClick={handleAddConfirm}
              variant="contained"
              color="customGreen"
              size="small"
              sx={{
                fontSize: "0.75rem",
                lineHeight: "1.5rem",
                marginBottom: "2rem",
                marginRight: "2rem",
              }}
            >
              SAVE
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminUsers;
