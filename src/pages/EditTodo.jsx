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
  const [groupValue, setGroupValue] = useState("");
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
      dueDate: data.get("due-date"),
    })
      .then((response) => {
        if (response.success) {
          dispatch(updateTodo(response));
          dispatch(
            showNotification({
              status: "success",
              title: 'Successfull',
              message: 'Todo has been updated',
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
  const groupHandler = (e) => {
    const { value } = e.target;
    setGroupValue(value);
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
          <div
            className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
            min="2022-09-25"
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-md26zr-MuiInputBase-root-MuiOutlinedInput-root">
              <input
                aria-invalid="false"
                id="date"
                name="due-date"
                required={true}
                type="date"
                min={disablePastDate()}
                ref={elementsRef.current[2]}
                className="MuiInputBase-input MuiOutlinedInput-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input"
              />
              <fieldset
                aria-hidden="true"
                className="MuiOutlinedInput-notchedOutline css-1d3z3hw-MuiOutlinedInput-notchedOutline"
              >
                <legend className="css-ihdtdm">
                  <span className="notranslate"></span>
                </legend>
              </fieldset>
            </div>
          </div>
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
