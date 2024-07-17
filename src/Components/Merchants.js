import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import AdminLogo from "../Images/no_logo.png";
import ClearIcon from "@mui/icons-material/Clear";
import Cookies from "js-cookie";
import DubaiFlag from "../Images/dubai_flag.jpg";
import EditIcon from "@mui/icons-material/Edit";
import Header from "./Header";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MerchantDetails from "./MerchantDetails";
import Pagination from "@mui/material/Pagination";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import VerticalNav from "./VerticalNav";
import axios from "axios";
import { useSnackbar } from "notistack";

const Merchants = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [merchants, setMerchants] = useState([]);
  const [merchantDetails, setMerchantDetails] = useState({});

  const [selectedMerchant, setSelectedMerchant] = useState(189);

  const [searchText, setSearchText] = useState("");
  const [industries, setIndustries] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [branchTypes, setBranchTypes] = useState([]);
  const [searchCategory, setSearchCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRecords, setCurrentPageRecords] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState();
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [error, setError] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [selectedCity, setSelectedCity] = useState(1);
  const [newMerchant, setNewMerchant] = useState({
    Merchant_Id: null,
    Merchant_Name: "",
    Fee_Rate: "",
    Industry: null,
    Branch_Type: null,
    Address: "",
    PO_Box: "",
    City: null,
    Area: null,
    Email_Address: "",
    Mobile_Number: "",
    Telephone_Number: "",
    Deposit_Amount: "",
    Signup_Bonus: "",
    Payment_Mode: null,
    Payment_Details: "",
  });
  const [totalRecords, setTotalRecords] = useState();
  const [errors, setErrors] = useState({});
  const [logo, setLogo] = useState(AdminLogo);
  const [openMerchantDetailsDialog, setOpenMerchantDetailsDialog] = useState(false);

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];
  const currentUserId = userData.user_id;
  var file = null;
  // var reformatedDepositAmount = 0;
  // var reformatedSignupBonus = 0;

  useEffect(() => {
    fetchMerchants();
    fetchSearchCategory();
    fetchBranchTypes();
    fetchIndustries();
    fetchCities();
    fetchPaymentModes();
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [merchantDetails]);

  useEffect(() => {
    fetchAreas();
  }, [selectedCity]);

  useEffect(() => {
    fetchMerchantDetails();
  }, [selectedMerchant]);

  const fetchMerchantDetails = async () => {
    const res = await axios.post(`${baseURLv1}/adminManageMerchant/getFullMerchantProfile`, {
      in_merchant_id: selectedMerchant,
    });
    setMerchantDetails(res.data.data);
  };

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

  const fetchBranchTypes = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllBranchType`);
      setBranchTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllIndustry`);
      setIndustries(response.data.data);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getCityListByCountry/1`);
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(
        `${baseURLv1}/adminLookup/getAreaListByCity/${selectedCity}`
      );
      setAreas(response.data.data);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const fetchPaymentModes = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllMerchantPaymentMode`);
      setPaymentModes(response.data.data);
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

  const handleMerchantDetailsClose = () => {
    setOpenMerchantDetailsDialog(false);
  };

  const handleRegisterClose = () => {
    setOpenRegisterDialog(false);
    setNewMerchant({
      Merchant_Id: null,
      Merchant_Name: "",
      Fee_Rate: "",
      Industry: null,
      Branch_Type: null,
      Address: "",
      PO_Box: "",
      City: null,
      Area: null,
      Email_Address: "",
      Mobile_Number: "",
      Telephone_Number: "",
      Deposit_Amount: "",
      Signup_Bonus: "",
      Payment_Mode: null,
      Payment_Details: "",
    });
    setErrors([]);
  };

  function formatCurrency(amount) {
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" }).replace("$", "");
  }

  const handleFieldChange = (e) => {
    let { name, value } = e.target;
    const numericFields = [
      "Mobile_Number",
      "Telephone_Number",
      "Fee_Rate",
      "Deposit_Amount",
      "Signup_Bonus",
    ];

    if (numericFields.includes(name) && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setNewMerchant((prevNewUser) => ({ ...prevNewUser, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: String(value).trim() === "" ? `${name.replace("_", " ")} is required` : "",
    }));
    if (name == "Email_Address" && String(value).trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Valid email address is required",
      }));
    }
    if (name === "Email_Address") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Valid email address is required",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }
    if (name == "City") {
      setSelectedCity(value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "Deposit_Amount" || name === "Signup_Bonus") {
      const numberValue = parseFloat(value.replace(/,/g, ""));
      if (!isNaN(numberValue)) {
        const formattedValue = formatCurrency(numberValue);
        setNewMerchant((prevNewUser) => ({ ...prevNewUser, [name]: formattedValue }));
        // name === "Deposit_Amount"
        //   ? (reformatedDepositAmount = numberValue)
        //   : (reformatedSignupBonus = numberValue);
      }
    }

    if (name === "Fee_Rate") {
      const numberValue = parseFloat(value);
      if (!isNaN(numberValue) && numberValue <= 100) {
        const formattedValue = formatCurrency(numberValue);
        setNewMerchant((prevNewUser) => ({ ...prevNewUser, [name]: formattedValue }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Fee Rate should be less than or equal to 100",
        }));
      }
    }
  };

  const handleLogoChange = (event) => {
    file = event.target.files[0];
    setLogoFile(file);

    if (file) {
      if (file.size > 500 * 1024) {
        // 500KB size limit
        setError("File size should be less than 500KB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (newMerchant.Merchant_Name.trim() === "")
      newErrors.Merchant_Name = "Merchant Name is required";
    if (newMerchant.Fee_Rate < 1) newErrors.Fee_Rate = "Fee Rate is required";
    if (newMerchant.Industry < 1) newErrors.Industry = "Industry is required";
    if (newMerchant.Branch_Type < 1) newErrors.Branch_Type = "Branch Type is required";
    if (newMerchant.Address.trim() === "") newErrors.Address = "Address is required";
    if (newMerchant.City < 1) newErrors.City = "City is required";
    if (newMerchant.Area < 1) newErrors.Area = "Area is required";
    if (newMerchant.Email_Address.trim() === "")
      newErrors.Email_Address = "Valid email address is required";
    if (newMerchant.Mobile_Number < 1) newErrors.Mobile_Number = "Mobile Number is required";
    if (newMerchant.Telephone_Number < 1)
      newErrors.Telephone_Number = "Telephone Number is required";
    if (newMerchant.Deposit_Amount < 1) newErrors.Deposit_Amount = "Deposit Amount is required";
    if (newMerchant.Signup_Bonus < 1) newErrors.Signup_Bonus = "Signup Bonus is required";
    if (newMerchant.Payment_Mode < 1) newErrors.Payment_Mode = "Payment_Mode is required";
    if (!newMerchant.Mobile_Number.startsWith("5"))
      newErrors.Mobile_Number = "Valid mobile number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    if (!validateForm()) return;
    event.preventDefault();
    const data = new FormData();
    data.append("in_merchant_name", newMerchant.Merchant_Name);
    data.append("in_industry_id", newMerchant.Industry);
    data.append("in_address", newMerchant.Address);
    data.append("in_country_id", 1);
    data.append("in_city_id", newMerchant.City);
    data.append("in_area_id", newMerchant.Area);
    data.append("in_pobox", newMerchant.PO_Box);
    data.append("in_coordinate", "");
    data.append("in_branch_type_id", newMerchant.Branch_Type);

    data.append("in_tel_country_code_id", 1);
    data.append("in_tel_no", newMerchant.Telephone_Number);
    data.append("in_mobile_country_code_id", 1);
    data.append("in_mobile_no", newMerchant.Mobile_Number);
    data.append("in_email_address", newMerchant.Email_Address);

    data.append("in_merchant_fee", newMerchant.Fee_Rate);
    data.append("in_user_id", currentUserId);
    data.append("in_logo_path", logoFile);
    data.append("in_deposit_amount", newMerchant.Deposit_Amount.replace(/,/g, ""));
    data.append("in_signup_bonus", newMerchant.Signup_Bonus.replace(/,/g, ""));
    data.append("in_payment_mode_id", newMerchant.Payment_Mode);
    data.append("in_payment_details", newMerchant.Payment_Details);

    try {
      const response = await axios.post(
        `${baseURLv1}/adminManageMerchant/registerNewMerchant`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            in_platform_type_id: 4,
          },
        }
      );
      setNewMerchant({});
      setLogo(AdminLogo);
      handleRegisterClose();
      enqueueSnackbar(response.data.message, { variant: "success" });
    } catch (err) {
      const errorMessage = err.response ? err.response.data : "Error occurred";
      enqueueSnackbar(errorMessage.message || errorMessage, { variant: "error" });
    }
  };

  const handleSelectedMerchant = (id) => {
    setOpenMerchantDetailsDialog(true);
    setSelectedMerchant(id);
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
                      onClick={() => handleSelectedMerchant(merchant.merchant_id)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
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
            <Box sx={{ display: "flex", flexDirection: "row", mb: 1 }}>
              <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, mb: 1 }}>
                <StoreOutlinedIcon />
              </Avatar>
              <Typography variant="h6" fontSize={"1.2rem"} gutterBottom>
                {"New Merchant Registration"}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", mb: 1 }}>
              <Grid
                container
                spacing={2}
                style={{
                  paddingTop: 0,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "end",
                  mb: 1,
                }}
              >
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "start" }}>
                    <InfoIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
                    <Typography
                      variant="h6"
                      gutterBottom
                      marginBottom={"16px"}
                      fontSize={"1.05rem"}
                    >
                      Merchant Details
                    </Typography>
                  </Box>
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
                    onChange={handleFieldChange}
                    error={Boolean(errors.Merchant_Name)}
                    helperText={errors.Merchant_Name}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    InputProps={{ sx: { fontSize: "0.8rem" } }}
                    InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    margin="dense"
                    name="Fee_Rate"
                    label="Cashback Fee Rate"
                    type="text"
                    color="customGreen"
                    required
                    fullWidth
                    value={newMerchant.Fee_Rate}
                    onChange={handleFieldChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.Fee_Rate)}
                    helperText={errors.Fee_Rate}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body2">%</Typography>
                        </InputAdornment>
                      ),
                      sx: { fontSize: "0.8rem" },
                    }}
                    InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Box position="relative" display="inline-block">
                      <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        width="130px"
                        height="130px"
                        sx={{ borderRadius: "50%" }}
                      />
                      <IconButton
                        aria-label="change logo"
                        component="label"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "5px",
                        }}
                      >
                        <EditIcon />
                        <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
                      </IconButton>
                    </Box>
                    {error && (
                      <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                        {error}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} style={{ paddingTop: 0 }}>
              <Grid item xs={6} marginTop={"8px"}>
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
                    value={newMerchant.Industry}
                    onChange={handleFieldChange}
                    label="Select an Option"
                    color="customGreen"
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {industries.map((option) => (
                      <MenuItem
                        key={option.industry_id}
                        value={option.industry_id}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {option.industry_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.Industry && <FormHelperText>{errors.Industry}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={6} marginTop={"8px"}>
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
                    value={newMerchant.Branch_Type}
                    onChange={handleFieldChange}
                    label="Select an Option"
                    color="customGreen"
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {branchTypes.map((option) => (
                      <MenuItem
                        key={option.branch_type_id}
                        value={option.branch_type_id}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {option.branch_type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.Branch_Type && <FormHelperText>{errors.Branch_Type}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "start", mt: 5 }}>
              <LocationOnIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" gutterBottom marginBottom={"16px"} fontSize={"1.05rem"}>
                Address/Location
              </Typography>
            </Box>
            <Grid container spacing={2} style={{ paddingTop: 0 }}>
              <Grid item xs={9}>
                <TextField
                  margin="dense"
                  name="Address"
                  label="Address"
                  type="text"
                  color="customGreen"
                  required
                  fullWidth
                  value={newMerchant.Address}
                  onChange={handleFieldChange}
                  error={Boolean(errors.Address)}
                  helperText={errors.Address}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  name="PO_Box"
                  label="PO Box"
                  type="text"
                  color="customGreen"
                  fullWidth
                  value={newMerchant.PO_Box}
                  onChange={handleFieldChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={6} marginTop={"8px"}>
                <FormControl fullWidth required error={errors.City}>
                  <InputLabel id="city-dropdown" color="customGreen" style={{ fontSize: "0.8rem" }}>
                    City
                  </InputLabel>
                  <Select
                    labelId="city-dropdown"
                    id="dropdown"
                    name="City"
                    value={newMerchant.City}
                    onChange={handleFieldChange}
                    label="Select an Option"
                    color="customGreen"
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {cities.map((option) => (
                      <MenuItem
                        key={option.city_id}
                        value={option.city_id}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {option.city_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.City && <FormHelperText>{errors.City}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={6} marginTop={"8px"}>
                <FormControl fullWidth required error={errors.Area}>
                  <InputLabel id="area-dropdown" color="customGreen" style={{ fontSize: "0.8rem" }}>
                    Area
                  </InputLabel>
                  <Select
                    labelId="area-dropdown"
                    id="dropdown"
                    name="Area"
                    value={newMerchant.Area}
                    onChange={handleFieldChange}
                    label="Select an Option"
                    color="customGreen"
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {areas.map((option) => (
                      <MenuItem
                        key={option.area_id}
                        value={option.area_id}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {option.area_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.Area && <FormHelperText>{errors.Area}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "start", mt: 5 }}>
              <PhoneIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" gutterBottom marginBottom={"16px"} fontSize={"1.05rem"}>
                Contact Details
              </Typography>
            </Box>
            <Grid container spacing={2} style={{ paddingTop: 0 }}>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="Email_Address"
                  label="Email Address"
                  type="email"
                  color="customGreen"
                  required
                  fullWidth
                  value={newMerchant.Email_Address}
                  onChange={handleFieldChange}
                  error={Boolean(errors.Email_Address)}
                  helperText={errors.Email_Address}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="Mobile_Number"
                  label="Mobile Number"
                  type="text"
                  color="customGreen"
                  required
                  fullWidth
                  value={newMerchant.Mobile_Number}
                  onChange={handleFieldChange}
                  error={Boolean(errors.Mobile_Number)}
                  helperText={errors.Mobile_Number}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src={DubaiFlag}
                          alt="Dubai Flag"
                          style={{ width: "20px", marginRight: "8px" }}
                        />
                        <Typography variant="body2">+971</Typography>
                      </InputAdornment>
                    ),
                    sx: { fontSize: "0.8rem" },
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 9 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="Telephone_Number"
                  label="Telephone Number"
                  type="text"
                  color="customGreen"
                  required
                  fullWidth
                  value={newMerchant.Telephone_Number}
                  onChange={handleFieldChange}
                  error={Boolean(errors.Telephone_Number)}
                  helperText={errors.Telephone_Number}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src={DubaiFlag}
                          alt="Dubai Flag"
                          style={{ width: "20px", marginRight: "8px" }}
                        />
                        <Typography variant="body2">+971</Typography>
                      </InputAdornment>
                    ),
                    sx: { fontSize: "0.8rem" },
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 8 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "start", mt: 5 }}>
              <PersonIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" gutterBottom marginBottom={"16px"} fontSize={"1.05rem"}>
                Account Activation
              </Typography>
            </Box>
            <Grid container spacing={2} style={{ paddingTop: 0 }}>
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  name="Deposit_Amount"
                  label="Deposit Amount"
                  type="text"
                  color="customGreen"
                  required
                  fullWidth
                  value={newMerchant.Deposit_Amount}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.Deposit_Amount)}
                  helperText={errors.Deposit_Amount}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 9 }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  name="Signup_Bonus"
                  label="Signup Bonus"
                  type="text"
                  color="customGreen"
                  required
                  fullWidth
                  value={newMerchant.Signup_Bonus}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.Signup_Bonus)}
                  helperText={errors.Signup_Bonus}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 9 }}
                />
              </Grid>
              <Grid item xs={6} marginTop={"8px"}>
                <FormControl fullWidth required error={errors.Payment_Mode}>
                  <InputLabel
                    id="paymentmode-dropdown"
                    color="customGreen"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Payment Mode
                  </InputLabel>
                  <Select
                    labelId="paymentmode-dropdown"
                    id="dropdown"
                    name="Payment_Mode"
                    value={newMerchant.Payment_Mode}
                    onChange={handleFieldChange}
                    label="Select an Option"
                    color="customGreen"
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.8rem",
                    }}
                  >
                    {paymentModes.map((option) => (
                      <MenuItem
                        key={option.payment_mode_id}
                        value={option.payment_mode_id}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {option.payment_mode}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.Industry && <FormHelperText>{errors.Industry}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="Payment_Details"
                  label="Payment Details"
                  type="text"
                  color="customGreen"
                  fullWidth
                  value={newMerchant.Payment_Details}
                  onChange={handleFieldChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ sx: { fontSize: "0.8rem" } }}
                  InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                  inputProps={{ maxLength: 100 }}
                />
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
              onClick={handleSubmit}
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
        <Dialog
          open={openMerchantDetailsDialog}
          onClose={handleMerchantDetailsClose}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
          fullWidth
        >
          <Box>
            <DialogTitle
              id="form-dialog-title"
              variant="h6"
              sx={{ backgroundColor: "green", height: "100px" }}
            ></DialogTitle>

            <DialogContent sx={{ backgroundColor: "#F5F5F5" }}>
              <MerchantDetails
                merchantDetails={merchantDetails}
                currentUserId={currentUserId}
                fetchMerchantDetails={fetchMerchantDetails}
              />
            </DialogContent>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Merchants;
