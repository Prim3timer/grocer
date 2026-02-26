import { useContext, useDebugValue } from "react";

import AuthContext from "../context/authProvider";

const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth?.user ? "loggin in " : "logged out"));
  return useContext(AuthContext);
};

export default useAuth;
