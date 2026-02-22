import logo from "./logo.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import CreateItem from "./CreateItem";

function App() {
  const [items, setItems] = useState();
  const getItems = async () => {
    // const response = await axios.get("http://localhost:3500/grocery-items");
    // console.log(response.data);
  };

  useEffect(() => {
    getItems();
  }, []);
  return (
    <div className="App">
      <h4>Transaction</h4>
      <CreateItem />
    </div>
  );
}

export default App;
