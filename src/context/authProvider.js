import { createContext, useState, useReducer, useEffect, useRef } from "react";
import reducer from "../reducer";
import initialState from "../store";
import axios from "../app/api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [auth, setAuth] = useState({});
  const [users, setUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  // const [persistence, setPersistence] = useState(false);
  const [persistence, setPersistence] = useState(
    JSON.parse(localStorage.getItem("persistence")) || false,
  );
  const getUsers = async () => {
    try {
      const users = await axios.get("/uniqueRequest");
      setUsers(users.data.users);
      setCurrentUsers(users.data.users);

      dispatch({ type: "users", payload: users.data });
    } catch (error) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  const userPage = (id) => {
    localStorage.setItem("AdminUserId", id);
  };

  // useEffect(() => {
  //   console.log(users);
  //   getUsers();
  // }, []);
  return (
    <AuthContext.Provider
      value={{
        persistence,
        setPersistence,
        ...state,
        currentUsers,
        setCurrentUsers,
        auth,
        setAuth,
        userPage,
        users,
        getUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
