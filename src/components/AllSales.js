import { useContext, useReducer, useState, useEffect } from "react";
import ItemContext from "../context/itemProvider";
import AuthContext from "../context/authProvider";
import initialState from "../store";
import reducer from "../reducer";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AllSales = () => {
  const { currentUsers } = useContext(AuthContext);
  const { transactions, numberWithCommas } = useContext(ItemContext);
  const [transactionArray, setTransactionArray] = useState([]);
  console.log(transactions, currentUsers);
  const [state, dispatch] = useReducer(reducer, initialState);
  const axiosPrivate = useAxiosPrivate();
  const getTrans = async () => {
    try {
      // if (transactions) {
      // }
      const response = await axiosPrivate.get("/grocery-transactions");
      console.log(response.data);
      let innerArray = [];
      response.data.map((transaction) => {
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
    } catch (error) {}
  };

  useEffect(() => {
    getTrans();
  }, [state.search, state.search2]);
  return transactions.length ? (
    <div className="sales-cont">
      <h3 className="header">All Sales ({transactions.length} )</h3>
      {/* <article className="measure-select-cont">
        <button onClick={changeUnitMesure}>primary</button>
        <button onClick={changeUnitMesure}>secondary</button>
      </article> */}
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
      <table className="sales-table">
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
  ) : (
    <h3 className="loading">Loading...</h3>
  );
};

export default AllSales;
