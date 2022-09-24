import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, AlertTitle, Typography } from "@mui/material";
import { hideNotification } from "../store/reducers/ui-slice";

const Notification = (props) => {
  const dispatch = useDispatch();
  const { notification } = useSelector((state) => state.ui);

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
    }
    // eslint-disable-next-line
  }, [notification]);

  return (
    <Alert
      sx={{
        borderRadius: 0,
        position: "fixed",
        right: "10px",
        top: 10,
        width: "20%",
        zIndex: 1301,
      }}
      severity={props.status}
    >
      <AlertTitle sx={{ fontSize: "13px" }}>{props.title}</AlertTitle>
      <Typography sx={{ fontSize: "15px" }}>{props.message}</Typography>
    </Alert>
  );
};

export default Notification;
