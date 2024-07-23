import {
  Avatar,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Cookies from "js-cookie";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import axios from "axios";
import { useSnackbar } from "notistack";

const SystemSettings = ({ handleSystemSettingsClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const fieldObject = {
    Receiver: "",
    Upline1: "",
    GN_Primary: "",
    Upline2: "",
    Bank_Accounts: "",
    Trade_Licenses: "",
    Contact_Persons: "",
    Promotions: "",
    Active_Promotions: "",
    Merchant_Min_Balance: "",
    Consumer_Min_Balance: "",
    License_Expiry_Days: "",
    Home_Promotions: "",
    Home_Featured_Merchants: "",
    Payment_Gateway: "",
    Minimum_Amount: "",
    Service_Charge: "",
    Telephone_Number: "",
    Mobile_Number: "",
    Email_Address: "",
    Website: "",
  };
  const [errors, setErrors] = useState(fieldObject);
  const [formValues, setFormValues] = useState(fieldObject);

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  const userDataObject = JSON.parse(Cookies.get("userData") || "{}");
  const userData = userDataObject.data[0];
  const currentUserId = userData.user_id;

  const decimalFields = ["Receiver", "Upline1", "GN_Primary", "Upline2", "Service_Charge"];
  const numberFields = [
    "Receiver",
    "Upline1",
    "GN_Primary",
    "Upline2",
    "Service_Charge",
    "Bank_Accounts",
    "Trade_Licenses",
    "Contact_Persons",
    "Promotions",
    "Active_Promotions",
    "Merchant_Min_Balance",
    "Consumer_Min_Balance",
    "License_Expiry_Days",
    "Home_Promotions",
    "Home_Featured_Merchants",
    "Payment_Gateway",
    "Minimum_Amount",
    "Telephone_Number",
    "Mobile_Number",
  ];

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    const res = await axios.get(`${baseURLv1}/adminSettings/getSystemSettings`);

    const SystemSettingsObject = {
      Receiver: res.data.data.cashback_perc_receiver,
      Upline1: res.data.data.cashback_perc_upline1,
      GN_Primary: res.data.data.cashback_perc_gn,
      Upline2: res.data.data.cashback_perc_upline2,
      Bank_Accounts: res.data.data.bank_limit_count,
      Trade_Licenses: res.data.data.license_limit_count,
      Contact_Persons: res.data.data.contact_limit_count,
      Promotions: res.data.data.promo_limit_count,
      Active_Promotions: res.data.data.promo_limit_count_active,
      Merchant_Min_Balance: res.data.data.balance_min_notify_merchant,
      Consumer_Min_Balance: res.data.data.balance_min_notify_consumer,
      License_Expiry_Days: res.data.data.license_expiry_days_notify,
      Home_Promotions: res.data.data.cons_app_dash_limit_promo,
      Home_Featured_Merchants: res.data.data.cons_app_dash_limit_featured,
      Payment_Gateway: res.data.data.default_payment_gateway_id,
      Minimum_Amount: res.data.data.withdraw_min_amount,
      Service_Charge: res.data.data.withdraw_service_charge,
      Telephone_Number: res.data.data.contact_telephone,
      Mobile_Number: res.data.data.contact_mobile,
      Email_Address: res.data.data.contact_email,
      Website: res.data.data.contact_website,
    };

    setFormValues(SystemSettingsObject);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const isValidNumber = (value) => /^[+\d]*$/.test(value.replace(/\s+/g, ""));

    if (numberFields.includes(name) && !isValidNumber(value)) {
      // setFormValues((prevValues) => ({
      //   ...prevValues,
      //   [name]: "",
      // }));
      return;
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    const regex = /^(?!0\d)\d*(\.\d{0,2})?$/;

    if (value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.replace("_", " ").replace("_", " ")} is required`,
      }));
    } else if (
      decimalFields.includes(name) &&
      regex.test(value) &&
      parseFloat(value) > 100 &&
      !isNaN(parseFloat(value))
    ) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: "",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `value should be a number and less than 100`,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest;
      });
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
          [name]: null,
        }));
      }
    }
  };

  const validateForm = () => {
    const newError = {};
    console.log(formValues.Receiver);
    if (formValues.Receiver.toString().trim() == "") newError.Receiver = "Receiver is required";
    if (formValues.Upline1.toString().trim() == "") newError.Upline1 = "Upline1 is required";
    if (formValues.GN_Primary.toString().trim() == "") newError.GN_Primary = "Receiver is required";
    if (formValues.Upline2.toString().trim() == "") newError.Upline2 = "Upline2 is required";
    if (formValues.Bank_Accounts.toString().trim() == "")
      newError.Bank_Accounts = "Bank Accounts is required";
    if (formValues.Trade_Licenses.toString().trim() == "")
      newError.Trade_Licenses = "Trade Licenses is required";
    if (formValues.Contact_Persons.toString().trim() == "")
      newError.Contact_Persons = "Contact Persons is required";
    if (formValues.Promotions.toString().trim() == "")
      newError.Promotions = "Promotions is required";
    if (formValues.Active_Promotions.toString().trim() == "")
      newError.Active_Promotions = "Active Promotions is required";
    if (formValues.Merchant_Min_Balance.toString().trim() == "")
      newError.Merchant_Min_Balance = "Merchant Min Balance is required";
    if (formValues.Consumer_Min_Balance.toString().trim() == "")
      newError.Consumer_Min_Balance = "Consumer Min Balance is required";
    if (formValues.License_Expiry_Days.toString().trim() == "")
      newError.License_Expiry_Days = "License_Expiry_Days is required";
    if (formValues.Home_Promotions.toString().trim() == "")
      newError.Home_Promotions = "Receiver is required";
    if (formValues.Home_Featured_Merchants.toString().trim() == "")
      newError.Home_Featured_Merchants = "Home Featured Merchants is required";
    if (formValues.Payment_Gateway.toString().trim() == "")
      newError.Payment_Gateway = "Payment Gateway is required";
    if (formValues.Minimum_Amount.toString().trim() == "")
      newError.Minimum_Amount = "Minimum Amount is required";
    if (formValues.Service_Charge.toString().trim() == "")
      newError.Service_Charge = "Service Charge is required";
    if (formValues.Telephone_Number.trim() == "")
      newError.Telephone_Number = "Telephone Number is required";
    if (formValues.Mobile_Number.trim() == "") newError.Mobile_Number = "Mobile Number is required";
    if (formValues.Email_Address.trim() == "") newError.Email_Address = "Email Address is required";
    if (formValues.Website.trim() == "") newError.Website = "Website is required";
    if (errors.Email_Address) newError.Email_Address = "Valid email address is required";

    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSaveSettings = async () => {
    console.log("errors list :", errors);
    if (!validateForm()) {
      return;
    }
    const data = {
      in_cashback_perc_receiver: parseFloat(formValues.Receiver),
      in_cashback_perc_gn: parseFloat(formValues.GN_Primary),
      in_cashback_perc_upline1: parseFloat(formValues.Upline1),
      in_cashback_perc_upline2: parseFloat(formValues.Upline2),
      in_bank_limit_count: parseFloat(formValues.Bank_Accounts),
      in_license_limit_count: parseFloat(formValues.Trade_Licenses),
      in_contact_limit_count: parseFloat(formValues.Contact_Persons),
      in_promo_limit_count: parseFloat(formValues.Promotions),
      in_promo_limit_count_active: parseFloat(formValues.Active_Promotions),
      in_balance_min_notify_merchant: parseFloat(formValues.Merchant_Min_Balance),
      in_balance_min_notify_consumer: parseFloat(formValues.Consumer_Min_Balance),
      in_license_expiry_days_notify: parseFloat(formValues.License_Expiry_Days),
      in_cons_app_dash_limit_promo: parseFloat(formValues.Home_Promotions),
      in_cons_app_dash_limit_featured: parseFloat(formValues.Home_Featured_Merchants),
      in_default_payment_gateway_id: parseFloat(formValues.Payment_Gateway),
      in_withdraw_min_amount: parseFloat(formValues.Minimum_Amount),
      in_withdraw_service_charge: parseFloat(formValues.Service_Charge),
      in_contact_telephone: formValues.Telephone_Number,
      in_contact_mobile: formValues.Mobile_Number,
      in_contact_email: formValues.Email_Address,
      in_contact_website: formValues.Website,
      in_logged_user_id: currentUserId,
      in_platform_type_id: 4,
      in_ip_address: "ip",
    };

    const headers = {
      in_platform_type_id: 4,
    };

    try {
      const res = await axios.post(`${baseURLv1}/adminSettings/updateSystemSettings`, data, {
        headers,
      });
      handleSystemSettingsClose();
      enqueueSnackbar(res.data.message, { variant: "success" });
    } catch (err) {
      const errorMessage = err.response ? err.response.data : "Error occurred";
      enqueueSnackbar(errorMessage.message || errorMessage, { variant: "error" });
    }
  };

  return (
    <div>
      <DialogTitle id="alert-dialog-title">
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ bgcolor: "#2e7d32", mr: 2, mb: 1 }}>
            <SettingsIcon />
          </Avatar>
          <Typography variant="h6" fontSize={"1.2rem"} gutterBottom>
            System Settings
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid
          container
          spacing={2}
          xs={8}
          style={{
            paddingTop: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <MonetizationOnIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
                <Typography variant="h6" gutterBottom fontSize={"1.05rem"}>
                  Cashback Percentage
                </Typography>
              </Box>
              <Typography variant="body" gutterBottom fontSize={"0.7rem"}>
                (Use decimal values for percentages like: 50% = 0.5)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoFocus
              name="Receiver"
              label="Receiver %"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Receiver}
              onChange={handleFieldChange}
              error={Boolean(errors.Receiver)}
              helperText={errors.Receiver}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 5 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="Upline1"
              label="Upline # 1 %"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Upline1}
              onChange={handleFieldChange}
              error={Boolean(errors.Upline1)}
              helperText={errors.Upline1}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 5 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="GN_Primary"
              label="GN Primary %"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.GN_Primary}
              onChange={handleFieldChange}
              error={Boolean(errors.GN_Primary)}
              helperText={errors.GN_Primary}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 5 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="Upline2"
              label="Upline # 2 %"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Upline2}
              onChange={handleFieldChange}
              error={Boolean(errors.Upline2)}
              helperText={errors.Upline2}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 5 }}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          xs={12}
          style={{
            paddingTop: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                mt: 7,
                mb: 0,
              }}
            >
              <PersonIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" gutterBottom fontSize={"1.05rem"}>
                Merchant Account Limit
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="Bank_Accounts"
              label="Bank Accounts"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Bank_Accounts}
              onChange={handleFieldChange}
              error={Boolean(errors.Bank_Accounts)}
              helperText={errors.Bank_Accounts}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="Trade_Licenses"
              label="Trade Licenses"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Trade_Licenses}
              onChange={handleFieldChange}
              error={Boolean(errors.Trade_Licenses)}
              helperText={errors.Trade_Licenses}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              name="Contact_Persons"
              label="Contact Persons"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Contact_Persons}
              onChange={handleFieldChange}
              error={Boolean(errors.Contact_Persons)}
              helperText={errors.Contact_Persons}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: "16px" }}>
            <TextField
              name="Promotions"
              label="Promotions"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Promotions}
              onChange={handleFieldChange}
              error={Boolean(errors.Promotions)}
              helperText={errors.Promotions}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: "16px" }}>
            <TextField
              name="Active_Promotions"
              label="Active Promotions"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Active_Promotions}
              onChange={handleFieldChange}
              error={Boolean(errors.Active_Promotions)}
              helperText={errors.Active_Promotions}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          xs={12}
          style={{
            paddingTop: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                mt: 7,
                mb: 0,
              }}
            >
              <NotificationsIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" gutterBottom fontSize={"1.05rem"}>
                Notifications
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="Merchant_Min_Balance"
              label="Merchant Min Balance"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Merchant_Min_Balance}
              onChange={handleFieldChange}
              error={Boolean(errors.Merchant_Min_Balance)}
              helperText={errors.Merchant_Min_Balance}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="Consumer_Min_Balance"
              label="Consumer Min Balance"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Consumer_Min_Balance}
              onChange={handleFieldChange}
              error={Boolean(errors.Consumer_Min_Balance)}
              helperText={errors.Consumer_Min_Balance}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="License_Expiry_Days"
              label="License Expiry Days"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.License_Expiry_Days}
              onChange={handleFieldChange}
              error={Boolean(errors.License_Expiry_Days)}
              helperText={errors.License_Expiry_Days}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          xs={8}
          style={{
            paddingTop: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                mt: 7,
              }}
            >
              <AccountCircleIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" gutterBottom fontSize={"1.05rem"}>
                Consumer App Settings
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="Home_Promotions"
              label="Home Promotions"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Home_Promotions}
              onChange={handleFieldChange}
              error={Boolean(errors.Home_Promotions)}
              helperText={errors.Home_Promotions}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="Home_Featured_Merchants"
              label="Home Featured Merchants"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Home_Featured_Merchants}
              onChange={handleFieldChange}
              error={Boolean(errors.Home_Featured_Merchants)}
              helperText={errors.Home_Featured_Merchants}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          xs={12}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                mt: 9,
                paddingTop: "0px",
              }}
            >
              <MonetizationOnIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" gutterBottom fontSize={"1.05rem"}>
                Top Up & Withdrawals
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: "0px" }}>
            <TextField
              name="Payment_Gateway"
              label="Payment Gateway"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Payment_Gateway}
              onChange={handleFieldChange}
              error={Boolean(errors.Payment_Gateway)}
              helperText={errors.Payment_Gateway}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 2 }}
            />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: "0px" }}>
            <TextField
              name="Minimum_Amount"
              label="Minimum Amount"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Minimum_Amount}
              onChange={handleFieldChange}
              error={Boolean(errors.Minimum_Amount)}
              helperText={errors.Minimum_Amount}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 3 }}
            />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: "0px" }}>
            <Box sx={{ marginTop: 2.5, paddingTop: "0px" }}>
              <TextField
                name="Service_Charge"
                label="Service Charge %"
                type="text"
                color="customGreen"
                required
                fullWidth
                value={formValues.Service_Charge}
                onChange={handleFieldChange}
                error={Boolean(errors.Service_Charge)}
                helperText={errors.Service_Charge}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{ sx: { fontSize: "0.8rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
                inputProps={{ maxLength: 5 }}
              />
              <Typography variant="body2" gutterBottom fontSize={"0.7rem"}>
                (Use decimal values for percentages like: 50% = 0.5)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          xs={8}
          style={{
            paddingTop: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                mt: 5,
              }}
            >
              <SupportAgentIcon fontSize="medium" sx={{ color: "#2e7d32", mr: 2 }} />
              <Typography variant="h6" gutterBottom fontSize={"1.05rem"}>
                Contact Support Details
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="Telephone_Number"
              label="Telephone No."
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Telephone_Number}
              onChange={handleFieldChange}
              error={Boolean(errors.Telephone_Number)}
              helperText={errors.Telephone_Number}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="Mobile_Number"
              label="Mobile No."
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Mobile_Number}
              onChange={handleFieldChange}
              error={Boolean(errors.Mobile_Number)}
              helperText={errors.Mobile_Number}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="Email_Address"
              label="Email Address"
              type="email"
              color="customGreen"
              required
              fullWidth
              value={formValues.Email_Address}
              onChange={handleFieldChange}
              error={Boolean(errors.Email_Address)}
              helperText={errors.Email_Address}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 30 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="Website"
              label="Website"
              type="text"
              color="customGreen"
              required
              fullWidth
              value={formValues.Website}
              onChange={handleFieldChange}
              error={Boolean(errors.Website)}
              helperText={errors.Website}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{ sx: { fontSize: "0.8rem" } }}
              InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              inputProps={{ maxLength: 30 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSaveSettings}
          variant="contained"
          color="customGreen"
          sx={{ fontSize: "0.8rem", margin: "15px" }}
        >
          SAVE
        </Button>
      </DialogActions>
    </div>
  );
};

export default SystemSettings;
