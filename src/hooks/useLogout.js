import axios from "../app/api/axios";
import useAuth from "./useAuth";
import AuthContext from "../context/authProvider";
import { useContext } from "react";

const useLogout = () => {
  const { setAuth } = useAuth();
  const { setIsRotated, isRotated } = useContext(AuthContext);

  const logout = async () => {
    setAuth({});
    // setIsRotated(false);
    localStorage.removeItem("GroceryUserId");
    localStorage.removeItem("grocMemTransaction");
    localStorage.removeItem("groceryTransactions");
    localStorage.removeItem("grocTransId");
    localStorage.removeItem("persistence");
    console.log(isRotated);
    try {
      const response = await axios.get("/grocery-auth/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return logout;
};

export default useLogout;
