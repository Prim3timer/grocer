import { useContext } from "react";
import AuthContext from "../context/authProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPenSquare } from "react-icons/fa";
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
const Users = () => {
  const { users, currentUsers } = useContext(AuthContext);
  console.log(currentUsers);
  return (
    <div className="users">
      <h3>Users</h3>
      <table className="users-table">
        <tbody>
          <tr>
            <th>Activity</th>
            <th>Roles</th>
            <th>Settings</th>
          </tr>
          {currentUsers.map((user, index) => {
            return (
              <tr
                key={user._id}
                style={{
                  backgroundColor: index % 2 === 0 ? "white" : "powderblue",
                }}
              >
                {console.log(user.username)}
                <th>{user.username}</th>
                <td>{Object.keys(user.roles).join(", ")}</td>
                <td>
                  <FontAwesomeIcon icon={faPenSquare} />
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
