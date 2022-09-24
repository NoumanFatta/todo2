import Routes from "./Routes";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import * as jose from "jose";
import { useEffect } from "react";
import { setUserData } from "./store/reducers/auth-slice";
import Notification from "./components/Notification";

const App = () => {
  const secret = new TextEncoder().encode("NoumanAminFatta");
  const loginStatus = useSelector((state) => state.auth);
  const { notification } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  useEffect(() => {
    const setUser = async () => {
      if (loginStatus.user) {
        const jwt = loginStatus.user;
        const { payload } = await jose.jwtVerify(jwt, secret);
        dispatch(setUserData(payload));
      }
    };
    setUser();
    // eslint-disable-next-line
  }, [loginStatus]);
  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Routes isLoggedIn={loginStatus.isLoggedIn} />
    </>
  );
};

export default App;
