import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Popup from "../components/Popup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkIcon from "@mui/icons-material/Link";
import cookie from "react-cookies";
import { useDispatch, useSelector } from "react-redux";
import {
  createGroup,
  deleteGroup,
  editGroup,
  getAllGroups,
} from "../controllers/groups";
import {
  clearGroups,
  createGroupReducer,
  deleteGroupReducer,
  getGroupsReducer,
  updateGroup,
} from "../store/reducers/groups-slice";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { showNotification } from "../store/reducers/ui-slice";

const Groups = () => {
  const { groups, isLoading } = useSelector((state) => state.group);
  const [open, setOpen] = useState({ create: false, edit: false });
  const [openedGroup, setOpenedGroup] = useState({});
  const token = cookie.load("user") ? cookie.load("user") : "";
  const dispatch = useDispatch();
  useEffect(() => {
    getAllGroups(token).then((groups) => {
      dispatch(getGroupsReducer(groups));
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearGroups());
    };
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createGroup(token, {
      name: data.get("name"),
    })
      .then((groups) => {
        dispatch(createGroupReducer(groups));
        setOpen({ create: false, edit: false });
        dispatch(
          showNotification({
            status: "success",
            title: "Successfull",
            message: "Group successfully created",
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

  const handleEditSubmit = (event) => {
    event.preventDefault();
    editGroup(token, { ...openedGroup })
      .then((response) => {
        if (response.succes) {
          dispatch(updateGroup(response));
          setOpen({ create: false, edit: false });
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

  const delteHandler = (event, id) => {
    event.stopPropagation();
    deleteGroup(token, id)
      .then((respone) => {
        if (respone.success) {
          dispatch(deleteGroupReducer(respone));
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
  const editHandler = (event, group) => {
    event.stopPropagation();
    setOpenedGroup({ name: group.name, groupId: group.id });
    setOpen({ create: false, edit: true });
  };

  const closeHandler = () => {
    setOpen({ create: false, edit: false });
    setOpenedGroup({});
  };

  return (
    <Card sx={{ padding: 5 }}>
      <Grid
        container
        alignItems="center"
        marginBottom={2}
        sx={{
          justifyContent: {
            sm: "space-between",
            md: "space-between",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
            md: "row",
          },
        }}
      >
        <Grid item>
          <Typography variant="h4">Groups</Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={() => setOpen({ create: true, edit: false })}
            variant="contained"
          >
            Create group
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {isLoading ? (
          <Grid item xs={12}>
            <Typography variant="h5">Loading..</Typography>
          </Grid>
        ) : groups.length !== 0 ? (
          groups.map((group) => (
            <Grid key={group.id} item xs={12} sm={6} md={6} lg={6}>
              <Accordion>
                <AccordionSummary
                  className="accordian-relative"
                  expandIcon={<ExpandMoreIcon />}
                >
                  <IconButton
                    className="delete-icon groups"
                    onClick={(e) => delteHandler(e, group.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    className="edit-icon groups"
                    onClick={(e) => editHandler(e, group)}
                  >
                    <EditIcon />
                  </IconButton>
                  <Typography>{group.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {group.todos.length !== 0 ? (
                      group.todos.map((todo) => (
                        <ListItem key={todo.id} disablePadding>
                          <ListItemButton
                            disabled={
                              todo.status === "completed" ? true : false
                            }
                          >
                            <ListItemIcon>
                              <LinkIcon />
                            </ListItemIcon>
                            <Link to={`/todos/${todo.id}`}>
                              <ListItemText primary={todo.title} />
                            </Link>
                          </ListItemButton>
                        </ListItem>
                      ))
                    ) : (
                      <Typography>No Todo in this group</Typography>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h5">No Groups found</Typography>
          </Grid>
        )}
      </Grid>
      <Popup
        handleClose={() => setOpen({ create: false, edit: false })}
        fullWidth={false}
        open={open.create}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create group
          </Button>
        </Box>
      </Popup>
      <Popup handleClose={closeHandler} fullWidth={false} open={open.edit}>
        <Box
          component="form"
          onSubmit={handleEditSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            autoFocus
            onChange={(e) =>
              setOpenedGroup((prev) => ({ ...prev, name: e.target.value }))
            }
            value={openedGroup?.name ? openedGroup.name : ""}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Edit group
          </Button>
        </Box>
      </Popup>
    </Card>
  );
};

export default Groups;
