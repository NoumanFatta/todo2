import React, { createRef, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
const EditTodo = () => {
  const todoId = useParams();
  const token = cookie.load("user") ? cookie.load("user") : "";
  const refs = ["title", "description"];
  const elementsRef = useRef(refs.map(() => createRef()));
  const { singleTodo } = useSelector((state) => state.todo);
  const { groups } = useSelector((state) => state.group);
  const dispatch = useDispatch();
  const [groupValue, setGroupValue] = useState("");
  useEffect(() => {
    getAllGroups(token).then((groups) => {
      dispatch(getGroupsReducer(groups));
    });
    getTodoById(token, todoId.id).then((response) => {
      dispatch(getTodoByIdReducer(response));
    });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (singleTodo.group) {
      elementsRef.current.map((ref, ind) => {
        return ref.current.value = singleTodo[refs[ind]];
      });
      setGroupValue(singleTodo.group);
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
    }).then((response) => {
      if (response.success) {
        dispatch(updateTodo(response));
        alert("todo has been updated");
      }
    });
  };
  const groupHandler = (e) => {
    const { value } = e.target;
    setGroupValue(value);
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
          <FormControl fullWidth>
            <InputLabel>Select Group</InputLabel>
            <Select
              name="group"
              value={groupValue}
              label="Select group"
              onChange={groupHandler}
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
