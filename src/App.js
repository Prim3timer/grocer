import logo from "./logo.svg";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import CreateItem from "./components/CreateItem";
import ItemList from "./components/ItemList";
import Navbar from "./components/Navbar";
import Transactions from "./components/Transactions";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="transactions" element={<Transactions />} />
        <Route path="create-item" element={<CreateItem />} />
        <Route path="item-list" element={<ItemList />} />
      </Routes>
    </div>
  );
}

export default App;
