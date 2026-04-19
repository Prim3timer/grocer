import { use, useContext, useEffect, useReducer, useState } from "react";
import ItemContext from "../context/itemProvider";
import AuthContext from "../context/authProvider";
import initialState from "../store";
import reducer from "../reducer";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const { v4: uuid } = require("uuid");
const Inventory = () => {
  // const { items } = useContext(ItemContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inventItems, setInventItems] = useState("");
  const [measureIdex, setMeasureIndex] = useState(0);
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();

  const getItems = async () => {
    try {
      const graw = await axiosPrivate.get("/grocery-items");

      const newItems = graw.data.items.map((item) => {
        return { ...item, unitMeasure: item.availableUnitMeasures[0] };
      });
      const filterate = newItems.filter((inner) =>
        inner.name.toLowerCase().includes(state.search.toLowerCase()),
      );
      if (state.search2) {
        const stockFilter =
          filterate && filterate.filter((item) => item.qty <= state.search2);
        // dispatch({ type: "items", payload: stockFilter && stockFilter });
        dispatch({ type: "inventItems", payload: stockFilter });
      } else dispatch({ type: "inventItems", payload: filterate });
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.Message });
    }
  };
  const onUnitMeasureChange = (e, id) => {
    const currentItem = state.inventItems.find((item) => item._id === id);
    const measureIndex = currentItem.availableUnitMeasures.indexOf(
      e.target.value,
    );
    dispatch({
      type: "inventMeasure",
      payload: e.target.value,
      id,
    });
  };

  useEffect(() => {
    getItems();
  }, [state.search, state.search2]);

  return (
    <div className="inventory">
      <h3 className="header">
        {" "}
        Inventory ({state.inventItems && state.inventItems.length} items){" "}
      </h3>

      <form
        className="searcher"
        //   onSubmit={(e)=> e.preventDefault()}
      >
        {/* <h2 className="invent-header">Inventory</h2> */}
        <input
          //   id="invent-search"
          type="text"
          role="searchbox"
          placeholder="filter by name"
          value={state.search}
          onChange={(e) =>
            dispatch({ type: "search", payload: e.target.value })
          }

          // https://www.npmjs.com/package/@react-google-maps/api
        />

        <input
          //  id="invent-search"

          placeholder="pick a number"
          role="searchbox"
          value={state.search2}
          onChange={(e) =>
            dispatch({ type: "search2", payload: e.target.value })
          }
        />
      </form>
      <table className="inventory-table">
        <tbody>
          <tr className="invent-header-trow">
            <th>Name</th>
            <th>In-Stock</th>
            <th> </th>
            <th> Last Udated</th>
            {/* <th>ACTION</th> */}
          </tr>
          {state.inventItems &&
            state.inventItems.map((inv, index) => {
              const invReg = inv.qty < 1 ? (inv.qty = 0) : inv.qty;
              // console.log(correctFormat)
              // const theDay = new Date(inv.date).getDate()
              // const aDate = format(inv.date.substring(0, 10), `${theDay} MMM, yyyy`)
              return (
                <tr
                  className="sales-items-cont"
                  key={uuid()}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "palegreen",
                  }}
                >
                  <td className="sales-items">{`${inv.name}`}</td>
                  <th
                    className="sales-items"
                    style={{
                      color: inv.availableQuantities[0] < 20 ? "red" : "",
                    }}
                  >
                    {parseFloat(inv.qty).toFixed(2)}{" "}
                  </th>
                  <td>
                    <select
                      className="measure-inventory"
                      size={"1"}
                      value={inv.unitMeasure}
                      onChange={(e) => onUnitMeasureChange(e, inv._id)}
                    >
                      {inv.availableUnitMeasures.map((measure, i) => {
                        return (
                          <option className="update-form-unit-measure" key={i}>
                            {measure}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                  <td className="sales-items">
                    {/* {new Date(inv.date).toLocaleString("en-us", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })} */}

                    {new Date(inv.date).toLocaleString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}
                  </td>
                  {/* <td 
     ref={invRef}
     className="sales-items">
         <a
         onClick={(e) => showEdit(inv._id, e)}
     >
      <FontAwesomeIcon icon={faPenToSquare} />
     </a>
     </td> */}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
