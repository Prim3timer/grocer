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
    const response = await axios.get(`/grocery-items`);
    console.log(response.data);
    if (response.data) setItems(response.data);
  };

  const getTransactions = async () => {
    try {
      const response = await axios.get("/grocery-transactions");
      if (response) {
        dispatch({ type: "transactions", payload: response.data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    getItems();
  }, []);
  useEffect(() => {
    getTransactions();
  }, [state.transactions.length]);

  return (
    <ItemContext.Provider
      value={{
        items,
        picUrl,
        numberWithCommas,
        currency,
        bizName,
        ...state,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export default ItemContext;
