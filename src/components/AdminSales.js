import { useContext, useEffect, useReducer, useState } from "react";
import ItemContext from "../context/itemProvider";
import AuthContext from "../context/authProvider";
import Transactions from "./Transactions";
import { Link } from "react-router-dom";
import initialState from "../store";
import reducer from "../reducer";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AdminSales = () => {
  const { items, transactions, bizName, currency, numberWithCommas } =
    useContext(ItemContext);
  const [transactionArray, setTransactionArray] = useState([]);
  const userId = localStorage.getItem("AdminUserId");
  const { currentUsers, setCurrentUsers } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const axiosPrivate = useAxiosPrivate();
  console.log(transactions);
  const currentSelect = currentUsers.find(
    (currentUser) => currentUser._id === userId,
  );

  const myTrans = transactions.filter(
    (transaction) => transaction.cashierID === userId,
  );

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
        // setUser(currentSelect);

        console.log(currentUsers);

        // setAuth((prev) => {
        //   return {
        //     ...prev,
        //     users: response.data.users,
        //   };
        // });
      } catch (error) {
        console.error(error);

        // navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();
    // clean up function
    return () => {
      isMounted = false;

      controller.abort();
    };
  }, []);

  const getTrans = async () => {
    try {
      // if (transactions) {
      // }
      const response = await axiosPrivate.get("/grocery-transactions");
      console.log(response.data);
      const myTrans = response.data.filter(
        (trans) => trans.cashierID === userId,
      );
      let innerArray = [];
      myTrans.map((transaction) => {
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
  console.log(myTrans);
  return transactions.length ? (
    <div className="sales-cont">
      <h3 className="header">
        {currentSelect && currentSelect.username}'s Sales
      </h3>
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
              {numberWithCommas(
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

export default AdminSales;
