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

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArticleIcon from "@mui/icons-material/Article";
import CampaignIcon from "@mui/icons-material/Campaign";
import InfoIcon from "@mui/icons-material/Info";
import Pagination from "@mui/material/Pagination";
import PersonIcon from "@mui/icons-material/Person";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { useSnackbar } from "notistack";

const TransactionHistory = ({ selectedMerchant }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRecords, setCurrentPageRecords] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState();
  const [totalRecords, setTotalRecords] = useState();

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async (pageNumber = 1) => {
    const data = { in_merchant_id: selectedMerchant, in_page_number: pageNumber };
    const res = await axios.post(
      `${baseURLv1}/adminManageMerchant/getMerchantTransactionHistoryByPage`,
      data
    );
    setTransactions(res.data.data);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchTransaction(page);
    //fetchMerchants("", 1, page);
  };

  return (
    <div>
      <DialogTitle id="alert-dialog-title">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
            <Box
              component="img"
              sx={{
                // position: "absolute",
                // top: "3%", // Move image down by 50% of its height
                // left: "5%",
                width: "100px", // Ensure it covers the width
                maxHeight: "130px",
                borderRadius: "50%", // Limit the max height to avoid overflow
              }}
              alt="Descriptive Alt Text"
              src={transactions.logo_path}
            />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="h6" fontSize={"1.2rem"} gutterBottom>
                {transactions.merchant_name}
              </Typography>
              <Typography variant="body" fontSize={"1rem"} gutterBottom>
                {transactions.merchant_code}
              </Typography>
            </Box>
          </Box>
          <Typography>Transaction History</Typography>
        </Box>

        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", margin: "auto" }}>
          <TableContainer>
            {transactions.results_list.length === 0 ? (
              <Grid display="flex" justifyContent="center">
                <Typography color="rgb(160, 160, 160)">{"No records found"}</Typography>
              </Grid>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: "4px" }}>Transaction Type</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Transaction Date</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Reference No.</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Amount (Points)</TableCell>
                    <TableCell sx={{ padding: "4px" }}>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.results_list.map((transaction) => (
                    <TableRow key={transaction.reference_no}>
                      <TableCell sx={{ padding: "8px", fontSize: "0.8rem" }}>
                        <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                          {transaction.transaction_type}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                          {transaction.transaction_timestamp}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                          {transaction.reference_no}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                          {transaction.amount}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" color="textSecondary" fontSize="0.7rem">
                          {transaction.remarks}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Grid container sx={{ marginTop: "1rem" }} alignItems="center">
              <Grid item xs={2} display="flex" justifyContent="flex-start">
                {transactions.results_list.length !== 0 ? (
                  <Typography fontSize="0.8rem">{`${(currentPage - 1) * pageLimit + 1} to ${
                    (currentPage - 1) * pageLimit + currentPageRecords
                  } of ${totalRecords} Records`}</Typography>
                ) : null}
              </Grid>
              <Grid item xs={8} display="flex" justifyContent="center">
                {transactions.results_list.length === 0 ? null : (
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
      </DialogTitle>
      <DialogContent>
        {/* <DialogContentText
          id="alert-dialog-description"
          sx={{ fontSize: "0.85rem" }}
        ></DialogContentText> */}
      </DialogContent>
    </div>
  );
};

export default TransactionHistory;
