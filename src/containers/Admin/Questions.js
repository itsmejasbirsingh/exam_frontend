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
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Checkbox,
} from "@mui/material";
import AxiosClient from "../../utils/AxiosClient";
import { showError } from "../../utils/Error";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [test, setTest] = useState("");
  const [time, setTime] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [showModalTestpaper, setShowModalTestpaper] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [filters, setFilters] = useImmer({
    difficulty: "",
    course: "",
    search: "",
  });
  const [form, setForm] = useImmer({
    language: "",
    difficulty: "",
    question: "",
    description: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
  });

  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleDelete = async (e, question_id) => {
    e.preventDefault();
    let isConfirmed = window.confirm(
      "Are you sure you want to delete this question & its related options."
    );

    if (!isConfirmed) return;
    try {
      await AxiosClient.delete(`exam/questions/${question_id}`);
      getQuestions();
    } catch (e) {
      alert(showError(e.response));
    }
  };

  const getLanguages = async () => {
    try {
      const languages = await AxiosClient.get(`exam/courses/`);
      setLanguages(languages.data.results);
    } catch (e) {}
  };

  const getDifficulties = async () => {
    try {
      const difficulties = await AxiosClient.get("exam/difficulties/");
      setDifficulties(difficulties.data);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  const getQuestions = async () => {
    try {
      const questions = await AxiosClient.get("exam/questions/", {
        params: {
          ...filters,
        },
      });
      setQuestions(questions.data);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    getQuestions();
  };

  useEffect(() => {
    getQuestions();
    getLanguages();
    getDifficulties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: form.question,
        description: form.description,
        course: form.language,
        difficulty: form.difficulty,
        option1: form.option1,
        option2: form.option2,
        option3: form.option3,
        option4: form.option4,
        answer: form.answer,
      };
      await AxiosClient.post("exam/questions/", data);
      getQuestions();
      setShowModal(false);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  const handleTestpaperSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: test,
        time: time,
        question: selectedQuestions,
      };
      await AxiosClient.post("exam/testpapers/", data);
      setShowModalTestpaper(false);
      setSelectedQuestions([]);
      navigate("/tests");
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
        onClick={() => setShowModalTestpaper(true)}
        disabled={selectedQuestions.length === 0}
        variant="contained"
        style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9 }}
      >
        {`Create Test (${selectedQuestions.length})`}
      </Button>

      <Modal
        open={showModalTestpaper}
        onClose={() => setShowModalTestpaper(false)}
      >
        <Box sx={style}>
          <Typography variant="h6">Create New Test</Typography>
          <form onSubmit={handleTestpaperSubmit}>
            <TextField
              label="Title"
              placeholder="Title"
              required
              value={test}
              onChange={(e) => setTest(e.target.value)}
              fullWidth
              style={{ marginTop: 16 }}
            />
            <TextField
              label="Time in minutes"
              type="number"
              required
              placeholder="Time in minutes"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              style={{ marginTop: 16 }}
            />
            <Button variant="contained" type="submit" style={{ marginTop: 20 }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={style}>
          <Typography variant="h6">Add New Question</Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth style={{ marginTop: 12 }}>
              <InputLabel>Language</InputLabel>
              <Select
                required
                value={form.language}
                label="Language"
                onChange={(e) =>
                  setForm((draft) => {
                    draft.language = e.target.value;
                  })
                }
              >
                {languages.map((language) => {
                  return (
                    <MenuItem key={language.id} value={language.id}>
                      {language.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginTop: 12 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                required
                value={form.difficulty}
                label="Difficulty"
                onChange={(e) =>
                  setForm((draft) => {
                    draft.difficulty = e.target.value;
                  })
                }
              >
                {difficulties.map((difficulty) => {
                  return (
                    <MenuItem key={difficulty.id} value={difficulty.id}>
                      {difficulty.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              style={{ marginTop: 12 }}
              placeholder="Question"
              required
              value={form.question}
              label="Question"
              onChange={(e) =>
                setForm((draft) => {
                  draft.question = e.target.value;
                })
              }
            />

            <FormControl>
              <RadioGroup
                value={form.answer}
                onChange={(e) =>
                  setForm((draft) => {
                    draft.answer = e.target.value;
                  })
                }
              >
                <FormControlLabel
                  labelPlacement="start"
                  value={form.option1}
                  control={<Radio />}
                  label={
                    <TextField
                      required
                      value={form.option1}
                      onChange={(e) =>
                        setForm((draft) => {
                          draft.option1 = e.target.value;
                        })
                      }
                      fullWidth
                      placeholder="Option 1"
                      style={{ marginTop: 12 }}
                    />
                  }
                />
                <FormControlLabel
                  labelPlacement="start"
                  value={form.option2}
                  control={<Radio />}
                  label={
                    <TextField
                      required
                      value={form.option2}
                      onChange={(e) =>
                        setForm((draft) => {
                          draft.option2 = e.target.value;
                        })
                      }
                      fullWidth
                      placeholder="Option 2"
                      style={{ marginTop: 12 }}
                    />
                  }
                />
                <FormControlLabel
                  labelPlacement="start"
                  value={form.option3}
                  control={<Radio />}
                  label={
                    <TextField
                      required
                      value={form.option3}
                      onChange={(e) =>
                        setForm((draft) => {
                          draft.option3 = e.target.value;
                        })
                      }
                      fullWidth
                      placeholder="Option 3"
                      style={{ marginTop: 12 }}
                    />
                  }
                />
                <FormControlLabel
                  labelPlacement="start"
                  value={form.option4}
                  control={<Radio />}
                  label={
                    <TextField
                      required
                      value={form.option4}
                      onChange={(e) =>
                        setForm((draft) => {
                          draft.option4 = e.target.value;
                        })
                      }
                      fullWidth
                      placeholder="Option 4"
                      style={{ marginTop: 12 }}
                    />
                  }
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              style={{ marginTop: 12 }}
              placeholder="Description"
              multiline
              rows={3}
              value={form.description}
              label="Description (Optional)"
              onChange={(e) =>
                setForm((draft) => {
                  draft.description = e.target.value;
                })
              }
            />
            <Button type="submit" variant="contained" style={{ marginTop: 12 }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
      <Typography variant="h5">Questions</Typography>

      <form onSubmit={handleFilter}>
        <TextField
          style={{ marginTop: 12, width: 300 }}
          placeholder="Search"
          value={filters.search}
          onChange={(e) =>
            setFilters((draft) => {
              draft.search = e.target.value;
            })
          }
        />
        <FormControl style={{ marginTop: 12, width: 200, marginLeft: 20 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={filters.language}
            label="Language"
            onChange={(e) =>
              setFilters((draft) => {
                draft.course = e.target.value;
              })
            }
          >
            {languages.map((language) => {
              return (
                <MenuItem key={language.id} value={language.id}>
                  {language.title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl style={{ marginTop: 12, width: 200, marginLeft: 20 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={filters.difficulty}
            label="Difficulty"
            onChange={(e) =>
              setFilters((draft) => {
                draft.difficulty = e.target.value;
              })
            }
          >
            {difficulties.map((difficulty) => {
              return (
                <MenuItem key={difficulty.id} value={difficulty.id}>
                  {difficulty.title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          style={{ marginTop: 12, marginLeft: 20 }}
        >
          Filter
        </Button>
      </form>

      <Button
        variant="contained"
        color="success"
        style={{ position: "absolute", right: 50, top: 4 }}
        onClick={() => setShowModal(true)}
      >
        Add New
      </Button>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Correct Answer</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((language) => {
              return (
                <TableRow key={language.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedQuestions.includes(language.id)}
                      onChange={() => {
                        const Ques = [...selectedQuestions];

                        if (Ques.includes(language.id)) {
                          var index = Ques.indexOf(language.id);
                          if (index !== -1) {
                            Ques.splice(index, 1);
                          }
                        } else Ques.push(language.id);

                        setSelectedQuestions(Ques);
                      }}
                    />
                    {language.title}
                    <ul>
                      {language.options.map((option) => (
                        <Typography>{option.option}</Typography>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{language.description}</TableCell>
                  <TableCell>{language.correct_answer.option}</TableCell>
                  <TableCell>{language.course.title}</TableCell>
                  <TableCell>{language.difficulty.title}</TableCell>
                  <TableCell>
                    <form onSubmit={(e) => handleDelete(e, language.id)}>
                      <Button color="error" type="submit">
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

export default Questions;
