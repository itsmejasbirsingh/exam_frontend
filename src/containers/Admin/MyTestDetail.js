import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import AxiosClient from "../../utils/AxiosClient";
import { showError } from "../../utils/Error";
import { useParams } from "react-router";
import { useImmer } from "use-immer";

const MyTestDetail = () => {
  const params = useParams();
  const [test, setTest] = useState(null);
  const [optionSelections, setOptionSelections] = useImmer({});

  const getMyTest = async () => {
    try {
      const test = await AxiosClient.get(`exam/testpapers/assign/${params.id}`);
      setTest(test.data);
    } catch (e) {
      alert(showError(e.response));
    }
  };

  const saveAnswer = async (question, answer) => {
    try {
      const test = await AxiosClient.post(
        `exam/testpapers/attempt/${params.id}`,
        {
          question,
          answer,
        }
      );
    } catch (e) {
      alert(showError(e.response));
    }
  };

  console.log(optionSelections);

  useEffect(() => {
    getMyTest();
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

  if (!test) return null;

  return (
    <Box>
      <Typography variant="h5">
        Test: {test.testpaper.title} - {test.testpaper.time} minutes
      </Typography>
      {test.testpaper.question.map((q, index) => {
        return (
          <Box key={q.id} style={{ marginTop: 20 }}>
            <FormControl>
              <FormLabel>
                Question {++index}: {q.title}
              </FormLabel>
              <RadioGroup onChange={(e) => saveAnswer(q.id, e.target.value)}>
                {q.options.map((op) => {
                  return (
                    <FormControlLabel
                      value={op.id}
                      control={<Radio />}
                      label={op.option}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          </Box>
        );
      })}
    </Box>
  );
};

export default MyTestDetail;
