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
  TextField,
  Typography,
  Modal,
} from "@mui/material";
import AxiosClient from "../../utils/AxiosClient";
import { showError } from "../../utils/Error";

const Courses = () => {
  const [languages, setLanguages] = useState(null);
  const [language, setLanguage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [search, setSearch] = useState("");

  const getLanguages = async () => {
    try {
      const languages = await AxiosClient.get(`exam/courses/`, {
        params: {
          search: search,
        },
      });
      setLanguages(languages.data);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  useEffect(() => {
    getLanguages();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosClient.post("exam/courses/", {
        title: language,
      });
      getLanguages();
      setShowModal(false);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  const handleDelete = async (e, language_id) => {
    e.preventDefault();

    let isConfirmed = window.confirm(
      "Are you sure you want to delete this course? All related data will also be deleted."
    );

    if (!isConfirmed) return;

    try {
      await AxiosClient.delete(`exam/courses/${language_id}/`);
      getLanguages();
    } catch (e) {
      alert(showError(e.response));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await AxiosClient.patch(`exam/courses/${currentLanguage.id}/`, {
        title: language,
      });
      getLanguages();
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
      <Typography variant="h5">Courses List</Typography>
      <TextField
        name="search"
        placeholder="Search languages"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button
        onClick={() => {
          setShowModal(true);
          setCurrentLanguage(null);
        }}
        variant="contained"
        color="success"
        style={{ position: "absolute", right: 50, top: 4 }}
      >
        Add New
      </Button>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6">
            {currentLanguage ? `Edit Course` : "Add New Course"}
          </Typography>
          <form
            onSubmit={(e) => {
              if (currentLanguage) handleUpdate(e);
              else handleSubmit(e);
            }}
          >
            <TextField
              required
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              fullWidth
            />
            <Button variant="contained" type="submit" style={{ marginTop: 20 }}>
              {currentLanguage ? "Update" : "Submit"}
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
            {languages
              ? languages.results.map((language) => {
                  return (
                    <TableRow key={language.id}>
                      <TableCell>{language.title}</TableCell>
                      <TableCell>{language.slug}</TableCell>
                      <TableCell>
                        <form onSubmit={(e) => handleDelete(e, language.id)}>
                          <Button color="error" type="submit">
                            Delete
                          </Button>
                        </form>
                        <Button
                          onClick={() => {
                            setShowModal(true);
                            setCurrentLanguage(language);
                            setLanguage(language.title);
                          }}
                          color="primary"
                        >
                          Edit
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

export default Courses;
