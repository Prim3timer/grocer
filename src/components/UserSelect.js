import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/authProvider";

const UserSelect = () => {
  const { currentUsers } = useContext(AuthContext);
  const userId = localStorage.getItem("AdminUserId");

  const currentSelect = currentUsers.find(
    (currentUser) => currentUser._id === userId,
  );
  console.log(currentSelect);
  return currentSelect ? (
    <div>
      <h3>{currentSelect && currentSelect.username}'s activity</h3>
      <article className="user-select">
        <Link to="/admin-receipt">
          <button>Receipts</button>
        </Link>
        <Link to="/admin-sales">
          <button>Sales</button>
        </Link>
      </article>
    </div>
  ) : (
    <h3 className="loading">Loading...</h3>
  );
};

export default UserSelect;
