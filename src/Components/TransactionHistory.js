import {
  Box,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import OutboxIcon from "@mui/icons-material/Outbox";
import Pagination from "@mui/material/Pagination";
import ReceiveIcon from "../Images/ico_receive.webp";
import SendIcon from "../Images/ico_send.webp";
import Stack from "@mui/material/Stack";
import TopupIcon from "../Images/ico_topup.webp";
import TransferIcon from "../Images/ico_transfer.webp";
import WithdrawIcon from "../Images/ico_withdraw.webp";
import axios from "axios";

const TransactionHistory = ({ selectedMerchant, formatDate }) => {
  const [transactions, setTransactions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRecords, setCurrentPageRecords] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState();
  const [totalRecords, setTotalRecords] = useState();

  const baseURLv1 = "https://cheerful-arachnid-sought.ngrok-free.app/v1";

  useEffect(() => {
    fetchTransaction();
  }, [selectedMerchant.merchant_id]);

  const fetchTransaction = async (pageNumber = 1) => {
    const data = { in_merchant_id: selectedMerchant.merchant_id, in_page_number: pageNumber };
    const res = await axios.post(
      `${baseURLv1}/adminManageMerchant/getMerchantTransactionHistoryByPage`,
      data
    );
    const response = res.data.data;
    setTransactions(response);
    setTotalPages(response.total_number_of_pages);
    setCurrentPage(response.current_page_number);
    setTotalRecords(response.total_rows);
    setPageLimit(response.rows_per_page_limit);
    setCurrentPageRecords(response.rows_on_this_page);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchTransaction(page);
  };

  return (
    <div>
      <DialogTitle id="alert-dialog-title">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
            <Box
              component="img"
              sx={{
                width: "100px",
                maxHeight: "130px",
                borderRadius: "50%",
              }}
              alt="Descriptive Alt Text"
              src={transactions.logo_path}
            />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }} ml={1}>
              <Typography variant="h6" fontSize={"1.2rem"} fontWeight={"bold"} gutterBottom>
                {transactions.merchant_name}
              </Typography>
              <Typography variant="body" fontSize={"1rem"} color={"grey"} gutterBottom>
                {transactions.merchant_code}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h6" fontSize={"1.2rem"} mt={2}>
            Transaction History
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ padding: "20px", maxWidth: "1300px", margin: "auto" }}>
          <TableContainer>
            {transactions.results_list ? (
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
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          {transaction.transaction_type == "Cashback" ||
                          transaction.transaction_type == "Pay-By-Points" ? (
                            <img src={SendIcon} width={"40px"} />
                          ) : transaction.transaction_type == "Transfer" ? (
                            <img src={TransferIcon} width={"40px"} />
                          ) : transaction.transaction_type == "Withdrawal" ? (
                            <img src={WithdrawIcon} width={"40px"} />
                          ) : transaction.transaction_type == "Top Up" ? (
                            <img src={TopupIcon} width={"40px"} />
                          ) : (
                            <img src={TransferIcon} width={"40px"} />
                          )}

                          <Typography variant="body" fontSize="0.8rem" ml={1}>
                            {transaction.transaction_type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" fontSize="0.8rem">
                          {formatDate(transaction.transaction_timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" fontSize="0.8rem">
                          {transaction.reference_no}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          {transaction.amount_type == "In" ? (
                            <GetAppIcon fontSize="medium" sx={{ color: "green", mr: 1 }} />
                          ) : (
                            <FileUploadIcon fontSize="medium" sx={{ color: "red", mr: 1 }} />
                          )}

                          <Typography variant="body" fontSize="0.8rem">
                            {transaction.amount}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "4px", fontSize: "0.8rem" }}>
                        <Typography variant="body" fontSize="0.8rem">
                          {transaction.remarks}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Grid display="flex" justifyContent="center">
                <Typography color="rgb(160, 160, 160)">{"No records found"}</Typography>
              </Grid>
            )}
            <Grid container sx={{ marginTop: "1rem" }} alignItems="center">
              <Grid item xs={2} display="flex" justifyContent="flex-start">
                {transactions.results_list ? (
                  <Typography fontSize="0.8rem">{`${(currentPage - 1) * pageLimit + 1} to ${
                    (currentPage - 1) * pageLimit + currentPageRecords
                  } of ${totalRecords} Records`}</Typography>
                ) : null}
              </Grid>
              <Grid item xs={8} display="flex" justifyContent="center">
                {!transactions.results_list ? null : (
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
    </div>
  );
};

export default TransactionHistory;
