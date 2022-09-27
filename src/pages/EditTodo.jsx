import React, { createRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editTodo, getTodoById } from "../controllers/todos";
import cookie from "react-cookies";
import { useDispatch, useSelector } from "react-redux";
import { getTodoByIdReducer, updateTodo } from "../store/reducers/todos-slice";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { getGroupsReducer } from "../store/reducers/groups-slice";
import { getAllGroups } from "../controllers/groups";
import { showNotification } from "../store/reducers/ui-slice";
const EditTodo = () => {
  const todoId = useParams();
  const token = cookie.load("user") ? cookie.load("user") : "";
  const navigate = useNavigate();
  const refs = ["title", "description", "dueDate"];
  const elementsRef = useRef(refs.map(() => createRef()));
  const { singleTodo } = useSelector((state) => state.todo);
  const { groups } = useSelector((state) => state.group);
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    group: "",
    priority: "",
  });
  useEffect(() => {
    getAllGroups(token).then((groups) => {
      dispatch(getGroupsReducer(groups));
    });
    getTodoById(token, todoId.id).then((response) => {
      if (response) {
        dispatch(getTodoByIdReducer(response));
      } else {
        navigate(-1);
      }
    });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (singleTodo.group) {
      elementsRef.current.map((ref, ind) => {
        return (ref.current.value = singleTodo[refs[ind]]);
      });
      setValues((pre) => ({
        ...pre,
        group: singleTodo.group,
        priority: singleTodo.priority,
      }));
    }
    // eslint-disable-next-line
  }, [singleTodo]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    editTodo(token, todoId.id, {
      title: data.get("title"),
      description: data.get("description"),
      group: data.get("group"),
      dueDate: data.get("due-date"),
      priority: data.get("priority"),
    })
      .then((response) => {
        if (response.success) {
          dispatch(updateTodo(response));
          dispatch(
            showNotification({
              status: "success",
              title: "Successfull",
              message: "Todo has been updated",
            })
          );
        }
      })
      .catch((err) => {
        dispatch(
          showNotification({
            status: "error",
            title: err.title,
            message: err.message,
          })
        );
      });
  };
  const valuesHandler = (e, key) => {
    const { value } = e.target;
    setValues((pre) => ({ ...pre, [key]: value }));
  };
  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Edit Todo
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="title"
            inputRef={elementsRef.current[0]}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            inputRef={elementsRef.current[1]}
          />
          <TextField
            margin="normal"
            type="date"
            required
            inputRef={elementsRef.current[2]}
            fullWidth
            name="due-date"
            ref={(node) => {
              if (node) {
                const input = node.querySelector("input");
                input.setAttribute("min", disablePastDate());
              }
            }}
          />
          <FormControl sx={{ marginBottom: 2 }} fullWidth>
            <InputLabel>Select Priority</InputLabel>
            <Select
              onChange={(e) => valuesHandler(e, "priority")}
              required
              name="priority"
              value={values.priority}
              label="Select Priority"
            >
              <MenuItem value={1}>High</MenuItem>
              <MenuItem value={0}>Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Select Group</InputLabel>
            <Select
              name="group"
              value={values.group}
              label="Select group"
              onChange={(e) => valuesHandler(e, "group")}
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditTodo;
