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
  const [users, setUsers] = useState({});
  const [currentUsers, setCurrentUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [persistence, setPersistence] = useState(false);
  // const getUsers = async () => {
  //   const users = await axios.get("/groceryUsers");

  //   dispatch({ type: "users", payload: users.data });
  // };

  const userPage = (id) => {
    localStorage.setItem("GroceryUserId", id);
  };

  useEffect(() => {
    // console.log(auth)
    let isMounted = true;
    // to cancel our request if the Component unmounts
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/groceryUsers", {
          signal: controller.signal,
        });

        isMounted && setCurrentUsers(response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.error(error);

        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();
    // clean up function
    return () => {
      isMounted = false;

      controller.abort();
    };
  }, []);

  console.log(auth);
  // const user = {};
  // const users = [];

  // useEffect(() => {
  //   getUsers();
  // }, []);

  // const [persistence, setPersistence] = useState(
  //   JSON.parse(localStorage.getItem("persistence")) || false,
  // );
  return (
    <AuthContext.Provider
      value={{
        persistence,
        setPersistence,
        ...state,
        currentUsers,
        auth,
        setAuth,
        userPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
