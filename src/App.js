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
import OneReceipt from "./components/OneReceipt";
import Admin from "./components/Admin";
import UserSettings from "./components/UserSettings";
import PersistLogin from "./components/PersistLogin";
import RequiredAuth from "./components/RequiredAuth";
import Unauthorized from "./components/Unauthorized";
import UserSelect from "./components/UserSelect";
import { useLocation } from "react-router-dom";
import AdminReceipt from "./components/AdminReceipt";
import AdminSales from "./components/AdminSales";
import AllReceipts from "./components/AllReceipts";
import AllSales from "./components/AllSales";

function App() {
  const year = new Date().getFullYear();
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  return (
    <main className="App">
      {console.log(auth)}
      {location.pathname !== "/one-receipt" && <Navbar />}
      {auth.accessToken && location.pathname !== "/one-receipt" ? (
        <h5 className="greetings">Welcome, {auth.user}</h5>
      ) : (
        ""
      )}
      <div className="grower">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" index element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/register" element={<Register />} />
            <Route path="one-receipt" element={<OneReceipt />} />
            {/* <Route path="transactions" element={<Transactions />} />   */}
            <Route path="item-list" element={<ItemList />} />
            <Route path="sales" element={<Sales />} />
            <Route path="all-sales" element={<AllSales />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="receipts" element={<Receipts />} />
            <Route path="all-receipts" element={<AllReceipts />} />
            <Route path="/unauthorized" element={<Unauthorized />}></Route>
            <Route path="edit-item" element={<EditItem />} />
            <Route path="create-item" element={<CreateItem />} />
            <Route path="user-select" element={<UserSelect />} />
            <Route path="admin" element={<Admin />} />
            <Route path="admin-receipt" element={<AdminReceipt />} />
            <Route path="admin-sales" element={<AdminSales />} />

            <Route element={<PersistLogin />}>
              <Route element={<RequiredAuth allowedRoles={[1984]} />}></Route>

              <Route element={<RequiredAuth allowedRoles={[5150]} />}></Route>

              <Route path="user-settings" element={<UserSettings />} />
            </Route>
          </Route>
          <Route path="*" element={<Missing />} />
        </Routes>
      </div>
      {location.pathname !== "/one-receipt" && (
        <p className="footer">&copy; {year} Amalu Productions.</p>
      )}
    </main>
  );
}

export default App;
