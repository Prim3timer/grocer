import logo from "./logo.svg";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import CreateItem from "./components/CreateItem";
import ItemList from "./components/ItemList";
import Navbar from "./components/Navbar";
import Transactions from "./components/Transactions";
import Sales from "./components/Sales";
import Inventory from "./components/Inventory";
import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout";

function App() {
  const year = new Date().getFullYear();
  return (
    <main className="App">
      <Navbar />
      <div className="grower">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" index element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="transactions" element={<Transactions />} />
            <Route path="create-item" element={<CreateItem />} />
            <Route path="item-list" element={<ItemList />} />
            <Route path="sales" element={<Sales />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>
        </Routes>
      </div>
      <p className="footer">&copy; {year} Amalu Productions.</p>
    </main>
  );
}

export default App;
