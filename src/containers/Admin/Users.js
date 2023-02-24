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

const Users = () => {
  const [users, setUsers] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useImmer({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const getUsers = async () => {
    try {
      const users = await AxiosClient.get(`base/users/`);
      setUsers(users.data);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const user = await AxiosClient.post(`base/users/`, {
        username: e.target.username.value,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });
      setShowModal(false);
      getUsers();
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
      <Button
        variant="contained"
        color="success"
        style={{ position: "absolute", right: 50, top: 4 }}
        onClick={() => setShowModal(true)}
      >
        Add New
      </Button>
      <Typography variant="h5">Test Papers</Typography>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={style}>
          <Typography variant="h6" style={{ marginBottom: 12 }}>
            Add User
          </Typography>
          <form onSubmit={addUser}>
            <TextField
              name="username"
              placeholder="Username"
              label="Username"
              fullWidth
              required
              style={{ marginBottom: 10 }}
            />
            <TextField
              name="email"
              placeholder="Email"
              label="Email"
              fullWidth
              required
              style={{ marginBottom: 10 }}
            />
            <TextField
              name="first_name"
              placeholder="First Name"
              label="First Name"
              fullWidth
              required
              style={{ marginBottom: 10 }}
            />
            <TextField
              name="last_name"
              placeholder="Last Name"
              label="Last Name"
              fullWidth
              required
              style={{ marginBottom: 10 }}
            />
            <TextField
              name="password"
              placeholder="Password"
              label="Password"
              fullWidth
              required
              type="password"
              style={{ marginBottom: 10 }}
            />
            <Button type="submit" variant="outlined">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Assignments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              ? users.results.map((user) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.assignments.length}</TableCell>
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

export default Users;
