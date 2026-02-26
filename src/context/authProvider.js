import { createContext, useState, useReducer, useEffect, useRef } from "react";
import reducer from "../reducer";
import initialState from "../store";
import axios from "../app/api/axios";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const user = {};
  const users = [];
  const auth = {};

  const [persistence, setPersistence] = useState(
    JSON.parse(localStorage.getItem("persistence")) || false,
  );
  return (
    <AuthContext.Provider
      value={{
        ...state,
        user,
        users,
        auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
