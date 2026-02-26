import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  HashRouter as BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  HashRouter,
} from "react-router-dom";
import { ItemProvider } from "./context/itemProvider";
import { AuthProvider } from "./context/authProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ItemProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ItemProvider>
    </AuthProvider>
  </BrowserRouter>,
);
