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
  }, [openDeleteDialog, adminUsers]);

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
    // console.log("user", user);

    if (user.user_id !== undefined) {
      console.log("yuscgdhuhsuhidsy");
      setNewUser({
        User_Id: user.user_id,
        Full_Name: user.full_name,
        Is_Active: user.is_active,
        Designation: user.designation,
        User_Name: user.user_name,
        Password: user.user_id ? "12345678" : "",
        Permissions: permissions,
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
    console.log("errors", errors);

    if (!validateForm()) return;
    const headers = { in_platform_type_id: "4" };
    let data = {
      in_full_name: newUser.Full_Name,
      in_designation: newUser.Designation,
      in_user_name: newUser.User_Name,
      in_password: newUser.Password,
      in_user_type_id: selectedUserType,
      in_is_active: newUser.Is_Active ? 1 : 0,
      in_prm_menu_account_main: newUser.Permissions.includes("Menu > Account management") ? 1 : 0,
      in_prm_menu_account_merchant: newUser.Permissions.includes(
        "Menu > Account management > Merchant"
      )
        ? 1
        : 0,
      in_prm_menu_account_consumer: newUser.Permissions.includes(
        "Menu > Account management > Consumer"
      )
        ? 1
        : 0,
      in_prm_menu_users: newUser.Permissions.includes("Menu > Account management > Users") ? 1 : 0,
      in_prm_menu_network: newUser.Permissions.includes("Menu > My Network") ? 1 : 0,
      in_prm_menu_eshop_dash: newUser.Permissions.includes("Menu > eShop Dashboard") ? 1 : 0,
      in_prm_menu_eshop_page: newUser.Permissions.includes("Menu > eShop Admin Site") ? 1 : 0,
      in_prm_menu_transactions: newUser.Permissions.includes("Menu > Transactions") ? 1 : 0,
      in_prm_menu_reports: newUser.Permissions.includes("Menu > Reports") ? 1 : 0,
      in_prm_menu_withdraw: newUser.Permissions.includes("Menu > Withdraw Request") ? 1 : 0,
      in_prm_menu_license: newUser.Permissions.includes("Menu > License Verification") ? 1 : 0,
      in_prm_menu_support: newUser.Permissions.includes("Menu > contact Support") ? 1 : 0,
      in_prm_notification_support: newUser.Permissions.includes("Notifications - Contact Support")
        ? 1
        : 0,
      in_prm_notification_license: newUser.Permissions.includes("Notifications - License Verify")
        ? 1
        : 0,
      in_prm_notification_withdraw: newUser.Permissions.includes("Notifications - withdrawal")
        ? 1
        : 0,
      in_prm_system_settings: newUser.Permissions.includes("Systems Settings") ? 1 : 0,
      in_prm_merchant_register: newUser.Permissions.includes("Merchant - Register") ? 1 : 0,
      in_prm_merchant_view: newUser.Permissions.includes("Merchant - View Profile") ? 1 : 0,
      in_prm_merchant_transactions: newUser.Permissions.includes("Merchant - Transactions") ? 1 : 0,
      in_prm_merchant_status: newUser.Permissions.includes("Merchant - Change Status") ? 1 : 0,
      in_prm_consumer_view: newUser.Permissions.includes("Consumer - View Profile") ? 1 : 0,
      in_prm_consumer_transactions: newUser.Permissions.includes("Consumer - Transactions") ? 1 : 0,
      in_prm_consumer_status: newUser.Permissions.includes("Consumer - change Status") ? 1 : 0,
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
            {newUser.User_Id ? "Edit Admin User" : "New Admin User"}
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
                  InputProps={{ sx: { fontSize: 14 } }}
                  InputLabelProps={{ sx: { fontSize: 14 } }}
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
                  InputProps={{ sx: { fontSize: 14 } }}
                  InputLabelProps={{ sx: { fontSize: 14 } }}
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
                  InputProps={{ sx: { fontSize: 14 } }}
                  InputLabelProps={{ sx: { fontSize: 14 } }}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>
              <Grid item xs={4} marginTop={"8px"}>
                <FormControl fullWidth required error={errors.User_Type}>
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
                    name="User_Type"
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
                  InputProps={{ sx: { fontSize: 14 } }}
                  InputLabelProps={{ sx: { fontSize: 14 } }}
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
                            checked={newUser.Permissions.includes(permission)}
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
