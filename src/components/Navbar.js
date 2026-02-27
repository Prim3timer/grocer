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
  console.log(state.auth);
  const logout = useLogout();
  return (
    <div className="navbar">
      {multiLinks.map((link) => {
        const { id, name, path } = link;
        return (
          <div className="paths" key={id}>
            {auth.accessToken && (
              <Link to={path} className="lining">
                {name}
              </Link>
            )}
          </div>
        );
      })}
      {auth.accessToken && (
        <Link to="/login" className="lining" onClick={logout}>
          logout
        </Link>
      )}
    </div>
  );
};

export default Navbar;
