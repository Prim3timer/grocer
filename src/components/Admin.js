import { useContext } from "react";
import Users from "./Users";
import AuthContext from "../context/authProvider";

const Admin = () => {
  const { currentUsers } = useContext(AuthContext);
  console.log(currentUsers);
  return currentUsers?.length ? (
    <div className="admin">
      <h4>Admin</h4>
      <article className="gen-admin">
        <button>All Sales</button>
        <button>All Receipts</button>
      </article>
      <Users />
    </div>
  ) : (
    <h3 className="loading">loading...</h3>
  );
};

export default Admin;
