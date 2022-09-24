import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Grid,
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
import { createGroup, getAllGroups } from "../controllers/groups";
import {
  createGroupReducer,
  getGroupsReducer,
} from "../store/reducers/groups-slice";
import { Link } from "react-router-dom";

const Groups = () => {
  const { groups, isLoading } = useSelector((state) => state.group);
  const token = cookie.load("user") ? cookie.load("user") : "";
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getAllGroups(token).then((groups) => {
      dispatch(getGroupsReducer(groups));
    });
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createGroup(token, {
      name: data.get("name"),
    }).then((groups) => dispatch(createGroupReducer(groups)));
    setOpen(false);
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
          <Button onClick={() => setOpen(true)} variant="contained">
            Create group
          </Button>
        </Grid>
      </Grid>
      <Grid className="active-todo-list" container spacing={2}>
        {isLoading ? (
          <Grid item xs={12}>
            <Typography variant="h5">Loading..</Typography>
          </Grid>
        ) : groups.length !== 0 ? (
          groups.map((group) => (
            <Grid key={group.id} item xs={12} sm={6} md={6} lg={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{group.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {group.todos.length !== 0 ? (
                      group.todos.map((todo) => (
                        <ListItem key={todo.id} disablePadding>
                          <ListItemButton
                            disabled={todo.status === "completed" ? true : false}
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
      <Popup handleClose={() => setOpen(false)} fullWidth={false} open={open}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
    </Card>
  );
};

export default Groups;
