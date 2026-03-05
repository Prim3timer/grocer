import { useContext, useState, useRef, useReducer, useEffect } from "react";
import ItemContext from "../context/itemProvider";
import AuthContext from "../context/authProvider";
import initialState from "../store";
import reducer from "../reducer";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import axios from "../app/api/axios";

const Transactions = () => {
  const { items, picUrl, numberWithCommas, currency } = useContext(ItemContext);
  const { auth, getTransactions } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [firstRedChecker, setFirstRedChecker] = useState("");
  const [success, setSuccess] = useState(false);
  const [noShow, setNoShow] = useState(false);
  const [groceries, setGroceries] = useState([]);
  const now = new Date();
  const inputRef = useRef();
  const qtyRef = useRef();
  const [numerator, setNumerator] = useState();
  const cashPaidRef = useRef(null);
  // this was created to in liu of transArray as an array dependency due to conflict
  const [transArrayChangeLiu, setTransArrayChangeLiu] = useState(0);
  const [cash, setCash] = useState(false);

  const [measureIndex, setMeasureIndex] = useState(0);

  const trueCash = () => {
    const emptyQty = state.transArray.filter((item) => item.qty === "");
    if (state.transArray.length && emptyQty.length === 0) {
      dispatch({ type: "CASH", payload: true });
    }
  };

  const closeCashWindow = () => {
    dispatch({ type: "CASH", payload: false });
  };

  const cardCheckout = () => {
    // console.log("done sales");
  };

  const onUnitMeasureChange = (e, id) => {
    const currentItem = state.transArray.find((item) => item._id === id);
    const index = currentItem.availableUnitMeasures.indexOf(e.target.value);
    setMeasureIndex(index);
    dispatch({ type: "unitMeasure", payload: e.target.value, id, index });
  };

  const handleAdd = (e, i) => {
    e.preventDefault();

    try {
      if (inputRef.current.value) {
        if (state.success === false) state.success = true;
        else state.success = false;
        const currentItem = items.items.find(
          (item) => item.name === inputRef.current.value,
        );
        currentItem.total = currentItem.availablePrices[0];
        // dispatch({ type: "name", payload: inputRef.current.value });
        dispatch({ type: "unitMeasure", payload: e.target.value });
        const acutalItem = {
          ...currentItem,
          qty: 1,
          price: currentItem.availablePrices[0],
          unitMeasure: currentItem.availableUnitMeasures[0],
          index: measureIndex,
        };
        const match = state.transArray.find(
          (item) => item.name === acutalItem.name,
        );

        if (!match) {
          setTransArrayChangeLiu((prev) => {
            return prev + 1;
          });
          // inputRef.current.focus();
          setNoShow(true);
          dispatch({ type: "TRANSARRAY", payload: acutalItem });

          inputRef.current.value = "";
          dispatch({ type: "ALERTMSG", payload: `${acutalItem.name} added` });

          setTimeout(() => {
            setNoShow(false);
            dispatch({ type: "ALERTMSG", payload: `` });
          }, 3000);
        } else if (match) {
          setFirstRedChecker(match);
          dispatch({ type: "ALERTMSG", payload: "item already in list" });
          inputRef.current.value = "";
          setTimeout(() => {
            dispatch({ type: "ALERTMSG", payload: `` });
            setFirstRedChecker("");
            setNoShow(false);
          }, 3000);
        }
      } else {
        // dispatch({ type: "errMsg", payload: "Please select an item" });
      }
    } catch (error) {}
  };

  const removeItem = async (id) => {
    dispatch({ type: "FILTERTRANSARRAY", payload: id });
  };

  const doneSales = async () => {
    try {
      const { transArray, total } = state;

      if (state.transArray.length) {
        const transItems = {
          // cashier: auth.user,
          // cashierID: auth.picker,
          paidAmount: state.paidAmount,
          goods: transArray,
          grandTotal: total,
          cashPaid: state.cashPaid,
          numerator,
          date: now,
        };
        const response = await axios.post("/grocery-transactions", transItems);

        dispatch({ type: "CASH", payload: false });
        // if (response) {
        //   dispatch({ type: "cancel", payload: false });
        //   // so i can effect change in color of the errMsg
        //   dispatch({ type: "qty", payload: response });
        //   dispatch({ type: "clear" });
        //   dispatch({ type: "ALERTMSG", payload: response.data.message });
        //   dispatch({ type: "transArray", payload: [] });
        // }

        // transItems.goods.map((good) => {
        //   const invs = items.items.map(async (inv) => {
        //     if (inv._id === good._id) {
        //       const goodObj = {
        //         name: inv.name,
        //         qty: inv.qty - good.qty < 1 ? 0 : inv.qty - good.qty,
        //         date: now,
        //       };

        //       await axios.put(`grocery-items/inventory-update`, goodObj);
        //     }
        //   });
        // });

        const arabic = transItems.goods.map((good) => {
          return good;
        });
        console.log(arabic);

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
        // dispatch({ type: "qtyArray", payload: [] });
        // setTimeout(() => {
        //   dispatch({ type: "errMsg", payload: "" });
        // }, 1000);
      } else {
        // console.log(state.transArray)
        throw Error("no item purchased");
        // dispatch({type: 'qtyArray', payload: []})
      }
      // state.paidAmount = 0
      state.balance = 0;
    } catch (error) {
      // dispatch({ type: "errMsg", payload: error.message });
    } finally {
      //    dispatch({type: 'transArray', payload: []})
    }
  };

  useEffect(() => {
    dispatch({ type: "getTotal" });
  }, [state.transArray, success]);

  useEffect(() => {
    // state.transArray.reverse();
    if (state.transArray.length) {
      qtyRef.current.focus();
    }
  }, [transArrayChangeLiu]);

  // useEffect(() => {
  //   currentTransaction();
  // }, []);

  useEffect(() => {
    // console.log(`cashpaidref is: ${cashPaidRef.current.value}`);
  }, []);

  return (
    <div className="trans-cont">
      <h3 className="header">Transactions</h3>

      {state.transArray.length ? (
        <h3 className="item-counter">
          {state.transArray.length} item
          {state.transArray.length === 1 ? "" : "s"}
        </h3>
      ) : (
        ""
      )}

      <h3 className={state.alertMsg ? "delete" : "no-delete"}>
        {state.alertMsg}
      </h3>
      <div className="trans-item-cont">
        {!state.transArray.length ? (
          <p className="empty-cart">empty cart</p>
        ) : (
          state.transArray.map((item, index) => {
            //  console.log(item.unitMeasure)

            return (
              <section key={index} className="trans-item">
                <section className="trans-name-and-img">
                  <img
                    className="trans-img"
                    src={`${picUrl}/images/groceryImages/${item.name}/${item.img}`}
                    alt={item.name.substring(0, 10)}
                  />
                  <h4 className="trans-item-name">{item.name}</h4>
                </section>

                <article className="flex-article">
                  {/* <section> */}
                  <input
                    type="text"
                    ref={qtyRef}
                    onFocus={(e) => e.target.select()}
                    className="in-person-qty"
                    value={item.qty}
                    onChange={(e) =>
                      dispatch({
                        type: "FIELDCHANGE",
                        payload: e.target.value,
                        id: item._id,
                      })
                    }
                  />
                  <span>
                    {" "}
                    <select
                      className="measure-options"
                      size={"1"}
                      value={item.unitMeasure}
                      onChange={(e) => onUnitMeasureChange(e, item._id)}
                    >
                      {item.availableUnitMeasures.map((measure) => {
                        return (
                          <option className="update-form-unit-measure">
                            {measure}
                          </option>
                        );
                      })}
                    </select>
                  </span>

                  {/* </section>  */}
                </article>

                <article>
                  <h4
                  // style={{
                  //   display: `${state.getAllTotals ? "none" : "block"}`,
                  // }}
                  // >N{parseFloat(item.total).toFixed(2)}</h3>
                  >
                    {currency}
                    {numberWithCommas(parseFloat(item.total).toFixed(2))}
                  </h4>
                </article>

                {/* <article
                    
                    > */}
                {/* <p>price/{item.unitMeasure.split(' ')[1].slice(1, -1)}:</p>
                    <p>${item.price}</p> */}

                {/* </article> */}

                <h2 onClick={() => removeItem(item._id)}>
                  <FaTrashAlt role="button" />
                </h2>
              </section>
            );
          })
        )}
        <section>
          <fieldset className="field">
            <form className="tran-form">
              <article className="trans-add">
                <input
                  type="text"
                  className="trans-search"
                  placeholder="select item"
                  ref={inputRef}
                  onChange={(e) => handleAdd(e)}
                  list="edulevel"
                />
              </article>

              <datalist id="edulevel">
                {items &&
                  items.items.map((user) => {
                    return (
                      <option
                        key={user._id}
                        value={`${user.name}`}
                        className="transaction-items-list"
                      ></option>
                    );
                  })}
              </datalist>
            </form>

            <fieldset className="field2">
              <legend>Checkout</legend>
              <button onClick={trueCash}>Cash</button>
              <button onClick={cardCheckout}>Card</button>
            </fieldset>
          </fieldset>
        </section>
      </div>

      {state.cash === true && (
        <section
          className="cash-payment"
          // style={{
          //   display: "none",
          //   columnGap: "1rem",
          // }}
        >
          <h2 id="grand-total-one">
            Total: {currency}
            {numberWithCommas(parseFloat(state.total).toFixed(2))}
          </h2>
          <form>
            <h4>Cash Paid:</h4>
            <input
              className="cash-amount2"
              value={state.cashPaid}
              onChange={(e) =>
                dispatch({ type: "difference", payload: e.target.value })
              }
            />
          </form>
          <section
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4>
              Balance: {currency}
              {state.paidAmount > state.total
                ? parseFloat(state.balance).toFixed(2)
                : 0}
            </h4>
          </section>
          <article className="cash-confirm">
            <button onClick={closeCashWindow}>Cancel</button>
            <button onClick={doneSales}>Done</button>
          </article>
        </section>
      )}
    </div>
  );
};

export default Transactions;
