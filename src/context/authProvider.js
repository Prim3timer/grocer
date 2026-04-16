import { createContext, useState, useReducer, useEffect, useRef } from "react";
import reducer from "../reducer";
import initialState from "../store";
import axios from "../app/api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentUsers, setCurrentUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
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
      const cookieMap = {};
      const allCookies = cookieMap["jwt"];
      console.log(allCookies);
      try {
        const response = await axiosPrivate.get("/groceryUsers", {
          signal: controller.signal,
        });
        console.log(response.data.users);

        isMounted && setCurrentUsers(response.data.users);
        // setUsers(response.data.users);

        setAuth((prev) => {
          return { ...prev, users: response.data.users };
        });
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

  console.log(currentUsers);

  // const user = {};
  // const users = [];
  const [auth, setAuth] = useState();

  // useEffect(() => {
  //   getUsers();
  // }, []);

  // const [persistence, setPersistence] = useState(
  //   JSON.parse(localStorage.getItem("persistence")) || false,
  // );
  return (
    <AuthContext.Provider
      value={{
        // persistence,
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
