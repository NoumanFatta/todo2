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
  clearTodos,
  createTodoReducer,
  deleteTodoReducer,
  getActiveTodosReducer,
} from "../store/reducers/todos-slice";
import { getAllGroups } from "../controllers/groups";
import { getGroupsReducer } from "../store/reducers/groups-slice";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../store/reducers/ui-slice";

const Todos = (props) => {
  const { status } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = cookie.load("user") ? cookie.load("user") : "";
  const { todos, isLoading } = useSelector((state) => state.todo);
  const { groups } = useSelector((state) => state.group);
  const savedOrder = localStorage.getItem("order");
  const [order, setOrder] = useState({ dueDate: savedOrder, priority: "1" });
  const [filteredTodos, setFilteredTodos] = useState([]);

  useEffect(() => {
    return () => {
      dispatch(clearTodos());
    };
    // eslint-disable-next-line
  }, [status]);

  const sortTodos = (action, data) => {
    const { dueDate, priority } = action;
    const newTodos = [...data];
    if (dueDate === "ascending") {
      newTodos.sort((a, b) => {
        if (a.dueDate === b.dueDate) {
          if (priority === "1") {
            return a.priority > b.priority ? -1 : 1;
          } else {
            return a.priority < b.priority ? -1 : 1;
          }
        } else {
          return a.dueDate > b.dueDate ? -1 : 1;
        }
      });
      setFilteredTodos(newTodos);
    } else {
      // newTodos.sort(descending);
      newTodos.sort((a, b) => {
        if (a.dueDate === b.dueDate) {
          if (priority === "1") {
            return a.priority > b.priority ? -1 : 1;
          } else {
            return a.priority < b.priority ? -1 : 1;
          }
        } else {
          return a.dueDate < b.dueDate ? -1 : 1;
        }
      });
      setFilteredTodos(newTodos);
    }
  };

  useEffect(() => {
    setFilteredTodos(todos);
    sortTodos(order, todos);
    // eslint-disable-next-line
  }, [todos]);

  useEffect(() => {
    if (filteredTodos.length) {
      sortTodos(order, filteredTodos);
    }
    // eslint-disable-next-line
  }, [order]);

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
      dueDate: data.get("due-date"),
      priority: data.get("priority"),
    })
      .then((response) => {
        dispatch(createTodoReducer(response.data));
        dispatch(
          showNotification({
            status: "success",
            title: "Successfull",
            message: "Todo successfully created",
          })
        );
        setOpen(false);
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

  const statusHandler = async (todo) => {
    const sendStatus = status === "active" ? "completed" : "active";
    changeStatus(token, todo.id, sendStatus).then((response) => {
      if (response.success) {
        dispatch(
          showNotification({
            status: "success",
            title: "Success",
            message: "Status has been changed",
          })
        );
        dispatch(getActiveTodosReducer(response.todos));
      }
    });
  };
  const deleteHandler = async (id) => {
    deleleTodo(token, id)
      .then((response) => {
        dispatch(deleteTodoReducer(response.todo));
        dispatch(
          showNotification({
            status: "success",
            title: "Success",
            message: "Todo has been deleted",
          })
        );
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
  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };
  const filterHandler = (event, key) => {
    const { value } = event.target;
    if (key === "group") {
      if (value === "all") {
        setFilteredTodos(todos);
        sortTodos(order, todos);
      } else {
        const newTodos = todos.filter((todo) => todo.group === value);
        setFilteredTodos(newTodos);
        sortTodos(order, newTodos);
      }
    }
  };
  return (
    <Card sx={{ padding: 5 }}>
      <Grid
        container
        alignItems="center"
        marginBottom={2}
        justifyContent="space-between"
      >
        <Grid
          sx={{
            textAlign: {
              xs: "center",
              sm: "start",
            },
          }}
          item
          xs={12}
          sm={6}
          md={6}
        >
          <Typography textTransform="capitalize" variant="h4">
            {status} Todos
          </Typography>
        </Grid>
        {status === "active" && (
          <Grid item xs={12} sm={4} md={4}>
            <Box
              display="flex"
              sx={{
                marginTop: {
                  xs: 1,
                },
                justifyContent: {
                  xs: "center",
                  sm: "flex-end",
                },
              }}
            >
              <Button
                onClick={() => setOpen(true)}
                disabled={groups.length ? false : true}
                variant="contained"
              >
                Create Todo
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Typography textTransform="capitalize" variant="h6">
                Sort By Due Date:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Select
                  onChange={(e) => {
                    localStorage.setItem("order", e.target.value);
                    setOrder((pre) => ({ ...pre, dueDate: e.target.value }));
                  }}
                  value={order.dueDate}
                >
                  <MenuItem value="ascending">Ascending</MenuItem>
                  <MenuItem value="descending">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Typography textTransform="capitalize" variant="h6">
                Sort By Priority:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Select
                  defaultValue="1"
                  onChange={(e) => {
                    setOrder((pre) => ({ ...pre, priority: e.target.value }));
                  }}
                >
                  <MenuItem value="1">High</MenuItem>
                  <MenuItem value="0">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Typography textTransform="capitalize" variant="h6">
                Groups:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Select
                  onChange={(e) => filterHandler(e, "group")}
                  defaultValue="all"
                >
                  <MenuItem value="all">All</MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.name}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid className="active-todo-list" container spacing={2} rowGap={5}>
        {isLoading ? (
          <Grid item xs={12}>
            <Typography variant="h5">Loading..</Typography>
          </Grid>
        ) : filteredTodos.length !== 0 ? (
          filteredTodos.map((todo) => (
            <Grid key={todo.id} item xs={12} sm={6} md={6} lg={4}>
              <Card
                sx={{
                  paddingX: 2,
                  paddingY: 1,
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <IconButton
                  onClick={() => deleteHandler(todo.id)}
                  className="delete-icon"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
                <Typography variant="h4">{todo.title}</Typography>
                <Typography paddingY={2} paddingX={1}>
                  {todo.description}
                </Typography>
                <Typography marginBottom={1}>
                  <b>Group: </b> {todo.group}
                </Typography>
                <Typography marginBottom={1}>
                  <b>Priority: </b> {todo.priority === "1" ? "High" : "Low"}
                </Typography>
                <Typography>
                  <b>Due Date: </b> {todo.dueDate}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    flex: "1",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "row",
                      },
                      rowGap: 2,
                    }}
                    paddingTop={1}
                  >
                    <Button
                      onClick={() => statusHandler(todo)}
                      variant="outlined"
                      endIcon={
                        status === "active" ? <DoneIcon /> : <CloseIcon />
                      }
                    >
                      {status === "active" ? "Mark as Done" : "Mark as Active"}
                    </Button>
                    {status === "active" && (
                      <Button
                        variant="contained"
                        onClick={() => editTodo(todo)}
                      >
                        Edit Todo
                      </Button>
                    )}
                  </Box>
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

            <TextField
              margin="normal"
              type="date"
              required
              fullWidth
              name="due-date"
              ref={(node) => {
                if (node) {
                  const input = node.querySelector("input");
                  input.setAttribute("min", disablePastDate());
                }
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Select Priority</InputLabel>
              <Select
                required
                name="priority"
                defaultValue=""
                label="Select Priority"
              >
                <MenuItem value={1}>High</MenuItem>
                <MenuItem value={0}>Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Select Group</InputLabel>
              <Select
                required
                name="group"
                defaultValue=""
                label="Select group"
              >
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
