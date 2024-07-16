import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
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

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AdminLogo from "../Images/no_logo.png";
import ArticleIcon from "@mui/icons-material/Article";
import CampaignIcon from "@mui/icons-material/Campaign";
import ClearIcon from "@mui/icons-material/Clear";
import Cookies from "js-cookie";
import DubaiFlag from "../Images/dubai_flag.jpg";
import EditIcon from "@mui/icons-material/Edit";
import Header from "./Header";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Pagination from "@mui/material/Pagination";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import VerticalNav from "./VerticalNav";
import axios from "axios";
import { useSnackbar } from "notistack";

const MerchantDetails = ({ merchantDetails }) => {
  const [merchantStatus, setMerchantStatus] = useState([]);
  const [selectedMerchantStatus, setselectedMerchantStatus] = useState(1);
  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  useEffect(() => {
    fetchMerchantStatus();
  }, []);

  const fetchMerchantStatus = async () => {
    const res = await axios.get(`${baseURLv1}/adminLookup/getAllMerchantStatus`);
    setMerchantStatus(res.data.data);
  };

  const handleStatusChange = (e) => {
    setselectedMerchantStatus(e.target.value);
  };

  const handleSaveStatus = () => {
    console.log("saved");
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

  return (
    <Grid container spacing={2} sx={{ marginTop: "15px" }}>
      <Grid xs={8} md={4} paddingX={"50px"}>
        <img
          src={merchantDetails.logo_path}
          alt="Dubai Flag"
          style={{ width: "100px", marginRight: "8px", borderRadius: "50%" }}
        />
        <Typography variant="h6" fontWeight={"bold"}>
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
              <Typography variant="body" fontSize={"0.8rem"} gutterBottom>
                Available Balance
              </Typography>
              <Typography
                variant="body"
                fontSize={"0.9rem"}
                fontWeight={"bold"}
                marginLeft={1}
                gutterBottom
              >
                {merchantDetails.points_balance}{" "}
                <Typography component="span" fontWeight={"bold"} sx={{ fontSize: "0.65rem" }}>
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
              <Typography variant="body" fontSize={"0.8rem"} gutterBottom>
                Cashback Fee Rate
              </Typography>
              <Typography
                variant="body"
                fontSize={"0.9rem"}
                fontWeight={"bold"}
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
                alignItems: "flex-start",
                paddingLeft: "15px",
                paddingTop: "15px",
              }}
            >
              <Typography variant="body" fontSize={"0.8rem"} gutterBottom>
                Network Downlines
              </Typography>
              <Typography
                variant="body"
                fontSize={"0.9rem"}
                fontWeight={"bold"}
                marginLeft={1}
                gutterBottom
              >
                <Grid
                  sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}
                >
                  <Grid>{merchantDetails.network_total}</Grid>
                  {/* <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                    {merchantDetails.network_total}
                  </Grid> */}
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
              <Typography variant="body" fontSize={"0.8rem"} gutterBottom>
                Most Recent Transaction
              </Typography>
              <Typography variant="body" fontSize={"0.9rem"} marginLeft={1} gutterBottom>
                {formatDate(merchantDetails.last_transaction_date)}
              </Typography>
              <Link
                href="/view-all"
                color="rgba(67,160,71)"
                variant="body1"
                fontSize={"0.8rem"}
                marginLeft={1}
                sx={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "flex-start",
                  paddingBottom: "10px",
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
              <Typography variant="body" fontSize={"0.8rem"} gutterBottom>
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
          <Box sx={{ display: "flex", flexDirection: "row", mb: 1, alignItems: "start" }}>
            <PersonIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2, mt: 0.5 }} />
            <Typography fontWeight={"bold"}>Change Account Status To:</Typography>
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
                defaultValue="Remarks"
                color="customGreen"
                InputProps={{
                  sx: { fontSize: "0.8rem" },
                }}
              />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
              <Button onClick={handleSaveStatus} color="customGreen" sx={{ fontSize: "0.8rem" }}>
                SAVE
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", borderRadius: "8px" }}>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", flexDirection: "row", mb: 1, alignItems: "start" }}>
              <PersonIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2, mt: 0.5 }} />
              <Typography variant="h6" fontSize={"1.05rem"} gutterBottom>
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
                <Typography variant="body" fontSize={"0.9rem"} gutterBottom>
                  {merchantDetails.tel_no}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", flexDirection: "row", mb: 1, alignItems: "start" }}>
            <ArticleIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2, mt: 0.5 }} />
            <Typography variant="h6" fontSize={"1.05rem"} gutterBottom>
              {"Trade License"}
            </Typography>
          </Box>
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
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", flexDirection: "row", mb: 1, alignItems: "start" }}>
            <AccountBalanceIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2, mt: 0.5 }} />
            <Typography variant="h6" fontSize={"1.05rem"} gutterBottom>
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
                    Account Name: {bank.account_name}
                  </Typography>
                  <Typography variant="body2" fontSize={"0.75rem"} color={"grey"}>
                    Account No: {bank.account_no} | IBAN: {bank.iban_no}
                  </Typography>
                  <Divider sx={{ mt: 1, width: "100%" }} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1">No bank details available.</Typography>
            )}
          </Grid>

          <Box sx={{ display: "flex", flexDirection: "row", mt: 3, mb: 1, alignItems: "start" }}>
            <RecentActorsIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2, mt: 0.5 }} />
            <Typography variant="h6" fontSize={"1.05rem"} gutterBottom>
              {"Contact Persons"}
            </Typography>
          </Box>
          <Grid container spacing={2}>
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
                    Account Name: {contact.designation}
                  </Typography>
                  <Typography variant="body" fontSize={"0.75rem"} color={"grey"}>
                    {contact.mobile_no} | {contact.email_address}
                  </Typography>
                  <Divider sx={{ mt: 1, width: "100%" }} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1">No contact details available.</Typography>
            )}
          </Grid>

          <Box sx={{ display: "flex", flexDirection: "row", mt: 3, mb: 1, alignItems: "start" }}>
            <CampaignIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2, mt: 0.5 }} />
            <Typography variant="h6" fontSize={"1.05rem"} gutterBottom>
              {"On Going Promotions"}
            </Typography>
          </Box>
          <Grid
            container
            spacing={2}
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
                    style={{ width: "50px", marginRight: "8px" }}
                  />

                  <Typography variant="body" fontSize={"0.8rem"} gutterBottom>
                    Account Name: {promotion.promo_title}
                  </Typography>
                  <Typography variant="body" fontSize={"0.6rem"} gutterBottom>
                    Promo Period:{promotion.promo_period}
                  </Typography>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">No promotion details available.</Typography>
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MerchantDetails;
