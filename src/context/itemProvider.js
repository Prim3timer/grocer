import { createContext, useEffect, useReducer, useState } from "react";
import axios from "../app/api/axios";
import initialState from "../store";
import reducer from "../reducer";

const ItemContext = createContext({});
const currency = "$";
export const ItemProvider = ({ children }) => {
  // const [state, dispatch] = useReducer(reducer, initialState)
  const picUrl = process.env.REACT_APP_URL;
  const [items, setItems] = useState();
  const getItems = async () => {
    const response = await axios.get(`/grocery-items`);
    console.log(response.data);
    if (response.data) setItems(response.data);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    getItems();
  }, []);

  return (
    <ItemContext.Provider
      value={{
        items,
        picUrl,
        numberWithCommas,
        currency,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export default ItemContext;
