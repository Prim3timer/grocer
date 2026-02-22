import { createContext, useEffect, useState } from "react";
import axios from "axios";

const ItemContext = createContext({});

export const ItemProvider = ({ children }) => {
  const picUrl = "http://localhost:3500";
  const [items, setItems] = useState();
  const getItems = async () => {
    const response = await axios.get("http://localhost:3500/grocery-items");
    console.log(response.data);
    if (response.data) setItems(response.data);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <ItemContext.Provider
      value={{
        items,
        picUrl,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export default ItemContext;
