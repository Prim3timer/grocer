import initialState from "../store";
import { useEffect, useContext, useReducer, useState } from "react";
import reducer from "../reducer";
import axios, { axiosPrivate } from "../app/api/axios";
import AuthContext from "../context/authProvider";
import { Link } from "react-router-dom";
import ItemContext from "../context/itemProvider";
import { FaTrashAlt } from "react-icons/fa";

const Receipts = () => {
  const { transactions, bizName, numberWithCommas, currency } =
    useContext(ItemContext);

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

  //   console.log(state.currentTransaction);

  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part of the
    // page is touched.
    if (state.cancel) {
      dispatch({ type: "cancel", payload: false });
    }
  };

  const handleRemove = async () => {
    //   e.preventDefault()
    dispatch({ type: "cancel", payload: false });
    const response = await axios.delete(
      `/grocery-transactions/${state.currentTransaction._id}`,
    );

    if (response) {
      const newTransList = transactions.filter(
        (item) => item._id !== state.currentTransaction._id,
      );

      dispatch({ type: "transactions", payload: newTransList });
    }
  };

  return (
    <div>
      <h3>Receipts ({transactions.length})</h3>
      {transactions.map((transaction) => {
        const theDay = new Date(transaction.date).toString().substring(4, 25);
        return (
          <section key={transaction._id} className="receipt-main-cont">
            {transactions.length !== 0 ? (
              <article className="receipts">
                <h4 className="biz-name">{bizName}</h4>
                <p>{theDay}</p>
                <p>{transaction._id}</p>
                {transaction.goods.map((good) => {
                  console.log(good);
                  return (
                    <div className="goods-container" key={good._id}>
                      <h4>{good.name}</h4>
                      <p>
                        Qty: {parseFloat(good.qty).toFixed(2)}{" "}
                        {good.unitMeasure.split(" ")[1].slice(1, -1)}
                      </p>
                      <p>
                        Unit Price: {currency}
                        {numberWithCommas(parseFloat(good.price).toFixed(2))}
                      </p>
                      <p>
                        Sub Total: {currency}
                        {numberWithCommas(parseFloat(good.total).toFixed(2))}
                      </p>
                    </div>
                  );
                })}
                <p>
                  card ending in: ...
                  {transaction.last4 ? transaction.last4 : ""}
                </p>
                <h4 className="receipts-grand-total">
                  Grand Total: {currency}
                  {numberWithCommas(
                    parseFloat(transaction.grandTotal).toFixed(2),
                  )}
                </h4>
                <h5>Cashier: {transaction.cashier}</h5>
                <br />
                <h3
                  onClick={(e) => assertain(transaction._id, e)}
                  style={{
                    textAlign: "center",
                  }}
                >
                  <FaTrashAlt role="button" />
                </h3>
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
  );
};

export default Receipts;
