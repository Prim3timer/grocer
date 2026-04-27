import { use, useContext, useEffect, useReducer, useState } from "react";
import initialState from "../store";
import reducer from "../reducer";
import ItemContext from "../context/itemProvider";
import { useSearchParams } from "react-router-dom";
import { axiosPrivate } from "../app/api/axios";

const Sales = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { getTransactions, auth, transactions, items } =
    useContext(ItemContext);
  const [transactionArray, setTransactionArray] = useState([]);
  const [same, setSame] = useState(false);
  // const [transactions, setTransactions] = useState([]);

  const firstUnit = () => {
    console.log(items);
    const firstElement = transactionArray[0];
    const currentItem =
      items && items.items.find((item) => item.name === firstElement.name);
    console.log(currentItem);
    const unitMeasureMeasureArray = [];

    const currentArray = transactionArray.filter(
      (item) => item.unitMeasure === currentItem.availableUnitMeasures[0],
    );
    setTransactionArray(currentArray);
  };

  const secondUnit = () => {
    console.log(items);
    const firstElement = transactionArray[0];
    const currentItem =
      items && items.items.find((item) => item.name === firstElement.name);
    console.log(currentItem);
    const unitMeasureMeasureArray = [];

    const currentArray = transactionArray.filter(
      (item) => item.unitMeasure === currentItem.availableUnitMeasures[1],
    );
    setTransactionArray(currentArray);
  };
  const userId = localStorage.getItem("GroceryUserId");
  const getTrans = async () => {
    const index = 0;
    try {
      console.log(userId);
      console.log();
      const response = await axiosPrivate.get("/grocery-transactions");
      const userTrans = response.data.filter(
        (transaction) => transaction.cashierID === userId,
      );

      let innerArray = [];
      userTrans.map((transaction) => {
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
          const filterate2 = filterate.filter((inner) =>
            inner.date.substring(0, 10).includes(state.search2),
          );
          setTransactionArray(filterate2);
          const allEqual = (arr) =>
            arr.every((val) => val.name === arr[0].name);
          const allTheSame = allEqual(filterate2);
          setSame(allTheSame);
          return innerArray;
        });
      });
    } catch (error) {}
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const changeUnitMesure = () => {
    console.log("wink");
  };

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    getTrans();
  }, [state.search, state.search2]);
  return transactions?.length ? (
    <div className="sales-cont">
      {same && (
        <article className="sales-button">
          <button onClick={firstUnit}>unit 1</button>
          <button onClick={secondUnit}>unit 2</button>
        </article>
      )}
      <h3 className="header">Sales</h3>
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
          <tr>
            <th>Total:</th>
            <th>
              {same &&
                numberWithCommas(
                  transactionArray
                    .reduce((a, b) => {
                      return a + parseFloat(b.qty);
                    }, 0)
                    .toFixed(2),
                )}
            </th>
            <th colSpan={2}>
              $
              {numberWithCommas(
                transactionArray
                  .reduce((a, b) => {
                    return a + parseFloat(b.total);
                  }, 0)
                  .toFixed(2),
              )}
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <h3 className="loading">Loading...</h3>
  );
};

export default Sales;
