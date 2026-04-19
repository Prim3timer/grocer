import axios from "../app/api/axios";
import useAuth from "./useAuth";
import useAxiosPrivate from "./useRefreshToken";
import AuthProvider from "../context/authProvider";
import { useContext, useEffect } from "react";

const useRefreshToken = () => {
  const { setAuth, auth } = useContext(AuthProvider);
  console.log(auth);

  const refresh = async () => {
    console.log("on refresh");
    const response = await axios.get("/grocery-refresh", {
      // this allows us to send cookies with our request
      withCredentials: true,
    });
    setAuth((prev) => {
      // console.log(JSON.stringify(prev))
      return {
        ...prev,
        accessToken: response.data.accessToken,
        roles: response.data.roles,
        user: response.data.username,
        picker: response.data.id,
        users: response.data.users,
        // refresh: response.data.refreshToken,
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
