import { useContext, useEffect, useReducer, useState } from "react";
import initialState from "../store";
import reducer from "../reducer";
import ItemContext from "../context/itemProvider";
import { useSearchParams } from "react-router-dom";

const Sales = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { transactions } = useContext(ItemContext);
  const [transactionArray, setTransactionArray] = useState([]);
  const getTrans = () => {
    let innerArray = [];
    transactions.map((transaction) => {
      return transaction.goods.map((good) => {
        const elements = {
          name: good.name,
          qty: good.qty,
          unitMeasure: good.unitMeasure,
          total: good.total,
          date: transaction.date,
        };
        innerArray.push(elements);
        const filterate =
          innerArray &&
          innerArray.filter((inner) =>
            inner.name.toLowerCase().includes(state.search.toLowerCase()),
          );
        console.log(filterate);
        const filterate2 = filterate.filter((inner) =>
          inner.date.substring(0, 10).includes(state.search2),
        );
        setTransactionArray(filterate2);
        return innerArray;
      });
    });
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    getTrans();
  }, [state.search, state.search2]);
  return (
    <div className="sales-cont">
      <h3 className="header">Sales</h3>
      <form className="searcher" onSubmit={(e) => e.preventDefault()}>
        <input
          // id="invent-search"
          type="text"
          role="searchbox"
          placeholder="filter by name"
          value={state.search}
          onChange={(e) =>
            dispatch({ type: "search", payload: e.target.value })
          }

          // https://www.npmjs.com/package/@react-google-maps/api
        />
        {/* <p className='injunction'>AND / OR</p > */}
        <input
          //   id="invent-search"
          type="text"
          role="searchbox"
          placeholder="filter by date yyyy-mm-dd"
          value={state.search2}
          onChange={(e) =>
            dispatch({ type: "search2", payload: e.target.value })
          }

          // https://www.npmjs.com/package/@react-google-maps/api
        />
      </form>
      <table className="sales">
        <tbody>
          <tr className="theader-row">
            <th className="gen-sales-theader">NAME</th>
            <th className="gen-sales-theader">QTY</th>
            <th className="gen-sales-theader">TOTAL</th>
            <th className="gen-sales-theader">DATE</th>
          </tr>
          {transactionArray &&
            transactionArray.map((transaction, index) => {
              return (
                <tr
                  className="sales-items-cont"
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "khaki",
                  }}
                >
                  <th>{transaction.name}</th>
                  <td>
                    {transaction.qty} {transaction.unitMeasure}
                    {transaction.qty > 1 ? "s" : ""}
                  </td>
                  <th>{parseFloat(transaction.total).toFixed(2)}</th>
                  <td>
                    {" "}
                    {new Date(transaction.date).toLocaleString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="sales-total">
        <h3>Total:</h3>
        <h3>
          {numberWithCommas(
            transactionArray
              .reduce((a, b) => {
                return a + parseFloat(b.qty);
              }, 0)
              .toFixed(2),
          )}
        </h3>
        <h3>
          $
          {numberWithCommas(
            transactionArray
              .reduce((a, b) => {
                return a + parseFloat(b.total);
              }, 0)
              .toFixed(2),
          )}
        </h3>
      </div>
    </div>
  );
};

export default Sales;
