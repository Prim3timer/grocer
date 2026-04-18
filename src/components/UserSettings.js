import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authProvider";
import { ROLES } from "../config/roles";
import { FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { FaEyeSlash, FaEye } from "react-icons/fa";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const UserSettings = () => {
  const [username, setUsername] = useState("");
  const [isPassword3, setisPassword3] = useState("password");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState();
  const { currentUsers } = useContext(AuthContext);
  const userId = localStorage.getItem("GroceryUserId");
  const [passwordCheck3, setPasswordCheck3] = useState(faEyeSlash);
  const getAUser = () => {
    try {
      const currentUser = currentUsers.find((user) => user._id === userId);
      if (currentUser) {
        setUsername(currentUser.username);
        setPassword(currentUser.password);
        console.log(currentUser.password);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const options = Object.keys(ROLES).map((role, index) => {
    return (
      <option className="assigned-roles-options" key={index}>
        {" "}
        {role}
      </option>
    );
  });

  const showPassword = () => {
    if (isPassword3 === "password") {
      setisPassword3("text");
      setPasswordCheck3(faEye);
    } else {
      setisPassword3("password");
      setPasswordCheck3(faEyeSlash);
    }
  };

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
        <div>
          <input
            type={isPassword3}
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FontAwesomeIcon icon={passwordCheck3} onClick={showPassword} />
        </div>
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
