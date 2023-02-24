import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AxiosClient from "../../utils/AxiosClient";
import { showError } from "../../utils/Error";

const Difficulties = () => {
  const [difficulties, setDifficulties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [difficulty, setDifficulty] = useState("");

  const getDifficulties = async () => {
    try {
      const difficulties = await AxiosClient.get("exam/difficulties/");
      setDifficulties(difficulties.data);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  useEffect(() => {
    getDifficulties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosClient.post("exam/difficulties/", {
        title: difficulty,
      });
      getDifficulties();
      setShowModal(false);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <Box>
      <Typography variant="h5">Difficulty Levels</Typography>
      <Button
        onClick={() => {
          setShowModal(true);
          setDifficulty("");
        }}
        variant="contained"
        color="success"
        style={{ position: "absolute", right: 50, top: 4 }}
      >
        Add New
      </Button>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={style}>
          <Typography variant="h6">Add Difficulty Level</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              fullWidth
            />
            <Button variant="contained" type="submit" style={{ marginTop: 20 }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {difficulties.map((language) => {
              return (
                <TableRow key={language.id}>
                  <TableCell>{language.title}</TableCell>
                  <TableCell>{language.slug}</TableCell>
                  <TableCell>
                    <form>
                      <Button color="error" type="submit" disabled>
                        Delete
                      </Button>
                    </form>
                    <Button disabled color="primary">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Difficulties;
