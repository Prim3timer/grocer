import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, location, useLocation } from "react-router-dom";
import AuthContext from "../context/authProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserSelect = () => {
  const { setAuth } = useContext(AuthContext);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUsers, setCurrentUsers] = useState([]);
  const userId = localStorage.getItem("AdminUserId");
  console.log(userId);
  const [user, setUser] = useState();
  useEffect(() => {
    // console.log(auth)
    let isMounted = true;
    // to cancel our request if the Component unmounts
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/groceryUsers", {
          signal: controller.signal,
        });
        console.log(response.status);

        isMounted && setCurrentUsers(response.data.users);
        const currentSelect = response.data.users.find(
          (user) => user._id === userId,
        );
        setUser(currentSelect);

        console.log(currentUsers);

        setAuth((prev) => {
          return {
            ...prev,
            users: response.data.users,
          };
        });
      } catch (error) {
        console.error(error);

        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();
    // clean up function
    return () => {
      isMounted = false;

      controller.abort();
    };
  }, []);
  return (
    <div>
      <h3>{user && user.username}'s activity</h3>
      <article className="user-select">
        <Link to="/admin-receipt">
          <button>Receipts</button>
        </Link>
        <Link to="/admin-sales">
          <button>Sales</button>
        </Link>
      </article>
    </div>
  );
};

export default UserSelect;
