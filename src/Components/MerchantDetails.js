import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArticleIcon from "@mui/icons-material/Article";
import CampaignIcon from "@mui/icons-material/Campaign";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import TransactionHistory from "./TransactionHistory";
import axios from "axios";
import { useSnackbar } from "notistack";

const MerchantDetails = ({ merchantDetails, currentUserId, fetchMerchantDetails }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [merchantStatus, setMerchantStatus] = useState([]);
  const [selectedMerchantStatus, setSelectedMerchantStatus] = useState(null);
  const [selectedMerchantStatusName, setSelectedMerchantStatusName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  useEffect(() => {
    fetchMerchantStatus();
  }, []);

  useEffect(() => {
    if (merchantStatus.length > 0) {
      const selectedStatus = merchantStatus.find(
        (option) => option.merchant_status === merchantDetails.merchant_status
      );
      if (selectedStatus) {
        setSelectedMerchantStatus(selectedStatus.merchant_status_id);
        setSelectedMerchantStatusName(merchantDetails.merchant_status);
      }
    }
  }, [merchantStatus, merchantDetails.merchant_status]);

  const fetchMerchantStatus = async () => {
    try {
      const res = await axios.get(`${baseURLv1}/adminLookup/getAllMerchantStatus`);
      setMerchantStatus(res.data.data);
    } catch (error) {
      console.error("Error fetching merchant status:", error);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedMerchantStatus(e.target.value);
    setSelectedMerchantStatusName(
      merchantStatus.find((option) => option.merchant_status_id === e.target.value).merchant_status
    );
  };

  const handleSaveStatus = async () => {
    const data = {
      in_merchant_id: merchantDetails.merchant_id,
      in_merchant_status_id: selectedMerchantStatus,
      in_user_id: currentUserId,
      in_remarks: remarks,
    };

    const headers = {
      in_platform_type_id: 4,
    };

    try {
      const res = await axios.post(`${baseURLv1}/adminManageMerchant/changeMerchantStatus`, data, {
        headers,
      });
      enqueueSnackbar(res.data.message, { variant: "success" });
      setRemarks("");
      fetchMerchantDetails();
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message || "Error occurred"
        : "Error occurred";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    handleStatusClose();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
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

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const handleConfirmStatus = () => {
    setOpenStatusDialog(true);
  };

  const handleStatusClose = () => {
    setOpenStatusDialog(false);
  };

  const handleTransactionDialog = () => {
    setOpenTransactionDialog(true);
  };

  const handleTransactionClose = () => {
    setOpenTransactionDialog(false);
  };

  return (
    <Grid container spacing={0} sx={{ marginTop: "15px" }}>
      <Grid xs={8} md={4} paddingX={"50px"}>
        <Box
          component="img"
          sx={{
            position: "absolute",
            top: "3%", // Move image down by 50% of its height
            left: "5%",
            width: "16%", // Ensure it covers the width
            maxHeight: 200,
            borderRadius: "50%", // Limit the max height to avoid overflow
          }}
          alt="Descriptive Alt Text"
          src={merchantDetails.logo_path}
        />

        <Typography variant="h6" mt={14} fontWeight={"bold"}>
          {merchantDetails.merchant_name}
        </Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>{merchantDetails.merchant_code}</Typography>
        <Paper sx={{ marginTop: "20px", borderRadius: "8px" }}>
          <Grid container sx={{ display: "flex", flexDirection: "column" }}>
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingLeft: "15px",
                paddingTop: "15px",
              }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Available Balance
              </Typography>
              <Typography
                variant="body"
                fontSize={"0.9rem"}
                // fontWeight={"bold"}
                marginLeft={1}
                gutterBottom
              >
                {merchantDetails.points_balance}{" "}
                <Typography component="span" sx={{ fontSize: "0.65rem" }}>
                  Points
                </Typography>
              </Typography>
            </Grid>
            <Divider variant="middle" />
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingLeft: "15px",
                paddingTop: "15px",
              }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Cashback Fee Rate
              </Typography>
              <Typography
                variant="body"
                fontSize={"0.9rem"}
                // fontWeight={"bold"}
                marginLeft={1}
                gutterBottom
              >
                {merchantDetails.merchant_fee}%
              </Typography>
            </Grid>
            <Divider variant="middle" />
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "15px",
                paddingTop: "15px",
              }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Network Downlines
              </Typography>
              <Typography variant="body" marginLeft={1} gutterBottom>
                <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Grid item fontSize={"0.9rem"}>
                    {merchantDetails.network_total}
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginRight: "15px",
                      color: "black",
                    }}
                  >
                    <Grid item>
                      <Grid
                        item
                        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
                      >
                        <Typography fontSize={"0.7rem"} sx={{ marginRight: "0.25rem" }}>
                          Level 1:
                        </Typography>

                        <Typography fontSize={"0.7rem"}>
                          {merchantDetails.network_level1}
                        </Typography>
                        <Typography fontSize={"0.7rem"} ml={2} mr={2}>
                          |
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid
                        item
                        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
                      >
                        <Typography fontSize={"0.7rem"} sx={{ marginRight: "0.25rem" }}>
                          Level 2:
                        </Typography>

                        <Typography fontSize={"0.7rem"}>
                          {merchantDetails.network_level2}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Typography>
            </Grid>
            <Divider variant="middle" />
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingLeft: "15px",
                paddingTop: "15px",
              }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Most Recent Transaction
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} marginLeft={1} gutterBottom>
                {formatDate(merchantDetails.last_transaction_date)}
              </Typography>
              <Link
                color="rgba(67,160,71)"
                variant="body1"
                fontSize={"0.7rem"}
                marginLeft={1}
                onClick={handleTransactionDialog}
                sx={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "flex-start",
                  paddingBottom: "10px",
                  cursor: "pointer",
                }}
              >
                View Transaction History
              </Link>
            </Grid>
            <Divider variant="middle" />
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingLeft: "15px",
                paddingTop: "15px",
              }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Registration Date
              </Typography>
              <Typography
                variant="body"
                fontSize={"0.9rem"}
                marginLeft={1}
                paddingBottom={2}
                gutterBottom
              >
                {formatDate(merchantDetails.registration_date)}
              </Typography>
            </Grid>
            <Divider variant="middle" />
          </Grid>
        </Paper>

        <Paper sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px" }}>
          <Box sx={{ display: "flex", flexDirection: "row", mb: 3, alignItems: "center" }}>
            <PersonIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
            <Typography variant="h6" fontSize={"1.05rem"}>
              Change Account Status:
            </Typography>
          </Box>
          <Grid container spacing={2} style={{ paddingTop: 0 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <Select
                  labelId="status-dropdown"
                  id="statusdropdown"
                  name="Status"
                  color="customGreen"
                  sx={{
                    borderRadius: 1,
                    fontSize: "0.8rem",
                    height: "100%",
                  }}
                  value={selectedMerchantStatus}
                  onChange={handleStatusChange}
                >
                  {merchantStatus.map((option) => (
                    <MenuItem
                      key={option.merchant_status_id}
                      value={option.merchant_status_id}
                      style={{ fontSize: "0.8rem" }}
                    >
                      {option.merchant_status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={remarks}
                onChange={handleRemarksChange}
                placeholder="Remarks"
                color="customGreen"
                InputProps={{
                  sx: { fontSize: "0.8rem" },
                }}
              />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
              <Button
                onClick={handleConfirmStatus}
                variant="contained"
                color="customGreen"
                sx={{ fontSize: "0.8rem" }}
              >
                SAVE
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", borderRadius: "8px" }}>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", flexDirection: "row", mb: 3, alignItems: "center" }}>
              <InfoIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" fontSize={"1.05rem"} mb={0} gutterBottom>
                {"Merchant Information"}
              </Typography>
            </Box>
            <Chip
              label={
                <span className="flex gap-3 items-center justify-center">
                  {merchantDetails.merchant_status}
                </span>
              }
              color={
                merchantDetails.merchant_status == "Active"
                  ? "success"
                  : merchantDetails.merchant_status == "Registered"
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
          </Box>
          <Grid container spacing={2}>
            <Grid
              item
              xs={6}
              md={6}
              sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Industry
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                {merchantDetails.industry_name}
              </Typography>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Branch Type
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                {merchantDetails.branch_type}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid
              item
              xs={6}
              md={6}
              sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Email Address
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                {merchantDetails.email_address}
              </Typography>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Mobile Number
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                {merchantDetails.mobile_no}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={12}
              sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Address
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                {merchantDetails.address}
              </Typography>
              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "start",
                  marginTop: "6px",
                }}
              >
                <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                  Telephone No :
                </Typography>
                <Typography variant="body" fontSize={"0.9rem"} gutterBottom ml={1}>
                  {merchantDetails.tel_no}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 5 }} />

          <Box sx={{ display: "flex", flexDirection: "row", mb: 3, alignItems: "center" }}>
            <ArticleIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
            <Typography variant="h6" fontSize={"1.05rem"} mb={0} gutterBottom>
              {"Trade License"}
            </Typography>
          </Box>
          {merchantDetails && merchantDetails.lic_trade_name != null ? (
            <>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                    Trade Name
                  </Typography>
                  <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                    {merchantDetails.lic_trade_name}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                    License Number
                  </Typography>
                  <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                    {merchantDetails.lic_license_no}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                    Main License Number
                  </Typography>
                  <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                    {merchantDetails.lic_main_license_no}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                    License Type
                  </Typography>
                  <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                    {merchantDetails.lic_license_type}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                    City Issued
                  </Typography>
                  <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                    {merchantDetails.lic_city_isued}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                    Validity Date
                  </Typography>
                  <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                    {merchantDetails.lic_validity_date}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                    License Copy
                  </Typography>
                  <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                    {merchantDetails.lic_license_copy}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ mb: 5 }} />
            </>
          ) : (
            <Grid container spacing={1}>
              <Typography variant="body1" color="grey" fontSize={"0.9rem"} mb={4} ml={6}>
                No trade license details available.
              </Typography>
            </Grid>
          )}

          <Box sx={{ display: "flex", flexDirection: "row", mb: 3, alignItems: "center" }}>
            <AccountBalanceIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
            <Typography variant="h6" fontSize={"1.05rem"} mb={0} gutterBottom>
              {"Bank Accounts"}
            </Typography>
          </Box>
          <Grid container spacing={1}>
            {merchantDetails && merchantDetails.list_bank ? (
              merchantDetails.list_bank.map((bank, index) => (
                <Grid
                  item
                  xs={12}
                  md={12}
                  key={index}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <Typography variant="body1" fontSize={"0.9rem"}>
                    {bank.bank}
                  </Typography>
                  <Typography variant="body2" fontSize={"0.75rem"}>
                    {bank.account_name}
                  </Typography>
                  <Typography variant="body2" fontSize={"0.75rem"} color={"grey"}>
                    Account No: {bank.account_no} {bank.iban_no ? "|" : null} IBAN: {bank.iban_no}
                  </Typography>
                  <Divider sx={{ mt: 1, width: "100%" }} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" color="grey" fontSize={"0.9rem"} ml={6}>
                No bank details available.
              </Typography>
            )}
          </Grid>

          <Box sx={{ display: "flex", flexDirection: "row", mt: 5, mb: 3, alignItems: "center" }}>
            <RecentActorsIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
            <Typography variant="h6" fontSize={"1.05rem"} mb={0} gutterBottom>
              {"Contact Persons"}
            </Typography>
          </Box>
          <Grid container spacing={1}>
            {merchantDetails && merchantDetails.list_contact ? (
              merchantDetails.list_contact.map((contact, index) => (
                <Grid
                  item
                  xs={12}
                  md={12}
                  key={index}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <Typography variant="body" fontSize={"0.9rem"}>
                    {contact.contact_name}
                  </Typography>
                  <Typography variant="body" fontSize={"0.75rem"}>
                    {contact.designation}
                  </Typography>
                  <Typography variant="body" fontSize={"0.75rem"} color={"grey"}>
                    {contact.mobile_no} {contact.email_address ? "|" : null} {contact.email_address}
                  </Typography>
                  <Divider sx={{ mt: 1, width: "100%" }} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" color="grey" fontSize={"0.9rem"} ml={6}>
                No contact details available.
              </Typography>
            )}
          </Grid>

          <Box sx={{ display: "flex", flexDirection: "row", mt: 5, mb: 4, alignItems: "center" }}>
            <CampaignIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
            <Typography variant="h6" fontSize={"1.05rem"} mb={0} gutterBottom>
              {"On Going Promotions"}
            </Typography>
          </Box>
          <Grid
            container
            spacing={1}
            sx={{ display: "flex", flexDirection: "row", alignItems: "start" }}
          >
            {merchantDetails && merchantDetails.list_promotion ? (
              merchantDetails.list_promotion.map((promotion, index) => (
                <Grid
                  item
                  xs={4}
                  md={4}
                  key={index}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
                >
                  <img
                    src={promotion.image_file}
                    alt="Dubai Flag"
                    style={{
                      width: "200px",
                      height: "125px",
                      marginRight: "8px",
                      marginBottom: "8px",
                    }}
                  />

                  <Typography variant="body" fontSize={"0.8rem"} gutterBottom>
                    {promotion.promo_title}
                  </Typography>
                  <Typography variant="body" fontSize={"0.6rem"} color="grey" gutterBottom>
                    Promo Period:
                    <Typography variant="body" fontSize={"0.6rem"} color="grey" ml={1}>
                      {promotion.promo_period}
                    </Typography>
                  </Typography>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" color="grey" fontSize={"0.9rem"} ml={6}>
                No promotion details available.
              </Typography>
            )}
          </Grid>
        </Paper>
      </Grid>

      <Dialog
        open={openStatusDialog}
        onClose={handleStatusClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
            <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, mb: 1 }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="h6" fontSize={"1.2rem"} gutterBottom>
              Change Status
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ fontSize: "0.85rem" }}>
            Are you sure you want to change user status to {selectedMerchantStatusName}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusClose} color="customGreen" sx={{ fontSize: "0.8rem" }}>
            CANCEL
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveStatus}
            color="customGreen"
            sx={{ fontSize: "0.8rem" }}
          >
            SAVE
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openTransactionDialog}
        onClose={handleTransactionClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <TransactionHistory />
        <DialogActions>
          <Button onClick={handleTransactionClose} color="customGreen" sx={{ fontSize: "0.8rem" }}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default MerchantDetails;
