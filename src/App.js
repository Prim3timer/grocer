import logo from "./logo.svg";
import { useState, useEffect, useContext } from "react";
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
import Receipts from "./components/Receipts";
import EditItem from "./components/EditItem";
import Missing from "./components/Missing";
import AuthContext from "./context/authProvider";

function App() {
  const year = new Date().getFullYear();
  const { auth } = useContext(AuthContext);
  return (
    <main className="App">
      <Navbar />
      {/* <h5 className="greetings">Welcome, {auth.user}</h5> */}
      <div className="grower">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/login" index element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="transactions" element={<Transactions />} />
            <Route path="create-item" element={<CreateItem />} />
            <Route path="item-list" element={<ItemList />} />
            <Route path="sales" element={<Sales />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="receipts" element={<Receipts />} />
            <Route path="edit-item" element={<EditItem />} />
          </Route>
          <Route path="*" element={<Missing />} />
        </Routes>
      </div>
      <p className="footer">&copy; {year} Amalu Productions.</p>
    </main>
  );
}

export default App;
