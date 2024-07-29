import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
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

import CancelIcon from "@mui/icons-material/Cancel";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import React from "react";
import UploadIcon from "@mui/icons-material/Upload";

const ContactsupportDetails = ({ selectedContactSupport, contactSupportDetails }) => {
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

  return (
    <Grid container spacing={0} sx={{ marginTop: "15px" }}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mb: 3,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
              <UploadIcon sx={{ mr: 2, color: "#2e7d32" }} />
              <Typography variant="h6" fontSize="1.05rem">
                Requested By:
              </Typography>
            </Box>
            <Box ml={5}>
              <Typography variant="body2" fontSize="0.9rem" gutterBottom>
                {contactSupportDetails.sender_name}
              </Typography>
              <Typography variant="body2" fontSize="0.75rem" gutterBottom>
                {contactSupportDetails.sender_account_name}
              </Typography>
              <Typography variant="body2" fontSize="0.75rem" gutterBottom>
                {contactSupportDetails.sender_email} | {contactSupportDetails.sender_mobile_no}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" fontSize="0.9 rem">
            {formatDate(contactSupportDetails.message_timestamp)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", mb: 3, alignItems: "flex-start" }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
            <EmailIcon sx={{ mr: 2, color: "#2e7d32" }} />
            <Typography variant="h6" fontSize="1.05rem">
              Message:
            </Typography>
          </Box>
          <Box ml={5}>
            <Typography variant="body2" fontSize="0.9rem" gutterBottom>
              {contactSupportDetails.message}
            </Typography>
            <Button
              size="small"
              color="customGreen"
              variant="text"
              onClick={() => handleFileClick(selectedContactSupport.file_attachement)}
              sx={{ fontSize: "0.8rem", textTransform: "none" }}
            >
              View Attachment
            </Button>
          </Box>
        </Box>

        {contactSupportDetails.received_by_name == null &&
        contactSupportDetails.received_by_designation == null ? null : (
          <Box sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
              <DownloadIcon sx={{ mr: 2, color: "#2e7d32" }} />
              <Typography variant="h6" fontSize="1.05rem">
                Received By:
              </Typography>
            </Box>

            <Box ml={5}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="body2" fontSize="0.9rem" gutterBottom>
                    {contactSupportDetails.received_by_name}
                  </Typography>
                  <Typography variant="body2" fontSize="0.7rem" gutterBottom>
                    {contactSupportDetails.received_by_designation}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontSize="0.9rem" gutterBottom>
                    {formatDate(contactSupportDetails.received_timestamp)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" fontSize="0.9rem" mt={2} gutterBottom>
                {contactSupportDetails.received_remarks}
              </Typography>
            </Box>
          </Box>
        )}

        {contactSupportDetails.closed_by_name == null &&
        contactSupportDetails.closed_by_designation == null ? null : (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
              <CancelIcon sx={{ mr: 2, color: "#2e7d32" }} />
              <Typography variant="h6" fontSize="1.05rem">
                Closed By:
              </Typography>
            </Box>

            <Box ml={5}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="body2" fontSize="0.8rem" gutterBottom>
                    {contactSupportDetails.closed_by_name}
                  </Typography>
                  <Typography variant="body2" fontSize="0.8rem" gutterBottom>
                    {contactSupportDetails.closed_by_designation}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontSize="0.9rem" gutterBottom>
                    {formatDate(contactSupportDetails.closed_timestamp)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" fontSize="0.8rem" mt={2} gutterBottom>
                {contactSupportDetails.closed_remarks}
              </Typography>
            </Box>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ContactsupportDetails;
