import { createContext, useEffect, useReducer, useState } from "react";
import axios from "../app/api/axios";
import initialState from "../store";
import reducer from "../reducer";
import Transactions from "../components/Transactions";

const ItemContext = createContext({});
const currency = "$";
export const ItemProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const picUrl = process.env.REACT_APP_URL;
  const [items, setItems] = useState();
  const bizName = "Mawuhi Mart";
  const getItems = async () => {
    try {
      const response = await axios.get(`/grocery-items`);
      if (response.data) setItems(response.data);
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
  };

  const getTransactions = async () => {
    try {
      const response = await axios.get("/grocery-transactions");
      if (response) {
        const straightTransactions = response.data.reverse();
        dispatch({ type: "transactions", payload: straightTransactions });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const oneItem = (id) => {
    localStorage.setItem("itemId", id);
    console.log(id);
    // localStorage.setItem("memUser", auth.picker);
  };

  useEffect(() => {
    getItems();
  }, []);
  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <ItemContext.Provider
      value={{
        items,
        picUrl,
        numberWithCommas,
        currency,
        bizName,
        getTransactions,
        oneItem,
        getItems,
        ...state,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export default ItemContext;
