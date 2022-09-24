import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Popup from "../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import {
  changeStatus,
  createTodo,
  deleleTodo,
  getActiveTodos,
} from "../controllers/todos";
import cookie from "react-cookies";
import { useDispatch, useSelector } from "react-redux";
import {
  createTodoReducer,
  getActiveTodosReducer,
} from "../store/reducers/todos-slice";
import { getAllGroups } from "../controllers/groups";
import { getGroupsReducer } from "../store/reducers/groups-slice";
import { useNavigate } from "react-router-dom";

const Todos = (props) => {
  const { status } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = cookie.load("user") ? cookie.load("user") : "";
  const { todos, isLoading } = useSelector((state) => state.todo);
  const { groups } = useSelector((state) => state.group);
  useEffect(() => {
    getActiveTodos(token, status).then((todos) => {
      dispatch(getActiveTodosReducer(todos));
    });
    getAllGroups(token).then((groups) => {
      dispatch(getGroupsReducer(groups));
    });
    // eslint-disable-next-line
  }, [status]);

  const [open, setOpen] = useState(false);
  const editTodo = (currentTodo) => {
    navigate(`${currentTodo.id}`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createTodo(token, {
      title: data.get("title"),
      description: data.get("description"),
      group: data.get("group"),
    })
      .then((response) => {
        dispatch(createTodoReducer(response.data));
        setOpen(false);
      })
      .catch((err) => console.log(err));
  };

  const statusHandler = async (todo) => {
    const sendStatus = status === "active" ? "completed" : "active";
    changeStatus(token, todo.id, sendStatus).then((response) => {
      if (response.success) {
        dispatch(getActiveTodosReducer(response.todos));
      }
    });
  };
  const deleteHandler = async (id) => {
    deleleTodo(token, id).then((response) => {
      dispatch(getActiveTodosReducer(response.todos));
    });
  };
  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  return (
    <Card sx={{ padding: 5 }}>
      <Grid
        container
        alignItems="center"
        marginBottom={2}
        sx={{
          justifyContent: {
            md: "space-between",
          },
          flexDirection: {
            sm: "column",
            md: "row",
          },
        }}
      >
        <Grid item>
          <Typography textTransform="capitalize" variant="h4">
            {status} Todos
          </Typography>
        </Grid>
        {status === "active" && (
          <Grid item>
            <Button
              onClick={() => setOpen(true)}
              disabled={groups.length ? false : true}
              variant="contained"
            >
              Create Todo
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid className="active-todo-list" container spacing={2}>
        {isLoading ? (
          <Grid item xs={12}>
            <Typography variant="h5">Loading..</Typography>
          </Grid>
        ) : todos.length !== 0 ? (
          todos.map((todo) => (
            <Grid key={todo.id} item xs={12} sm={6} md={6} lg={4}>
              <Card sx={{ paddingX: 2, paddingY: 1, position: "relative" }}>
                <IconButton
                  onClick={() => deleteHandler(todo.id)}
                  className="delete-icon"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
                <Typography variant="h4">{todo.title}</Typography>
                <Typography variant="h6">{todo.description}</Typography>
                <Typography variant="p">
                  <strong>Group: </strong> {todo.group}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  paddingTop={1}
                >
                  <Button
                    onClick={() => statusHandler(todo)}
                    variant="outlined"
                    endIcon={status === "active" ? <DoneIcon /> : <CloseIcon />}
                  >
                    {status === "active" ? "Mark as Done" : "Mark as Active"}
                  </Button>
                  {status === "active" && (
                    <Button variant="contained" onClick={() => editTodo(todo)}>
                      Edit Todo
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h5">No todos found</Typography>
          </Grid>
        )}
      </Grid>
      {status === "active" && (
        <Popup handleClose={handleClose} fullWidth={false} open={open}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              name="title"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="description"
            />
            <div
              className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root"
              min="2022-09-25"
            >
              <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-md26zr-MuiInputBase-root-MuiOutlinedInput-root">
                <input
                  aria-invalid="false"
                  id="date"
                  name="due"
                  required=""
                  type="date"
                  min={disablePastDate()}
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
              <Select name="group" defaultValue="" label="Select group">
                {groups.length !== 0 &&
                  groups.map((group) => (
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
              Create Todo
            </Button>
          </Box>
        </Popup>
      )}
    </Card>
  );
};

export default Todos;
