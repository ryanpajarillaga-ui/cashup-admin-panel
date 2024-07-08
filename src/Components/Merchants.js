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
  const [merchant, setMerchant] = useState({
    User_Id: null,
    Full_Name: "",
    Is_Active: true,
    Designation: "",
    User_Name: "",
    User_Type: null,
    Password: "",
    Permissions: [],
  });
  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
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
      setMerchants(response.data.data.results_list);
      setTotalPages(response.data.data.total_number_of_pages);
      setCurrentPage(response.data.data.current_page_number);
      // setItemsPerPage(response.data.data.rows_per_page_limit);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const fetchSearchCategory = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllMerchantSearchCategory`);
      setSearchCategory(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  useEffect(() => {
    fetchMerchants();
    fetchSearchCategory();
  }, []);

  const handleSearch = () => {
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
    setSelectedCategory("");
    fetchMerchants("");
  };

  const handlePageChange = (event, page) => {
    console.log(page);
    console.log(searchText);
    console.log(selectedCategory);
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
              <FormControl fullWidth required>
                <InputLabel
                  id="category-dropdown"
                  color="customGreen"
                  style={{ fontSize: "0.8rem" }}
                >
                  Search Category
                </InputLabel>
                <Select
                  labelId="category-dropdown"
                  id="dropdown"
                  name="Category"
                  label="Search Category"
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
                    <MenuItem key={option.category_id} value={option.category_id}>
                      {option.category}
                    </MenuItem>
                  ))}
                </Select>
                {/* {errors.User_Type && <FormHelperText>{errors.User_Type}</FormHelperText>} */}
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
                  <TableCell sx={{ padding: "4px" }}>Cashback Fee Rate</TableCell>
                  <TableCell sx={{ padding: "4px" }}>Available Points</TableCell>
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
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                        {
                          <img
                            src={merchant.logo_path}
                            alt="Logo"
                            style={{ width: "50px", marginRight: ".5rem" }}
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
                          sx={{ color: "orange", borderColor: "orange" }}
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
                    <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                      {merchant.merchant_fee_rate}
                    </TableCell>
                    <TableCell sx={{ padding: "4px" }}>
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
      </Box>
    </Box>
  );
};

export default Merchants;
