import { useState, useRef, useEffect, useContext, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLeftLong, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/authProvider";
// import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
// import SideBar from "./SideBar";
import multiLinks from "./multiLinks";
import initialState from "../store";
import reducer from "../reducer";
// import useWindowSize from "../hooks/useWindowSize";

const Navbar = () => {
  const { auth } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const logout = useLogout();
  console.log(auth.accessToken);
  return (
    <div className="navbar">
      {auth.accessToken ? (
        multiLinks.map((link) => {
          const { id, name, path } = link;
          return (
            <div className="paths" key={id}>
              <Link to={path} className="lining">
                {name}
              </Link>
            </div>
          );
        })
      ) : (
        <h3>RetailDaily</h3>
      )}

      {auth.user && (
        <Link to="/login" className="lining" onClick={logout}>
          logout
        </Link>
      )}
    </div>
  );
};

export default Navbar;
