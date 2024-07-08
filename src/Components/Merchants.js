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
  InputAdornment,
  InputBase,
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
import { alpha, styled } from "@mui/material/styles";

import ClearIcon from "@mui/icons-material/Clear";
import Cookies from "js-cookie";
import Header from "./Header";
import Pagination from "@mui/material/Pagination";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import VerticalNav from "./VerticalNav";
import axios from "axios";

const Merchants = () => {
  const [merchants, setMerchants] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(10); // Track total pages
  // const [itemsPerPage, setItemsPerPage] = useState(10); // Track total pages
  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];
  const currentUserId = userData.user_id;

  const fetchMerchants = async (searchText = "", selectedCategory = 1, pageNumber = 1) => {
    try {
      const data = {
        in_search_text: searchText,
        in_search_category_id: selectedCategory,
        in_page_number: pageNumber,
      };

      const response = await axios.post(
        `${baseURLv1}/adminManageMerchant/searchMerchantListByPage`,
        data
      );
      console.log(response.data.data.results_list);

      if (response.data.data.results_list) {
        console.log("jjjj");
        setMerchants(response.data.data.results_list);
        setTotalPages(response.data.data.total_number_of_pages);
        setCurrentPage(response.data.data.current_page_number);
      } else {
        setMerchants([]);
      }

      // setItemsPerPage(response.data.data.rows_per_page_limit);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const fetchSearchCategory = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllMerchantSearchCategory`);
      setSearchCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  useEffect(() => {
    fetchMerchants();
    fetchSearchCategory();
  }, []);

  const handleSearch = () => {
    if (selectedCategory == 0) {
      setSelectedCategory(null);
    }
    fetchMerchants(searchText, selectedCategory);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
    fetchMerchants("", selectedCategory);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedCategory(1);
    fetchMerchants("");
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchMerchants("", 1, page);
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
              <StoreOutlinedIcon />
            </Avatar>
            <Typography variant="h6" gutterBottom fontSize={"1.2rem"}>
              Merchants
            </Typography>
          </Box>
          <Button
            variant="text"
            size="small"
            sx={{
              color: "rgb(67, 160, 71)",
              fontSize: "0.75rem",
            }}
          >
            REGISTER +
          </Button>
        </Box>
        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", marginBottom: "2rem" }}>
          <Grid container spacing={2} style={{ paddingTop: 0 }}>
            <Grid item xs={7}>
              <TextField
                fullWidth
                color="customGreen"
                variant="outlined"
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Type search text here"
                sx={{
                  "& input": {
                    // paddingY: "14.5px", // Adjust padding as needed
                    fontSize: "0.8rem",
                  },
                }}
                inputProps={{ maxLength: 50 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <ClearIcon style={{ cursor: "pointer" }} onClick={handleClearSearch} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth required error={Boolean(selectedCategory == null)}>
                {/* <InputLabel
                  id="category-dropdown"
                  color="customGreen"
                  style={{ fontSize: "0.8rem" }}
                >
                  Search Category
                </InputLabel> */}
                <Select
                  labelId="category-dropdown"
                  id="dropdown"
                  name="Category"
                  color="customGreen"
                  sx={{
                    borderRadius: 1,
                    fontSize: "0.8rem",
                    height: "100%",
                  }}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {searchCategory.map((option) => (
                    <MenuItem
                      key={option.category_id}
                      value={option.category_id}
                      style={{ fontSize: "0.8rem" }}
                    >
                      {option.category}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(selectedCategory == null) && (
                  <FormHelperText>{"Search Category is requied"}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ display: "flex", alignItems: "center" }}
              justifyContent={"space-between"}
            >
              <SearchIcon
                style={{ cursor: "pointer", fontSize: 36 }}
                onClick={handleSearch}
                color={"customGreen"}
              />
              <RestartAltIcon
                style={{ cursor: "pointer", fontSize: 36 }}
                onClick={handleReset}
                color={"customGreen"}
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", margin: "auto" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: "4px" }}>Merchant Name</TableCell>
                  <TableCell sx={{ padding: "4px" }}>Status</TableCell>
                  <TableCell sx={{ padding: "4px" }}>Address</TableCell>
                  <TableCell sx={{ padding: "4px" }}>Contact Details</TableCell>
                  <TableCell sx={{ padding: "4px" }} align="right">
                    Cashback Fee Rate
                  </TableCell>
                  <TableCell sx={{ padding: "4px" }} align="right">
                    Available Points
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {merchants.map((merchant) => (
                  <TableRow
                    key={merchant.merchant_id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                    // onClick={handleMerchantClick(merchant)}
                  >
                    <TableCell sx={{ padding: "8px", fontSize: "0.8rem" }}>
                      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                        {
                          <img
                            src={merchant.logo_path}
                            alt="Logo"
                            style={{ width: "35px", marginRight: ".5rem", borderRadius: "50%" }}
                          />
                        }

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography variant="body" fontSize="0.8rem">
                            {merchant.merchant_name}
                          </Typography>
                          <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                            {merchant.merchant_code}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      {merchant.is_active ? (
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
                            <span className="flex gap-3 items-center justify-center">
                              Registered
                            </span>
                          }
                          variant="outlined"
                          sx={{
                            color: "orange",
                            borderColor: "orange",
                            "& .MuiChip-label": {
                              fontSize: "0.7rem",
                            },
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      <Box
                        sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                      >
                        <Typography variant="body" fontSize="0.8rem">
                          {merchant.area_name}
                        </Typography>
                        <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                          {merchant.city_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      <Box
                        sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                      >
                        <Typography variant="body" fontSize="0.8rem">
                          {merchant.email_address}
                        </Typography>
                        <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                          {merchant.mobile_no}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }} align="right">
                      {parseFloat(merchant.merchant_fee_rate)
                        .toFixed(2)
                        .replace(/\.?0+$/, "") + "%"}
                    </TableCell>
                    <TableCell sx={{ padding: "4px" }} align="right">
                      <Typography
                        fontSize="0.8rem"
                        color={merchant.points_balance < 100 ? "red" : "black"}
                      >
                        {merchant.points_balance}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <Stack
              spacing={2}
              sx={{ marginTop: "1rem", justifyContent: "center", alignItems: "center" }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange} // Correct usage
                variant="outlined"
              />
            </Stack>
          </Box>
        </Paper>

        {/* <Dialog
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
        </Dialog> */}
      </Box>
    </Box>
  );
};

export default Merchants;
