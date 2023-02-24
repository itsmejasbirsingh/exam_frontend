import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  Modal,
  TextField,
  typographyClasses,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AxiosClient from "../../utils/AxiosClient";
import { showError } from "../../utils/Error";
import { useImmer } from "use-immer";
import daysjs from "dayjs";
import { Link } from "react-router-dom";

const MyTests = () => {
  const [tests, setTests] = useState(null);

  const getMyTests = async () => {
    try {
      const tests = await AxiosClient.get(`exam/testpapers/assign/`);
      setTests(tests.data);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  useEffect(() => {
    getMyTests();
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const getStatus = (test) => {
    if (test.is_comming_soon) return "Comming Soon";
    if (test.is_expired) return "Expired";
    return (
      <Link
        to={`/my-tests/${test.id}`}
        style={{ color: "#fff", textDecoration: "none" }}
      >
        {test.question_attempts_count ? "Continue" : "Attempt"}
      </Link>
    );
  };

  return (
    <Box>
      <Typography variant="h5">My Test Papers</Typography>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#ID</TableCell>
              <TableCell>Test name</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Questions Count</TableCell>
              <TableCell>Questions Attempts</TableCell>
              <TableCell>Start Date & Time</TableCell>
              <TableCell>End Date & Time</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests
              ? tests.results.map((test) => {
                  return (
                    <TableRow key={test.id}>
                      <TableCell>{test.id}</TableCell>
                      <TableCell>{test.testpaper.title}</TableCell>
                      <TableCell>{test.testpaper.time} Minutes</TableCell>
                      <TableCell>
                        {test.testpaper.question.length} Questions
                      </TableCell>
                      <TableCell>
                        {test.question_attempts_count ===
                        test.testpaper.question.length
                          ? "All"
                          : test.question_attempts_count}{" "}
                        Questions Attempt
                      </TableCell>
                      <TableCell>
                        {test.start_at
                          ? daysjs(test.start_at).format("DD, MMM YYYY HH:mm A")
                          : "-"}{" "}
                      </TableCell>
                      <TableCell>
                        {test.end_at
                          ? daysjs(test.end_at).format("DD, MMM YYYY HH:mm A")
                          : "-"}{" "}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="warning"
                          disabled={test.is_expired || test.is_comming_soon}
                        >
                          {getStatus(test)}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyTests;
