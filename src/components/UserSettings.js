import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authProvider";
import { ROLES } from "../config/roles";

const UserSettings = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState();
  const { currentUsers } = useContext(AuthContext);
  const userId = localStorage.getItem("GroceryUserId");
  const getAUser = () => {
    const currentUser = currentUsers.find((user) => user._id === userId);
    setUsername(currentUser.username);
    setPassword(currentUser.password);
  };

  const options = Object.keys(ROLES).map((role) => {
    return <option className="assigned-roles-options"> {role}</option>;
  });

  useEffect(() => {
    getAUser();
  }, []);
  return (
    <div className="usersetting">
      <h3>User Settings</h3>
      <form className="usersetting-form">
        <input
          type="text"
          className="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label
          className="form-label"
          htmlFor="user-active"
          style={{
            justifyContent: "center",
            // marginLeft: '2rem'
          }}
        >
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            // checked={active}
            // onChange={onActiveChanged}
          />
        </label>

        <div className="asinged-roles-cont">
          <label
          // style={{
          //     fontSize: '1.5rem',

          // }}
          >
            ASSINGED ROLES:
          </label>

          <select
            name="roles"
            size="3"
            multiple={true}
            //  ref={selectRef}

            // value={roles}
            // onChange={(e) => onRolesChanged(e)}
            // className="roles-select"
          >
            {options}
          </select>
        </div>
      </form>
    </div>
  );
};

export default UserSettings;
