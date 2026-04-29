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
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserSettings = () => {
  const [username, setUsername] = useState("");
  const [isPassword3, setisPassword3] = useState("password");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState("");
  const { auth, users, getUsers } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const userId = localStorage.getItem("AdminUserId");
  const [passwordCheck3, setPasswordCheck3] = useState(faEyeSlash);
  const [roles, setRoles] = useState(Object.keys(""));
  const saveRef = useRef(null);
  const pwdRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();
  const getAUser = async () => {
    console.log(userId);
    try {
      console.log(users.data);
      dispatch({ type: "users", payload: users.data });
      const currentUser = auth.users.find((user) => user._id === userId);

      if (currentUser) {
        console.log(currentUser);
        setUsername(currentUser.username);
        // setPassword(currentUser.password);
        setRoles(Object.keys(currentUser.roles));
        setActive(currentUser.active);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const assertain = (e) => {
    e.preventDefault();
    dispatch({ type: "VERIFY", payload: true });
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
    const response = await axiosPrivate.delete(
      `/groceryUsers/delete/${userId}`,
    );
    if (response) {
      navigate("/admin");
    }
  };

  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part
    // of the
    // page is touched.
    if (state.verify) {
      dispatch({ type: "VERIFY", payload: false });
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

  const onActiveChanged = () => {
    setActive((prev) => !prev);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      console.log("break is over");
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
      console.log("break time");
      const currentRole = userChange.pop();
      const updatedPerson = {
        username: username,
        roles: currentRole,
        password: password ? password : "",
        active,
      };
      console.log(updatedPerson);
      const response = await axiosPrivate.patch(
        `/groceryUsers/update/${userId}`,
        updatedPerson,
      );
      if (response) {
        dispatch({ type: "success", payload: true });
        dispatch({ type: "ALERTMSG", payload: response.data });
        setTimeout(() => {
          dispatch({ type: "success", payload: false });
        }, 3000);
      }
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
        <div className="usersetting-password">
          <input
            type={isPassword3}
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="show-hide-password">
            <FontAwesomeIcon icon={passwordCheck3} onClick={showPassword} />
          </span>
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
      <div className={state.verify ? "delete" : "no-delete"}>
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
      <div
        style={{
          display: state.success ? "block" : "none",
          position: "fixed",
          margin: "1rem 0",
          top: "40%",
          left: "30%",
          width: "40%",
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "lightpink",
          borderRadius: "5px",
          fontSize: "1.5rem",
          opacity: ".85",
        }}
      >
        <h4>{state.alertMsg}</h4>
      </div>
    </div>
  );
};

export default UserSettings;
