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
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminLogo from "../Images/no_logo.png";
import ClearIcon from "@mui/icons-material/Clear";
import ConsumerDetails from "./ConsumerDetails";
import Cookies from "js-cookie";
import DubaiFlag from "../Images/dubai_flag.jpg";
import EditIcon from "@mui/icons-material/Edit";
import Header from "./Header";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
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

const Consumers = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [consumers, setConsumers] = useState([]);
  const [consumerDetails, setConsumerDetails] = useState({});

  const [selectedConsumer, setSelectedConsumer] = useState();

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
  const [openConsumerDetailsDialog, setOpenConsumerDetailsDialog] = useState(false);

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];
  const currentUserId = userData.user_id;
  var file = null;
  // var reformatedDepositAmount = 0;
  // var reformatedSignupBonus = 0;

  useEffect(() => {
    fetchSearchCategory();
    fetchBranchTypes();
    fetchIndustries();
    fetchCities();
    fetchPaymentModes();
  }, []);

  useEffect(() => {
    fetchConsumers(searchText, selectedCategory, currentPage);
  }, [consumerDetails]);

  useEffect(() => {
    fetchAreas();
  }, [selectedCity]);

  useEffect(() => {
    fetchConsumerDetails();
  }, [selectedConsumer]);

  const fetchConsumerDetails = async () => {
    if (selectedConsumer) {
      const res = await axios.post(`${baseURLv1}/adminManageConsumer/getFullConsumerProfile`, {
        in_consumer_id: selectedConsumer.consumer_id,
        // in_consumer_id: selectedConsumer.consumer_id,
      });
      setConsumerDetails(res.data.data);
    }
  };

  const fetchConsumers = async (searchText = "", selectedCategory = 1, pageNumber = 1) => {
    try {
      const data = {
        in_search_text: searchText,
        in_search_category_id: selectedCategory,
        in_page_number: pageNumber,
      };

      let response = await axios.post(
        `${baseURLv1}/adminManageConsumer/searchConsumerListByPage`,
        data
      );
      response = response.data.data;
      const result = response.results_list || [];
      setConsumers(result);
      setTotalPages(response.total_number_of_pages);
      setCurrentPage(response.current_page_number);
      setTotalRecords(response.total_row_count);
      setPageLimit(response.rows_per_page_limit);
      setCurrentPageRecords(response.rows_on_this_page);
    } catch (error) {
      console.error("Error fetching Consumers:", error);
    }
  };

  const fetchSearchCategory = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllConsumerSearchCategory`);
      setSearchCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching Consumers:", error);
    }
  };

  const fetchBranchTypes = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllBranchType`);
      setBranchTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching Consumers:", error);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllIndustry`);
      setIndustries(response.data.data);
    } catch (error) {
      console.error("Error fetching Consumers:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getCityListByCountry/1`);
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching Consumers:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(
        `${baseURLv1}/adminLookup/getAreaListByCity/${selectedCity}`
      );
      setAreas(response.data.data);
    } catch (error) {
      console.error("Error fetching Consumers:", error);
    }
  };

  const fetchPaymentModes = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllMerchantPaymentMode`);
      setPaymentModes(response.data.data);
    } catch (error) {
      console.error("Error fetching Consumers:", error);
    }
  };

  const handleSearch = () => {
    if (selectedCategory == 0) {
      setSelectedCategory(null);
    }
    fetchConsumers(searchText, selectedCategory);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
    fetchConsumers("", selectedCategory);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedCategory(1);
    fetchConsumers("");
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchConsumers(searchText, selectedCategory, page);
  };

  const handleRegisterClick = () => {
    setOpenRegisterDialog(true);
  };

  const handleConsumerDetailsClose = () => {
    setOpenConsumerDetailsDialog(false);
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

  const handleSelectedConsumer = (merchant) => {
    setOpenConsumerDetailsDialog(true);
    setSelectedConsumer(merchant);
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
            mb: 1,
          }}
        >
          <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, mb: 1 }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography variant="h6" gutterBottom fontSize={"1.2rem"}>
            Consumers
          </Typography>
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
              <Tooltip title="Search">
                <SearchIcon
                  style={{ cursor: "pointer", fontSize: 36 }}
                  onClick={handleSearch}
                  color={"customGreen"}
                />
              </Tooltip>
              <Tooltip title="Reset">
                <RestartAltIcon
                  style={{ cursor: "pointer", fontSize: 36 }}
                  onClick={handleReset}
                  color={"customGreen"}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", margin: "auto" }}>
          <TableContainer>
            {consumers.length === 0 ? (
              <Grid display="flex" justifyContent="center">
                <Typography color="rgb(160, 160, 160)">{"No records found"}</Typography>
              </Grid>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: "4px" }}>Consumer Name</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Status</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Address</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Nationality</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Contact Details</TableCell>
                    <TableCell sx={{ padding: "4px" }} align="right">
                      Available Points
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consumers.map((consumer) => (
                    <TableRow
                      key={consumer.consumer_id}
                      onClick={() => handleSelectedConsumer(consumer)}
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
                              src={consumer.photo_path}
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
                              {consumer.consumer_name}
                            </Typography>
                            <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                              {consumer.consumer_code}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        {
                          <Chip
                            label={
                              <span className="flex gap-3 items-center justify-center">
                                {consumer.consumer_status}
                              </span>
                            }
                            color={
                              consumer.consumer_status == "Activated"
                                ? "success"
                                : consumer.consumer_status == "Registered"
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
                            {consumer.area_name}
                          </Typography>
                          <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                            {consumer.city_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" fontSize="0.8rem">
                          {consumer.nationality}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }} align="right">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography variant="body" fontSize="0.8rem">
                            {consumer.email_address}
                          </Typography>
                          <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                            {consumer.mobile_no}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "4px" }} align="right">
                        <Typography
                          fontSize="0.8rem"
                          color={consumer.points_balance < 100 ? "red" : "black"}
                        >
                          {consumer.points_balance}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Grid container sx={{ marginTop: "1rem" }} alignItems="center">
              <Grid item xs={2} display="flex" justifyContent="flex-start">
                {consumers.length !== 0 ? (
                  <Typography fontSize="0.8rem">{`${(currentPage - 1) * pageLimit + 1} to ${
                    (currentPage - 1) * pageLimit + currentPageRecords
                  } of ${totalRecords} Records`}</Typography>
                ) : null}
              </Grid>
              <Grid item xs={8} display="flex" justifyContent="center">
                {consumers.length === 0 ? null : (
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
          open={openConsumerDetailsDialog}
          onClose={handleConsumerDetailsClose}
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
              <ConsumerDetails
                consumerDetails={consumerDetails}
                currentUserId={currentUserId}
                fetchConsumerDetails={fetchConsumerDetails}
                selectedConsumer={selectedConsumer}
              />
            </DialogContent>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Consumers;
