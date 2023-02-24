import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
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
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AxiosClient from "../../utils/AxiosClient";
import { showError } from "../../utils/Error";
import { useImmer } from "use-immer";

const Tests = () => {
  const [tests, setTests] = useState(null);
  const [users, setUsers] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  const [startDate, setStartDate] = useState(dayjs(null));
  const [endDate, setEndDate] = useState(dayjs(null));

  const getTests = async () => {
    try {
      const tests = await AxiosClient.get(`exam/testpapers/`);
      setTests(tests.data);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  useEffect(() => {
    getTests();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await AxiosClient.get(`base/users/`);
      setUsers(users.data);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchUsers();
    }
  }, [showModal]);

  const assignHandler = async () => {
    try {
      const assignment = await AxiosClient.post(`exam/testpapers/assign/`, {
        testpaper: selectedTest.id,
        user: selectedUsersId,
        start_at: startDate,
        end_at: endDate,
      });
      if (assignment.data) {
        getTests();
        setSelectedUsersId([]);
        setShowModal(false);
      }
    } catch (e) {
      alert(showError(e.response));
    }
  };

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

  return (
    <Box>
      <Typography variant="h5">Test Papers</Typography>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={style}>
          <Typography variant="h6" style={{ marginBottom: 12 }}>
            Test: {selectedTest ? selectedTest.title : ""}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              disablePast
              label="Start Date & Time"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              disablePast
              label="End Date & Time"
              value={endDate}
              onChange={(date) => {
                setEndDate(date);
              }}
              renderInput={(params) => (
                <TextField {...params} style={{ marginLeft: 20 }} />
              )}
            />
          </LocalizationProvider>

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#Select</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  ? users.results.map((user) => {
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUsersId.includes(user.id)}
                              onChange={() => {
                                const users = [...selectedUsersId];

                                if (users.includes(user.id)) {
                                  var index = users.indexOf(user.id);
                                  if (index !== -1) {
                                    users.splice(index, 1);
                                  }
                                } else users.push(user.id);

                                setSelectedUsersId(users);
                              }}
                            />
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.first_name}</TableCell>
                          <TableCell>{user.last_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                        </TableRow>
                      );
                    })
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="error"
            disabled={selectedUsersId.length === 0}
            style={{ position: "absolute", right: 12, top: 12 }}
            onClick={assignHandler}
          >
            Assign
          </Button>
        </Box>
      </Modal>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#ID</TableCell>
              <TableCell>Test Paper</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Questions count</TableCell>
              <TableCell>Assignment count</TableCell>
              <TableCell>Assign</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests
              ? tests.results.map((test) => {
                  return (
                    <TableRow key={test.id}>
                      <TableCell>{test.id}</TableCell>
                      <TableCell>{test.title}</TableCell>
                      <TableCell>{test.time} Minutes</TableCell>
                      <TableCell>{test.question.length} Questions</TableCell>
                      <TableCell>
                        {test.assignment.length} Times Assigned
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setShowModal(true);
                            setSelectedTest(test);
                          }}
                          variant="contained"
                        >
                          Assign
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

export default Tests;
