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
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [branchTypes, setBranchTypes] = useState([]);
  const [selectedBranchType, setSelectedBranchType] = useState("");
  const [searchCategory, setSearchCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRecords, setCurrentPageRecords] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState();
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [newMerchant, setNewMerchant] = useState({
    User_Id: null,
    Full_Name: "",
    Is_Active: true,
    Designation: "",
    User_Name: "",
    User_Type: null,
    Password: "",
    Permissions: [],
  });
  const [totalRecords, setTotalRecords] = useState();
  const [errors, setErrors] = useState({});

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];
  const currentUserId = userData.user_id;

  useEffect(() => {
    fetchMerchants();
    fetchSearchCategory();
  }, []);

  const fetchMerchants = async (searchText = "", selectedCategory = 1, pageNumber = 1) => {
    try {
      const data = {
        in_search_text: searchText,
        in_search_category_id: selectedCategory,
        in_page_number: pageNumber,
      };

      let response = await axios.post(
        `${baseURLv1}/adminManageMerchant/searchMerchantListByPage`,
        data
      );
      response = response.data.data;
      const result = response.results_list || [];
      setMerchants(result);
      setTotalPages(response.total_number_of_pages);
      setCurrentPage(response.current_page_number);
      setTotalRecords(response.total_row_count);
      setPageLimit(response.rows_per_page_limit);
      setCurrentPageRecords(response.rows_on_this_page);
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
    fetchMerchants(searchText, selectedCategory, page);
    //fetchMerchants("", 1, page);
  };

  const handleRegisterClick = () => {
    setOpenRegisterDialog(true);
  };

  const handleRegisterClose = () => {
    setOpenRegisterDialog(false);
  };

  const handleAddChange = (e) => {
    // const { name, value } = e.target;
    // setNewMerchant((prevNewUser) => ({ ...prevNewUser, [name]: value }));
    // if (value.trim() === "") {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     [name]: `${name.replace("_", " ")} is required`,
    //   }));
    // } else {
    //   setErrors((prevErrors) => {
    //     const { [name]: removedError, ...rest } = prevErrors;
    //     return rest;
    //   });
    // }
    const { name, value } = e.target;
    setNewMerchant((prevNewUser) => ({ ...prevNewUser, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "" ? `${name.replace("_", " ")} is required` : "",
    }));
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
            onClick={handleRegisterClick}
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
            {merchants.length === 0 ? (
              <Grid display="flex" justifyContent="center">
                <Typography color="rgb(160, 160, 160)">{"No records found"}</Typography>
              </Grid>
            ) : (
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
                        <Box
                          sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}
                        >
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
                        {
                          <Chip
                            label={
                              <span className="flex gap-3 items-center justify-center">
                                {merchant.merchant_status}
                              </span>
                            }
                            color={
                              merchant.merchant_status == "Active"
                                ? "success"
                                : merchant.merchant_status == "Registered"
                                ? "warning"
                                : "error"
                            }
                            variant="outlined"
                            sx={{
                              "& .MuiChip-label": {
                                fontSize: "0.7rem",
                              },
                            }}
                          />
                        }
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
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
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
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
            )}
            <Grid container sx={{ marginTop: "1rem" }} alignItems="center">
              <Grid item xs={2} display="flex" justifyContent="flex-start">
                {merchants.length !== 0 ? (
                  <Typography fontSize="0.8rem">{`${(currentPage - 1) * pageLimit + 1} to ${
                    (currentPage - 1) * pageLimit + currentPageRecords
                  } of ${totalRecords} Records`}</Typography>
                ) : null}
              </Grid>
              <Grid item xs={8} display="flex" justifyContent="center">
                {merchants.length === 0 ? null : (
                  <Stack spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      variant="outlined"
                    />
                  </Stack>
                )}
              </Grid>
            </Grid>
          </TableContainer>
        </Paper>

        <Dialog
          open={openRegisterDialog}
          onClose={handleRegisterClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="form-dialog-title" variant="h6">
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, mb: 1 }}>
                <StoreOutlinedIcon />
              </Avatar>
              <Typography variant="h6" fontSize={"1.2rem"} gutterBottom>
                {"New Merchant Registration"}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, mb: 1 }}>
                <StoreOutlinedIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom marginBottom={"16px"} fontSize={"1.1rem"}>
                Merchant Details
              </Typography>
            </Box>
            <Grid container spacing={2} style={{ paddingTop: 0 }}>
              <Grid item xs={4}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="Merchant_Name"
                  label="Merchant Name"
                  type="text"
                  color="customGreen"
                  required
                  fullWidth
                  value={newMerchant.Merchant_Name}
                  onChange={handleAddChange}
                  error={Boolean(errors.Merchant_Name)}
                  helperText={errors.Merchant_Name}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="Merchant_Name"
                  label="Merchant Name"
                  type="text"
                  color="customGreen"
                  required
                  fullWidth
                  value={newMerchant.Merchant_Name}
                  onChange={handleAddChange}
                  error={Boolean(errors.Merchant_Name)}
                  helperText={errors.Merchant_Name}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={4} marginTop={"8px"}>
                <FormControl fullWidth required error={errors.Industry}>
                  <InputLabel
                    id="industry-dropdown"
                    color="customGreen"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Industry
                  </InputLabel>
                  <Select
                    labelId="industry-dropdown"
                    id="dropdown"
                    name="Industry"
                    value={selectedIndustry}
                    onChange={handleAddChange}
                    label="Select an Option"
                    color="customGreen"
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {industries.map((option) => (
                      <MenuItem
                        key={option.user_type_id}
                        value={option.user_type_id}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {option.user_type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.Industry && <FormHelperText>{errors.Industry}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={4} marginTop={"8px"}>
                <FormControl fullWidth required error={errors.Branch_Type}>
                  <InputLabel
                    id="branchtype-dropdown"
                    color="customGreen"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Branch Type
                  </InputLabel>
                  <Select
                    labelId="branchtype-dropdown"
                    id="dropdown"
                    name="Branch_Type"
                    value={selectedBranchType}
                    onChange={handleAddChange}
                    label="Select an Option"
                    color="customGreen"
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {branchTypes.map((option) => (
                      <MenuItem
                        key={option.user_type_id}
                        value={option.user_type_id}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {option.user_type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.Branch_Type && <FormHelperText>{errors.Branch_Type}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleRegisterClose}
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
              onClick={handleRegisterClose}
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

export default Merchants;
