import { useContext } from "react";
import Users from "./Users";
import AuthContext from "../context/authProvider";
import { Link } from "react-router-dom";

const Admin = () => {
  const { currentUsers, users } = useContext(AuthContext);
  console.log(currentUsers, users);
  return (
    currentUsers && (
      <div className="admin">
        <h4>Admin</h4>
        <article className="gen-admin">
          <Link to="/all-sales">
            <button>All Sales</button>
          </Link>
          <Link to="/all-receipts">
            <button>All Receipts</button>
          </Link>
        </article>
        <Users />
      </div>
    )
  );
};

export default Admin;
