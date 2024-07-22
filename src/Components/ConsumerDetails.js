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
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import TransactionHistory from "./TransactionHistory";
import axios from "axios";
import { useSnackbar } from "notistack";

const ConsumerDetails = ({
  consumerDetails,
  currentUserId,
  fetchConsumerDetails,
  selectedConsumer,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [consumerStatus, setConsumerStatus] = useState([]);
  const [selectedConsumerStatus, setSelectedConsumerStatus] = useState(null);
  const [selectedConsumerStatusName, setSelectedConsumerStatusName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [cashbackFee, setCashbackFee] = useState();
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [error, setError] = useState("");

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  useEffect(() => {
    fetchConsumerStatus();
    console.log("date:", formatDate(consumerDetails.last_transaction_date));
  }, []);

  useEffect(() => {
    if (consumerStatus.length > 0) {
      const selectedStatus = consumerStatus.find(
        (option) => option.consumer_status === consumerDetails.consumer_status
      );
      if (selectedStatus) {
        setSelectedConsumerStatus(selectedStatus.consumer_status_id);
        setSelectedConsumerStatusName(consumerDetails.consumer_status);
      }
    }
  }, [consumerStatus, consumerDetails.consumer_status]);

  const fetchConsumerStatus = async () => {
    try {
      const res = await axios.get(`${baseURLv1}/adminLookup/getAllConsumerStatus`);
      setConsumerStatus(res.data.data);
    } catch (error) {
      console.error("Error fetching merchant status:", error);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedConsumerStatus(e.target.value);
    setSelectedConsumerStatusName(
      consumerStatus.find((option) => option.consumer_status_id === e.target.value).consumer_status
    );
  };

  const handleSaveStatus = async () => {
    console.log();
    const data = {
      in_consumer_id: selectedConsumer.consumer_id,
      in_consumer_status_id: selectedConsumerStatus,
      in_user_id: currentUserId,
      in_remarks: remarks,
    };
    console.log("consumer id: ", data.in_consumer_id);

    const headers = {
      in_platform_type_id: 4,
    };

    try {
      const res = await axios.post(`${baseURLv1}/adminManageConsumer/changeConsumerStatus`, data, {
        headers,
      });
      enqueueSnackbar(res.data.message, { variant: "success" });
      setRemarks("");
      fetchConsumerDetails();
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

  const handleEditCashbackFee = () => {
    setIsEditable(!isEditable);
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
          src={consumerDetails.photo_path}
        />

        <Typography variant="h6" mt={14} fontWeight={"bold"}>
          {consumerDetails.consumer_name}
        </Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>{consumerDetails.consumer_code}</Typography>
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
                {consumerDetails.points_balance}{" "}
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
                    {consumerDetails.network_total}
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
                          {consumerDetails.network_level1}
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
                          {consumerDetails.network_level2}
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
                {formatDate(consumerDetails.last_transaction_date)}
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
                {formatDate(consumerDetails.registration_date)}
              </Typography>
            </Grid>
            <Divider variant="middle" />
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", borderRadius: "8px" }}>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", flexDirection: "row", mb: 3, alignItems: "center" }}>
              <InfoIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" fontSize={"1.05rem"} mb={0} gutterBottom>
                {"Consumer Information"}
              </Typography>
            </Box>
            <Chip
              label={
                <span className="flex gap-3 items-center justify-center">
                  {consumerDetails.consumer_status}
                </span>
              }
              color={
                consumerDetails.consumer_status == "Activated"
                  ? "success"
                  : consumerDetails.consumer_status == "Registered"
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
              xs={4}
              md={4}
              sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Nationality
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                {consumerDetails.nationality}
              </Typography>
            </Grid>

            <Grid
              item
              xs={4}
              md={4}
              sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Date Of Birth
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                {consumerDetails.branch_type}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              md={4}
              sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
            >
              <Typography variant="body" fontSize={"0.65rem"} color="grey" gutterBottom>
                Gender
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                {consumerDetails.gender}
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
                {consumerDetails.email_address}
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
                {consumerDetails.mobile_no}
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
                {consumerDetails.full_address}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 5 }} />

          <Box sx={{ display: "flex", flexDirection: "row", mb: 3, alignItems: "center" }}>
            <AccountBalanceIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
            <Typography variant="h6" fontSize={"1.05rem"} mb={0} gutterBottom>
              {"Bank Accounts"}
            </Typography>
          </Box>
          <Grid container spacing={1}>
            {consumerDetails && consumerDetails.list_bank ? (
              consumerDetails.list_bank.map((bank, index) => (
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
        </Paper>

        <Paper sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px" }}>
          <Box sx={{ display: "flex", flexDirection: "row", mb: 3, alignItems: "center" }}>
            <PersonIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
            <Typography variant="h6" fontSize={"1.05rem"}>
              Change Account Status:
            </Typography>
          </Box>
          <Grid container spacing={2} style={{ paddingTop: 0 }}>
            <Grid item xs={6}>
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
                  value={selectedConsumerStatus}
                  onChange={handleStatusChange}
                >
                  {consumerStatus.map((option) => (
                    <MenuItem
                      key={option.consumer_status_id}
                      value={option.consumer_status_id}
                      style={{ fontSize: "0.8rem" }}
                    >
                      {option.consumer_status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                value={remarks}
                onChange={handleRemarksChange}
                placeholder="Remarks"
                color="customGreen"
                InputProps={{
                  sx: { fontSize: "0.8rem" },
                }}
                inputProps={{ maxLength: 50 }}
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
            Are you sure you want to change user status to {selectedConsumerStatusName}?
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
        <TransactionHistory
          selectedEntityId={selectedConsumer.consumer_id}
          formatDate={formatDate}
          entityType="Consumer"
        />
        <DialogActions>
          <Button onClick={handleTransactionClose} color="customGreen" sx={{ fontSize: "0.8rem" }}>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ConsumerDetails;
