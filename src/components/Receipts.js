import initialState from "../store";
import { useEffect, useContext, useReducer, useState } from "react";
import reducer from "../reducer";
import axios, { axiosPrivate } from "../app/api/axios";
import AuthContext from "../context/authProvider";
import { Link } from "react-router-dom";
import ItemContext from "../context/itemProvider";
import { FaTrashAlt } from "react-icons/fa";

const Receipts = () => {
  const { bizName, numberWithCommas, currency, getTransactions } =
    useContext(ItemContext);
  const [success, setSuccess] = useState(false);
  const [transactions, setTransactions] = useState();
  const { auth } = useContext(AuthContext);
  console.log(transactions);

  const [state, dispatch] = useReducer(reducer, initialState);

  const assertain = (id) => {
    dispatch({ type: "cancel", payload: true });

    // dispatch({ type: "id", payload: id });
    const trans = transactions.find((item) => item._id === id);
    dispatch({ type: "currentTransaction", payload: trans });
    // if (auth.roles.includes(5150)) {
    // } else {
    //   dispatch({ type: "isMatched", payload: true });
    // }
  };

  const getReceipt = async () => {
    const response = await axios.get("/grocery-transactions");
    const userId = localStorage.getItem("GroceryUserId");
    console.log(userId);
    const cashierTrans = response.data.filter(
      (item) => item.cashierID === userId,
    );
    cashierTrans.reverse();
    const filterate = cashierTrans.filter((trans) =>
      trans.date.substring(0, 10).includes(state.search),
    );

    setTransactions(filterate);
  };

  useEffect(() => {
    getReceipt();
  }, [transactions?.length, state.search]);

  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part of the
    // page is touched.
    if (state.cancel) {
      dispatch({ type: "cancel", payload: false });
    }
  };

  const handleRemove = async () => {
    //   e.preventDefault()
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

        setTransactions(newTransList);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const oneShow = (id) => {
    localStorage.setItem("groceryTransactions", id);
    // auth.picker2 = id;
    // console.log(auth);
  };

  const falseSuccess = () => {
    setSuccess(false);
  };

  // useEffect(() => {
  //   getTransactions();
  // }, [  ]);

  return transactions ? (
    <div>
      <form className="searcher">
        <input
          placeholder="filter by date eg. yyyy-MM-dd"
          value={state.search}
          onChange={(e) =>
            dispatch({ type: "search", payload: e.target.value })
          }
        />
      </form>
      <h3 className="header">Receipts ({transactions?.length})</h3>
      {transactions &&
        transactions.map((transaction) => {
          const theDay = new Date(transaction.date).toLocaleString("en-us", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });
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
                    {/* <br /> */}
                    <h4 className="biz-name">{bizName}</h4>
                    <p>{theDay}</p>
                    <p>{transaction._id}</p>
                    <section className="good-outer">
                      <article className="items-header">
                        <h4>item</h4>
                        <h4>qty</h4>
                        <h4>cost</h4>
                      </article>
                      {transaction.goods.map((good) => {
                        return (
                          <div className="goods-container" key={good._id}>
                            {/* <h4>{good._id}</h4> */}
                            <p>{good.name}</p>
                            <p>
                              {parseFloat(good.qty).toFixed(2)}{" "}
                              {good.unitMeasure}
                              {good.qty > 1 ? "s" : ""}
                            </p>

                            {/* <p>
                            Unit Price: {currency}
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
                    </section>

                    <hr className="horizontal" />
                    {<p>card ending in....{transaction.last4}</p>}
                    {
                      <p>
                        cash paid: {currency}
                        {transaction.cashPaid}
                      </p>
                    }
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
                    {/* <h5>Cashier: {transaction.cashier}</h5> */}
                  </Link>
                  <h3
                    onClick={(e) => assertain(transaction._id, e)}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <FaTrashAlt role="button" />
                  </h3>
                  <br />
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
      <article className={success ? "success" : "non-success"}>
        <h3>{state.alertMsg}</h3>
        {state.alertMsg ? (
          <div>
            <h4>Receipt?</h4>
            <div className="cash-confirm">
              <button onClick={falseSuccess}>No</button>
              <button>
                <Link to="/one-receipt" className="cash-confirm-link">
                  Yes
                </Link>
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </article>
    </div>
  ) : (
    <h3 className="loading">loading...</h3>
  );
};

export default Receipts;
