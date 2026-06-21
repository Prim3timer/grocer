import { useContext } from "react";
import ItemContext from "../context/itemProvider";
import AuthContext from "../context/authProvider";
import Transactions from "./Transactions";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { useReducer } from "react";
import reducer from "../reducer";
import initialState from "../store";
import axios from "../app/api/axios";

const AllReceipts = () => {
  const { items, transactions, bizName, currency, numberWithCommas } =
    useContext(ItemContext);
  const { currentUsers } = useContext(AuthContext);
  const userId = localStorage.getItem("AdminUserId");
  const myTrans = transactions.filter(
    (transaction) => transaction.cashierID === userId,
  );

  const [state, dispatch] = useReducer(reducer, initialState);
  const currentSelect = currentUsers.find(
    (currentUser) => currentUser._id === userId,
  );
  console.log(myTrans);
  console.log(currentUsers);

  const assertain = (id) => {
    dispatch({ type: "cancel", payload: true });
    const trans = transactions.find((item) => item._id === id);
    dispatch({ type: "currentTransaction", payload: trans });
  };

  const oneShow = (id) => {
    localStorage.setItem("groceryTransactions", id);
    // auth.picker2 = id;
    // console.log(auth);
  };

  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part of the
    // page is touched.
    if (state.cancel) {
      dispatch({ type: "cancel", payload: false });
    }
  };

  const handleRemove = async () => {
    //   e.preventDefault()
    console.log(state.currentTransaction);
    try {
      dispatch({ type: "cancel", payload: false });
      const response = await axios.delete(
        `/grocery-transactions/${state.currentTransaction._id}`,
      );

      if (response) {
        const newTransList = transactions.filter(
          (item) => item._id !== state.currentTransaction._id,
        );
        console.log(newTransList);
        dispatch({ type: "transactions", payload: newTransList });
        // setTransactions(newTransList);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return transactions.length ? (
    <div>
      <h3>All Receipts ({transactions.length})</h3>
      {transactions.map((transaction) => {
        const theDay = new Date(transaction.date).toString().substring(4, 25);
        return (
          <section key={transaction._id} className="receipt-main-cont">
            {transactions.length !== 0 ? (
              <article className="receipts">
                <Link
                  to="/one-receipt"
                  style={{
                    textDecoration: "none",
                  }}
                  onClick={() => oneShow(transaction._id)}
                >
                  <br />
                  <h4 className="biz-name">{bizName}</h4>
                  <section className="date-and-id">
                    <p>{theDay}</p>
                    {/* <p>{transaction._id}</p> */}
                  </section>
                  <article className="items-header">
                    <h4>item</h4>
                    <h4>qty</h4>
                    <h4>cost</h4>
                  </article>
                  <hr />
                  <div className="good-outer">
                    {transaction.goods.map((good) => {
                      return (
                        <div className="goods-container" key={good._id}>
                          {/* <h4>{good._id}</h4> */}
                          <h4>{good.name}</h4>
                          <p>
                            {parseFloat(good.qty).toFixed(2)} {good.unitMeasure}
                            {good.qty > 1 ? "s" : ""}
                          </p>
                          {/* <p>
                            {currency}
                            {numberWithCommas(
                              parseFloat(good.price).toFixed(2),
                            )}
                          </p> */}
                          <p>
                            {currency}
                            {numberWithCommas(
                              parseFloat(good.total).toFixed(2),
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {transaction.last4 ? (
                    <div>
                      <hr className="horizontal" />
                      <p>card ending in....{transaction.last4}</p>
                    </div>
                  ) : transaction.cashPaid ? (
                    <div>
                      <p>
                        <hr className="horizontal" />
                        cash paid: {currency}
                        {transaction.cashPaid}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  <hr className="horizontal" />
                  <section className="total-elements">
                    <h4 className="receipts-grand-total">Grand Total:</h4>{" "}
                    <h4>
                      {currency}
                      {numberWithCommas(
                        parseFloat(transaction.grandTotal).toFixed(2),
                      )}
                    </h4>
                  </section>
                </Link>
                <h5>Cashier: {transaction.cashier}</h5>
              </article>
            ) : (
              <p>"empty list"</p>
            )}
          </section>
        );
      })}
      <div className={state.cancel ? "delete" : "no-delete"}>
        <h3
          id="verify-header"
          style={{
            margin: ".5rem auto",
            //   display: 'flex',
          }}
        >
          Delete from Receipts
        </h3>
        <article className="delete-buttons">
          <button onClick={remainDelete}>No</button>
          <button
            onClick={handleRemove}
            style={{ backgroundColor: "red", borderColor: "red" }}
          >
            Yes
          </button>
        </article>
      </div>
    </div>
  ) : (
    <h3 className="loading">Loading...</h3>
  );
};

export default AllReceipts;
