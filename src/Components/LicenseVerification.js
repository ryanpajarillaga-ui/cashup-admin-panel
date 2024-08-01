import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
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

import AttachmentIcon from "@mui/icons-material/Attachment";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import Cookies from "js-cookie";
import Header from "./Header";
import Pagination from "@mui/material/Pagination";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import TaskIcon from "@mui/icons-material/Task";
import VerifiedIcon from "@mui/icons-material/Verified";
import VerticalNav from "./VerticalNav";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";

const LicenseVerification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [licenseVerifications, setLicenseVerifications] = useState([]);
  const [licenseForVerificationsCount, setLicenseForVerificationsCount] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRecords, setCurrentPageRecords] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [selectedLicenseVerify, setSelectedLicenseVerify] = useState();
  const [openLicenseVerify, setOpenLicenseVerify] = useState(false);
  const [openlicenseVerifyClose, setOpenlicenseVerifyClose] = useState(false);

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];
  const currentUserId = userData.user_id;
  const location = useLocation();
  const { message } = location.state || {};
  const { contact_support_id } = location.state || {};
  const [notificationMessage, setNotificationMessage] = useState(message);

  useEffect(() => {
    fetchSearchCategory();

    if (notificationMessage == "View All Clicked") {
      handleNewContactSupport();
    } else if (contact_support_id) {
      fetchContactSupportById();
    } else {
      fetchLicenseVerifications(searchText, selectedCategory, currentPage);
    }

    setNotificationMessage(null);
  }, []);

  const fetchLicenseVerifications = async (
    searchText = "",
    selectedCategory = 1,
    pageNumber = 1
  ) => {
    try {
      const data = {
        in_search_text: searchText,
        in_search_category_id: selectedCategory,
        in_page_number: pageNumber,
      };

      let response = await axios.post(
        `${baseURLv1}/adminLicenseVerification/searchLicenseListByPage`,
        data
      );
      response = response.data.data;
      const result = response.results_list || [];

      setLicenseVerifications(result);

      setLicenseForVerificationsCount(response.for_verification_count);
      setTotalPages(response.total_number_of_pages);
      setCurrentPage(response.current_page_number);
      setTotalRecords(response.total_row_count);
      setPageLimit(response.rows_per_page_limit);
      setCurrentPageRecords(response.rows_on_this_page);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const fetchContactSupportById = async () => {
    try {
      let response = await axios.post(`${baseURLv1}/adminContactSupport/searchContactRequestByID`, {
        in_contact_support_id: contact_support_id,
      });
      response = response.data.data;
      const result = response.results_list || [];
      setLicenseVerifications(result);
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
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllLicenseSearchCategory`);
      setSearchCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const handleSearch = () => {
    if (selectedCategory == 0) {
      setSelectedCategory(null);
    }
    fetchLicenseVerifications(searchText, selectedCategory);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
    fetchLicenseVerifications("", selectedCategory);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedCategory(1);
    fetchLicenseVerifications("");
  };

  const handlePageChange = (event, page) => {
    fetchLicenseVerifications(searchText, selectedCategory, page);
  };

  const formatDateWithoutTime = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString("en-US", options).replace(/\//g, "-");
  };

  const handleFileClick = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  const handleVerifyClick = (contactSupport) => {
    setOpenLicenseVerify(true);
    setSelectedLicenseVerify(contactSupport);
  };

  const handleCloseClick = (contactSupport) => {
    setOpenlicenseVerifyClose(true);
    setSelectedLicenseVerify(contactSupport);
  };

  const handleLicenseVerifyClose = () => {
    setOpenLicenseVerify(false);
  };

  const handleLicenseVerifyRejectClose = () => {
    setOpenlicenseVerifyClose(false);
  };

  const handleLicenseVerify = async () => {
    const data = {
      in_merchant_license_id: selectedLicenseVerify.merchant_license_id,
      in_logged_user_id: currentUserId,
    };
    const headers = {
      in_platform_type_id: 4,
    };
    try {
      const res = await axios.post(`${baseURLv1}/adminLicenseVerification/verifyLicense`, data, {
        headers,
      });
      enqueueSnackbar(res.data.message, { variant: "success" });
      handleLicenseVerifyClose();
      fetchLicenseVerifications(searchText, selectedCategory, currentPage);
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message || "Error occurred"
        : "Error occurred";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleLicenseVerifyReject = async () => {
    const data = {
      in_merchant_license_id: selectedLicenseVerify.merchant_license_id,
      in_logged_user_id: currentUserId,
    };
    const headers = {
      in_platform_type_id: 4,
    };
    try {
      const res = await axios.post(`${baseURLv1}/adminLicenseVerification/rejectLicense`, data, {
        headers,
      });
      enqueueSnackbar(res.data.message, { variant: "success" });
      handleLicenseVerifyRejectClose();
      fetchLicenseVerifications(searchText, selectedCategory, currentPage);
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message || "Error occurred"
        : "Error occurred";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleNewContactSupport = () => {
    setSelectedCategory(7);
    setSearchText("For Verification");
    fetchLicenseVerifications("For Verification", 7);
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
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "#2e7d32", mr: 2 }}>
              <TaskIcon />
            </Avatar>
            <Typography variant="h6" gutterBottom fontSize={"1.2rem"}>
              License Verification
            </Typography>
          </Box>
          <Box>
            {licenseForVerificationsCount > 0 ? (
              <Paper
                elevation={3}
                sx={{
                  padding: "5px",
                  maxWidth: "300px",
                  backgroundColor: "lightyellow",
                }}
              >
                <Typography sx={{ fontSize: "0.8rem" }}>
                  There are{" "}
                  <Box component="span" sx={{ color: "red" }}>
                    {licenseForVerificationsCount}
                  </Box>{" "}
                  new support requests.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    color="customGreen"
                    variant="text"
                    onClick={handleNewContactSupport}
                    sx={{ fontSize: "0.8rem", textTransform: "none" }}
                  >
                    View All
                  </Button>
                </Box>
              </Paper>
            ) : null}
          </Box>
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
            {licenseVerifications.length === 0 ? (
              <Grid display="flex" justifyContent="center">
                <Typography color="rgb(160, 160, 160)">{"No records found"}</Typography>
              </Grid>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: "4px" }}>Merchant Name</TableCell>
                    <TableCell sx={{ padding: "4px" }}>License Trade Name</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Issued In</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Issue Date</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Expiry Date</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Status</TableCell>
                    <TableCell sx={{ padding: "4px" }}></TableCell>
                    <TableCell sx={{ padding: "4px" }}></TableCell>
                    <TableCell sx={{ padding: "4px" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {licenseVerifications.map((licenseVerification) => (
                    <TableRow
                      key={licenseVerification.merchant_license_id}
                      sx={{
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
                              src={licenseVerification.logo_path}
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
                              {licenseVerification.merchant_name}
                            </Typography>
                            <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                              {licenseVerification.merchant_code}
                            </Typography>
                          </Box>
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
                            {licenseVerification.trade_name}
                          </Typography>
                          <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                            {licenseVerification.license_no}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" fontSize="0.8rem">
                          {licenseVerification.city_name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" fontSize="0.8rem">
                          {formatDateWithoutTime(licenseVerification.issue_date)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" fontSize="0.8rem">
                          {formatDateWithoutTime(licenseVerification.expiry_date)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ padding: "4px" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          {licenseVerification.license_status == "Verified" ? (
                            <VerifiedIcon color="primary" />
                          ) : licenseVerification.license_status == "Rejected" ? (
                            <CancelIcon color="error" />
                          ) : null}
                          <Typography
                            fontSize="0.8rem"
                            color={
                              licenseVerification.license_status == "For Verification"
                                ? "red"
                                : "black"
                            }
                            fontWeight={"bold"}
                          >
                            {licenseVerification.license_status.toUpperCase()}
                          </Typography>
                        </Box>
                      </TableCell>
                      {licenseVerification.file_name ? (
                        <TableCell sx={{ padding: "4px", cursor: "pointer" }}>
                          <Tooltip title={"File Attachment"}>
                            <AttachmentIcon
                              color={"customGreen"}
                              onClick={() => handleFileClick(licenseVerification.file_name)}
                            />
                          </Tooltip>
                        </TableCell>
                      ) : (
                        <TableCell></TableCell>
                      )}

                      {licenseVerification.license_status == "For Verification" ? (
                        <>
                          <TableCell sx={{ padding: "4px", cursor: "pointer" }}>
                            <Tooltip title={"Reject"}>
                              <CancelIcon
                                color={"customGreen"}
                                onClick={() => handleCloseClick(licenseVerification)}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell sx={{ padding: "4px", cursor: "pointer" }}>
                            <Tooltip title={"Verify"}>
                              <CheckCircleIcon
                                color={"customGreen"}
                                onClick={() => handleVerifyClick(licenseVerification)}
                              />
                            </Tooltip>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Grid container sx={{ marginTop: "1rem" }} alignItems="center">
              <Grid item xs={2} display="flex" justifyContent="flex-start">
                {licenseVerifications.length !== 0 ? (
                  <Typography fontSize="0.8rem">{`${(currentPage - 1) * pageLimit + 1} to ${
                    (currentPage - 1) * pageLimit + currentPageRecords
                  } of ${totalRecords} Records`}</Typography>
                ) : null}
              </Grid>
              <Grid item xs={8} display="flex" justifyContent="center">
                {licenseVerifications.length === 0 ? null : (
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
          open={openLicenseVerify}
          onClose={handleLicenseVerifyClose}
          aria-labelledby="form-dialog-title"
          maxWidth="xs"
          fullWidth
        >
          <Box>
            <DialogTitle id="form-dialog-title">
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#2e7d32", mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Typography variant="h6">License Verification</Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Paper
                sx={{
                  padding: "15px",
                  backgroundColor: "lightyellow",
                  mb: "1rem",
                }}
              >
                <Typography sx={{ fontSize: "0.9rem" }}>
                  You should proceed with the verification after you have confirmed the correctness
                  & authenticity of the uploaded license copy.
                </Typography>
              </Paper>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Are you sure you want to verify this trade license?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleLicenseVerifyClose}
                color="customGreen"
                sx={{ fontSize: "0.8rem" }}
              >
                CANCEL
              </Button>
              <Button onClick={handleLicenseVerify} color="customGreen" sx={{ fontSize: "0.8rem" }}>
                VERIFY
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Dialog
          open={openlicenseVerifyClose}
          onClose={handleLicenseVerifyRejectClose}
          aria-labelledby="form-dialog-title"
          maxWidth="xs"
          fullWidth
        >
          <Box>
            <DialogTitle id="form-dialog-title">
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#2e7d32", mr: 2 }}>
                  <CancelIcon />
                </Avatar>
                <Typography variant="h6">License Verification</Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Are you sure you want to reject this trade license?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleLicenseVerifyRejectClose}
                color="customGreen"
                sx={{ fontSize: "0.8rem" }}
              >
                CANCEL
              </Button>
              <Button onClick={handleLicenseVerifyReject} color="error" sx={{ fontSize: "0.8rem" }}>
                REJECT
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};

export default LicenseVerification;
