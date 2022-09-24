import {
  Avatar,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Box,
} from "@mui/material";

import { LockOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { loginUser } from "../controllers/user";
import { useDispatch } from "react-redux";
import { loginReducer } from "../store/reducers/auth-slice";
import { showNotification } from "../store/reducers/ui-slice";

const Signin = () => {
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    loginUser({
      email: data.get("email"),
      password: data.get("password"),
    })
      .then((response) => {
        if (response.success) {
          dispatch(loginReducer({ token: response.token }));
        }
      })
      .catch((error) => {
        dispatch(
          showNotification({
            status: "error",
            title: error.title,
            message: error.message,
          })
        );
      });
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            type='email'
            id="email"
            name="email"
            autoFocus
            placeholder="test@test.com"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="123"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent={"flex-end"}>
            <Grid item>
              <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Signin;
