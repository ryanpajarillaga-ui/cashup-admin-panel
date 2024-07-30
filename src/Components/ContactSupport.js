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
import ClearIcon from "@mui/icons-material/Clear";
import ContactsupportDetails from "./ContactSupportDetails";
import Cookies from "js-cookie";
import Header from "./Header";
import Pagination from "@mui/material/Pagination";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import Stack from "@mui/material/Stack";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedIcon from "@mui/icons-material/Verified";
import VerticalNav from "./VerticalNav";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";

const ContactSupport = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [contactSupports, setContactSupports] = useState([]);
  const [newContactSupportsCount, setNewContactSupportsCount] = useState();
  const [reviewContactSupportsCount, setReviewContactSupportsCount] = useState();
  const [contactSupportDetails, setContactSupportDetails] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [searchCategory, setSearchCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRecords, setCurrentPageRecords] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState();
  const [reviewRemarks, setReviewRemarks] = useState("");
  const [closeRemarks, setCloseRemarks] = useState("");

  const [totalRecords, setTotalRecords] = useState();
  const [selectedContactSupport, setSelectedContactSupport] = useState();

  const [opencontactSupportDetails, setOpencontactSupportDetails] = useState(false);
  const [opencontactSupportReview, setOpencontactSupportReview] = useState(false);
  const [opencontactSupportClose, setOpencontactSupportClose] = useState(false);

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
      fetchContactSupports(searchText, selectedCategory, currentPage);
    }

    setNotificationMessage(null);
  }, []);

  useEffect(() => {
    fetchContactSupportDetails();
  }, [selectedContactSupport]);

  const fetchContactSupports = async (searchText = "", selectedCategory = 1, pageNumber = 1) => {
    try {
      const data = {
        in_search_text: searchText,
        in_search_category_id: selectedCategory,
        in_page_number: pageNumber,
      };

      let response = await axios.post(
        `${baseURLv1}/adminContactSupport/searchContactRequestListByPage`,
        data
      );
      response = response.data.data;
      const result = response.results_list || [];

      setContactSupports(result);

      setNewContactSupportsCount(response.new_request_count);
      setReviewContactSupportsCount(response.review_request_count);
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
      setContactSupports(result);
      setTotalPages(response.total_number_of_pages);
      setCurrentPage(response.current_page_number);
      setTotalRecords(response.total_row_count);
      setPageLimit(response.rows_per_page_limit);
      setCurrentPageRecords(response.rows_on_this_page);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const fetchContactSupportDetails = async () => {
    if (selectedContactSupport) {
      const res = await axios.post(`${baseURLv1}/adminContactSupport/getContactRequestDetails`, {
        in_contact_support_id: selectedContactSupport.contact_support_id,
      });
      setContactSupportDetails(res.data.data);
    }
  };

  const fetchSearchCategory = async () => {
    try {
      const response = await axios.get(`${baseURLv1}/adminLookup/getAllContactSearchCategory`);
      setSearchCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching Merchants:", error);
    }
  };

  const handleSearch = () => {
    if (selectedCategory == 0) {
      setSelectedCategory(null);
    }
    fetchContactSupports(searchText, selectedCategory);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleReviewRemarksChange = (e) => {
    setReviewRemarks(e.target.value);
  };

  const handlecloseRemarksChange = (e) => {
    setCloseRemarks(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
    fetchContactSupports("", selectedCategory);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedCategory(1);
    fetchContactSupports("");
  };

  const handlePageChange = (event, page) => {
    fetchContactSupports(searchText, selectedCategory, page);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options).replace(",", "").replace(/\//g, "-");
  };

  const handleFileClick = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  const handlePreviewClick = (contactSupport) => {
    setOpencontactSupportDetails(true);
    setSelectedContactSupport(contactSupport);
  };

  const handleContactSupportDetailsClose = () => {
    setOpencontactSupportDetails(false);
  };

  const handleReviewClick = (contactSupport) => {
    setOpencontactSupportReview(true);
    setSelectedContactSupport(contactSupport);
  };

  const handleCloseClick = (contactSupport) => {
    setOpencontactSupportClose(true);
    setSelectedContactSupport(contactSupport);
  };

  const handleContactSupportReviewClose = () => {
    setReviewRemarks("");
    setOpencontactSupportReview(false);
  };

  const handleContactSupportCloseClose = () => {
    setCloseRemarks("");
    setOpencontactSupportClose(false);
  };

  const handleContactSupportReview = async () => {
    const data = {
      in_contact_support_id: selectedContactSupport.contact_support_id,
      in_logged_user_id: currentUserId,
      in_read_remarks: reviewRemarks,
    };
    const headers = {
      in_platform_type_id: 4,
    };
    try {
      const res = await axios.post(`${baseURLv1}/adminContactSupport/receiveContactRequest`, data, {
        headers,
      });
      enqueueSnackbar(res.data.message, { variant: "success" });
      handleContactSupportReviewClose();
      fetchContactSupports(searchText, selectedCategory, currentPage);
      setReviewRemarks("");
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message || "Error occurred"
        : "Error occurred";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleContactSupportClose = async () => {
    const data = {
      in_contact_support_id: selectedContactSupport.contact_support_id,
      in_logged_user_id: currentUserId,
      in_closed_remarks: closeRemarks,
    };
    const headers = {
      in_platform_type_id: 4,
    };
    try {
      const res = await axios.post(`${baseURLv1}/adminContactSupport/closeContactRequest`, data, {
        headers,
      });
      enqueueSnackbar(res.data.message, { variant: "success" });
      handleContactSupportCloseClose();
      fetchContactSupports(searchText, selectedCategory, currentPage);
      setCloseRemarks("");
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message || "Error occurred"
        : "Error occurred";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleNewContactSupport = () => {
    setSelectedCategory(3);
    setSearchText("New");
    fetchContactSupports("New", 3);
  };

  const handleReviewContactSupport = () => {
    setSelectedCategory(3);
    setSearchText("Reviewing");
    fetchContactSupports("Reviewing", 3);
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
              <SupportAgentIcon />
            </Avatar>
            <Typography variant="h6" gutterBottom fontSize={"1.2rem"}>
              Contact Support Requests
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            {reviewContactSupportsCount > 0 ? (
              <Paper
                elevation={3}
                sx={{
                  padding: "5px",
                  maxWidth: "300px",
                  marginRight: 3,

                  backgroundColor: "lightyellow",
                }}
              >
                <Typography sx={{ fontSize: "0.8rem" }}>
                  There are{" "}
                  <Box component="span" sx={{ color: "orange" }}>
                    {reviewContactSupportsCount}
                  </Box>{" "}
                  support requests on review.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    color="customGreen"
                    variant="text"
                    onClick={handleReviewContactSupport}
                    sx={{ fontSize: "0.8rem", textTransform: "none" }}
                  >
                    View All
                  </Button>
                </Box>
              </Paper>
            ) : null}

            {newContactSupportsCount > 0 ? (
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
                    {newContactSupportsCount}
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
            {contactSupports.length === 0 ? (
              <Grid display="flex" justifyContent="center">
                <Typography color="rgb(160, 160, 160)">{"No records found"}</Typography>
              </Grid>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: "4px" }}>Requested By</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Message</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Date Requested</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Status</TableCell>
                    <TableCell sx={{ padding: "4px" }}></TableCell>
                    <TableCell sx={{ padding: "4px" }}></TableCell>
                    <TableCell sx={{ padding: "4px" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contactSupports.map((contactSupport) => (
                    <TableRow
                      key={contactSupport.contact_support_id}
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
                              src={contactSupport.sender_photo}
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
                              {contactSupport.sender_name}
                            </Typography>
                            <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                              {contactSupport.account_name}
                            </Typography>
                            <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                              {contactSupport.sender_email}
                            </Typography>
                            <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                              {contactSupport.sender_mobile_no}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" fontSize="0.8rem">
                          {contactSupport.message}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" fontSize="0.8rem">
                          {formatDate(contactSupport.message_timestamp)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ padding: "4px" }}>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          {contactSupport.status == "Closed" ? (
                            <VerifiedIcon color="primary" />
                          ) : null}
                          <Typography
                            fontSize="0.8rem"
                            color={
                              contactSupport.status == "New"
                                ? "red"
                                : contactSupport.status == "Reviewing"
                                ? "orange"
                                : "black"
                            }
                            fontWeight={"bold"}
                          >
                            {contactSupport.status.toUpperCase()}
                          </Typography>
                        </Box>
                      </TableCell>
                      {(contactSupport.status == "New" || contactSupport.status == "Closed") &&
                      contactSupport.file_attachement ? (
                        <TableCell sx={{ padding: "4px", cursor: "pointer" }}>
                          <Tooltip title={"File Attachment"}>
                            <AttachmentIcon
                              color={"customGreen"}
                              onClick={() => handleFileClick(contactSupport.file_attachement)}
                            />
                          </Tooltip>
                        </TableCell>
                      ) : (
                        <TableCell></TableCell>
                      )}

                      <TableCell sx={{ padding: "4px", cursor: "pointer" }}>
                        <Tooltip title={"View Details"}>
                          <VisibilityIcon
                            color={"customGreen"}
                            onClick={() => handlePreviewClick(contactSupport)}
                          />
                        </Tooltip>
                      </TableCell>
                      {contactSupport.status == "New" ? (
                        <TableCell sx={{ padding: "4px", cursor: "pointer" }}>
                          <Tooltip title={"Review"}>
                            <SettingsSuggestIcon
                              color={"customGreen"}
                              onClick={() => handleReviewClick(contactSupport)}
                            />
                          </Tooltip>
                        </TableCell>
                      ) : null}

                      {contactSupport.status == "Reviewing" ? (
                        <TableCell sx={{ padding: "4px", cursor: "pointer" }}>
                          <Tooltip title={"Close Support Request"}>
                            <CancelIcon
                              color={"customGreen"}
                              onClick={() => handleCloseClick(contactSupport)}
                            />
                          </Tooltip>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Grid container sx={{ marginTop: "1rem" }} alignItems="center">
              <Grid item xs={2} display="flex" justifyContent="flex-start">
                {contactSupports.length !== 0 ? (
                  <Typography fontSize="0.8rem">{`${(currentPage - 1) * pageLimit + 1} to ${
                    (currentPage - 1) * pageLimit + currentPageRecords
                  } of ${totalRecords} Records`}</Typography>
                ) : null}
              </Grid>
              <Grid item xs={8} display="flex" justifyContent="center">
                {contactSupports.length === 0 ? null : (
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
          open={opencontactSupportReview}
          onClose={handleContactSupportReviewClose}
          aria-labelledby="form-dialog-title"
          maxWidth="xs"
          fullWidth
        >
          <Box>
            <DialogTitle id="form-dialog-title">
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#2e7d32", mr: 2 }}>
                  <SettingsSuggestIcon />
                </Avatar>
                <Typography variant="h6">Receive & Review Request</Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={reviewRemarks}
                onChange={handleReviewRemarksChange}
                placeholder="Please provide your remarks for this request."
                color="customGreen"
                InputProps={{
                  sx: { fontSize: "0.8rem", marginTop: "2rem", marginBottom: "1rem" },
                }}
                inputProps={{ maxLength: 100 }}
              />
              <Typography sx={{ fontSize: "0.9rem" }}>
                Are you sure you want to receive and review this support request?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleContactSupportReviewClose}
                color="customGreen"
                sx={{ fontSize: "0.8rem" }}
              >
                CANCEL
              </Button>
              <Button
                onClick={handleContactSupportReview}
                color="customGreen"
                sx={{ fontSize: "0.8rem" }}
              >
                REVIEW
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Dialog
          open={opencontactSupportClose}
          onClose={handleContactSupportCloseClose}
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
                <Typography variant="h6">Close Support Request</Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={closeRemarks}
                onChange={handlecloseRemarksChange}
                placeholder="Please provide your remarks for this request."
                color="customGreen"
                InputProps={{
                  sx: { fontSize: "0.8rem", marginTop: "2rem", marginBottom: "1rem" },
                }}
                inputProps={{ maxLength: 100 }}
              />
              <Typography sx={{ fontSize: "0.9rem", marginBottom: "6px" }}>
                Please make sure the request has been reviewed and already resolved before closing.
              </Typography>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Are you sure you want to close this support request?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleContactSupportCloseClose}
                color="customGreen"
                sx={{ fontSize: "0.8rem" }}
              >
                CANCEL
              </Button>
              <Button
                onClick={handleContactSupportClose}
                color="customGreen"
                sx={{ fontSize: "0.8rem" }}
              >
                CLOSE
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Dialog
          open={opencontactSupportDetails}
          onClose={handleContactSupportDetailsClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <Box>
            <DialogTitle id="form-dialog-title">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#2e7d32", mr: 2 }}>
                    <SupportAgentIcon />
                  </Avatar>
                  <Typography variant="h6">Contact Support Details</Typography>
                </Box>
                <Button onClick={handleContactSupportDetailsClose} color={"customGreen"}>
                  X
                </Button>
              </Box>
            </DialogTitle>

            <DialogContent>
              <ContactsupportDetails
                selectedContactSupport={selectedContactSupport}
                contactSupportDetails={contactSupportDetails}
              />
            </DialogContent>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ContactSupport;
