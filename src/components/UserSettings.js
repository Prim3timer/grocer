import { useContext, useEffect, useState, useRef, useReducer } from "react";
import AuthContext from "../context/authProvider";
import { ROLES } from "../config/roles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import initialState from "../store";
import reducer from "../reducer";
import { useNavigate } from "react-router-dom";
import axios from "../app/api/axios";

import {
  faTrash,
  faCheck,
  faTimes,
  faInfoCircle,
  faEyeSlash,
  faEye,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { axiosPrivate } from "../app/api/axios";

const UserSettings = () => {
  const [username, setUsername] = useState("");
  const [isPassword3, setisPassword3] = useState("password");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState("");
  const { auth } = useContext(AuthContext);
  const userId = localStorage.getItem("GroceryUserId");
  const [passwordCheck3, setPasswordCheck3] = useState(faEyeSlash);
  const [roles, setRoles] = useState(Object.keys(""));
  const saveRef = useRef(null);
  const pwdRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();
  const getAUser = async () => {
    try {
      const response = await axiosPrivate.get("/groceryUsers");
      const currentUser = response.data.users.find(
        (user) => user._id === userId,
      );
      console.log(currentUser);
      if (currentUser) {
        setUsername(currentUser.username);
        setPassword(currentUser.password);
        setRoles(Object.keys(currentUser.roles));
        setActive(currentUser.active);
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

  console.log(options);

  const showPassword = () => {
    if (isPassword3 === "password") {
      setisPassword3("text");
      setPasswordCheck3(faEye);
    } else {
      setisPassword3("password");
      setPasswordCheck3(faEyeSlash);
    }
  };

  const handleRemove = async () => {
    console.log(auth.picker3);
    const response = await axiosPrivate.delete(
      `/users/delete/${currentUser._id}`,
    );
    dispatch({ type: "cancel", payload: false });
    dispatch({ type: "success", payload: true });
    navigate("/admin");
    console.log(state.success);
    setTimeout(() => {
      dispatch({ type: "success", payload: false });
    }, 3000);
    if (response) {
      dispatch({ type: "selectUser", payload: response.data });

      // const newGraw =  users.filter((item)=> item._id !== auth.picker3)

      // setUsers(newGraw)
    } else {
      console.log("nothing for you");
    }
  };

  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part
    // of the
    // page is touched.
    if (state.cancel) {
      dispatch({ type: "cancel", payload: false });
    }
  };

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    if (!values.includes("Employee")) {
      return;
    }
    if (values.length > 1 && !values.includes("Manager")) {
      return;
    } else {
      setRoles(values);
    }
  };

  const assertain = () => {
    dispatch({ type: "cancel", payload: true });
  };

  const onActiveChanged = () => {
    setActive((prev) => !prev);
  };

  const updateUser = (e) => {
    e.preventDefault();
    try {
      const newRoles = {
        Employee: 2001,
      };
      let newest = {};
      const userChange = roles.map((role) => {
        if (role === "Manager") newest = { ...newRoles, Manager: 1984 };
        else if (role === "Admin") {
          newest = { ...newRoles, Manager: 1984, Admin: 5150 };
        } else newest = newRoles;
        return newest;
      });
      const currentRole = userChange.pop();
      const updatedPerson = {
        username: username,
        roles: currentRole,
        password,
        active,
      };
    } catch (error) {}
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
            checked={active}
            onChange={onActiveChanged}
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
            // ref={selectRef}
            value={roles}
            onChange={(e) => onRolesChanged(e)}
            className="roles-select"
          >
            {options}
          </select>
        </div>
        <article className="usersetting-actions">
          <button
            onClick={(e) => updateUser(e)}
            className="user-action"
            ref={saveRef}
            //   className={'icon-button'}
            title="Save"
          >
            <FontAwesomeIcon icon={faSave} />
          </button>
          <button className="user-action">
            <FontAwesomeIcon
              icon={faTrash}
              onClick={assertain}
              tableindex="0"
            />{" "}
          </button>
        </article>
      </form>
      <div className={state.cancel ? "delete" : "no-delete"}>
        <h3
          id="verify-header"
          style={{
            margin: ".5rem auto",
            //   display: 'flex',
          }}
        >
          {" "}
          Delete {username && username} from users
        </h3>
        <article
          style={{
            display: "flex",
            //  flexDirection: 'row',
            columnGap: "4vw",
            justifyContent: "center",
          }}
        >
          <button onClick={remainDelete}>No</button>
          <button
            onClick={handleRemove}
            style={{
              backgroundColor: "red",
              borderColor: "red",
            }}
          >
            Yes
          </button>
        </article>
      </div>
    </div>
  );
};

export default UserSettings;
