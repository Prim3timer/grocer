import { useRef, useState, useEffect, useReducer, useContext } from "react";
import AuthContext from "../context/authProvider";
// import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import useRefreshToken from "../hooks/useRefreshToken";
import initialState from "../store";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../app/api/axios";
import reducer from "../reducer";

const LOGIN_URL = "/grocery-auth";

const Login = () => {
  const { auth, persistence, setPersistence } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/transactions";
  const [isPassword, setisPassword] = useState("password");
  const [passwordCheck2, setPasswordCheck2] = useState(faEyeSlash);
  const [isPassword2, setisPassword2] = useState("password");

  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const showPassord = () => {
    if (isPassword === "password") {
      setisPassword("text");
      setPasswordCheck2(faEye);
    } else {
      setisPassword("password");
      setPasswordCheck2(faEyeSlash);
    }
  };

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const picker = response?.data?.id;

      const authObj = { user, roles, accessToken, picker };

      dispatch({ type: "auth", payload: authObj });
      setUser("");
      setPwd("");
      // get the user to where they wanted to go before they were kicked out to
      // the login page
      navigate(from, { replace: true });
    } catch (error) {}
  };

  return (
    <div>
      <h3>Login</h3>
    </div>
  );
};

export default Login;
