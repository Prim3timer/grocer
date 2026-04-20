import { useContext, useReducer } from "react";
import ItemContext from "../context/itemProvider";
import AuthContext from "../context/authProvider";
import Transactions from "./Transactions";
import { Link } from "react-router-dom";
import initialState from "../store";
import reducer from "../reducer";

const AdminSales = () => {
  const { items, transactions, bizName, currency, numberWithCommas } =
    useContext(ItemContext);
  const userId = localStorage.getItem("AdminUserId");
  const { currentUsers } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(transactions);
  const currentSelect = currentUsers.find(
    (currentUser) => currentUser._id === userId,
  );

  const myTrans = transactions.filter(
    (transaction) => transaction.cashierID === userId,
  );
  console.log(myTrans);
  return (
    <div>
      <h3>{currentSelect.username}'s Sales</h3>
    </div>
  );
};

export default AdminSales;
