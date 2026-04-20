import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/authProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../app/api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPenSquare } from "react-icons/fa";
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import {
  Link,
  useNavigate,
  useLocation,
  useLoaderData,
} from "react-router-dom";
const Users = () => {
  const { users, userPage, auth, setAuth, currentUsers } =
    useContext(AuthContext);
  // const [currentUsers, setCurrentUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(auth);

  const setId = (id) => {
    const userId = localStorage.setItem("AdminUserId", id);
  };
  return (
    <div className="users">
      <h3>Users</h3>
      <table className="users-table">
        <tbody>
          <tr className="user-table-header-row">
            <th>Activity</th>
            <th>Roles</th>
            <th>Settings</th>
          </tr>
          {currentUsers &&
            currentUsers.map((user, index) => {
              return (
                <tr
                  key={user._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "powderblue",
                  }}
                >
                  <Link to="/user-select">
                    <th onClick={() => setId(user._id)}>{user.username}</th>
                  </Link>
                  <td>{Object.keys(user.roles).join(", ")}</td>
                  <td>
                    <Link
                      to={"/user-settings"}
                      onClick={() => userPage(user._id)}
                    >
                      <FontAwesomeIcon icon={faPenSquare} />
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
