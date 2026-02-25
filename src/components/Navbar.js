import React from "react";
import multiLinks from "../multilinks";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      {multiLinks.map((link) => {
        const { id, name, path } = link;
        return (
          <div className="paths" key={id}>
            <Link to={path} className="lining">
              {name}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Navbar;
