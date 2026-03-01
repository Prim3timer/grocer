import { use, useContext, useEffect, useReducer, useState } from "react";
import ItemContext from "../context/itemProvider";
import initialState from "../store";
import reducer from "../reducer";
const { v4: uuid } = require("uuid");
const Inventory = () => {
  const { items } = useContext(ItemContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inventItems, setInventItems] = useState();

  const getTrans = async () => {
    try {
      //   const graw = await axiosPrivate.get('/items')

      const filterate = items.items.filter((inner) =>
        inner.name.toLowerCase().includes(state.search.toLowerCase()),
      );
      if (state.search2) {
        const stockFilter =
          filterate && filterate.filter((item) => item.qty <= state.search2);
        // dispatch({ type: "items", payload: stockFilter && stockFilter });
        setInventItems(stockFilter);
      } else setInventItems(filterate);
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.Message });
    }
  };
  console.log(inventItems);

  useEffect(() => {
    getTrans();
  }, [state.search, state.search2]);

  return (
    <div className="inventory">
      <h3 className="header">
        Inventory ({inventItems && inventItems.length} items)
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
        {/* <article> */}
        {/* <h3><label>Search by stock level</label></h3> */}
        <div>
          <span>under or equal to</span>{" "}
          <input
            //  id="invent-search"

            placeholder="pick a number"
            role="searchbox"
            value={state.search2}
            onChange={(e) =>
              dispatch({ type: "search2", payload: e.target.value })
            }
          />
        </div>
        {/* </article> */}
      </form>
      <table className="inventory-table">
        <tbody>
          <tr className="invent-header-trow">
            <th>Name</th>
            <th>In-Stock</th>
            <th> Last Udated</th>
            {/* <th>ACTION</th> */}
          </tr>
          {inventItems &&
            inventItems.map((inv, index) => {
              console.log(inv.date);
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
                    style={{ color: inv.qty < 20 ? "red" : "" }}
                  >
                    {inv.unitMeasure === "Kilogram (kg)" ||
                    inv.unitMeasure === "Kilowatthour (kWh)" ||
                    inv.unitMeasure === "Kilowatt (kW)" ||
                    inv.unitMeasure === "Pound (lbs)" ||
                    inv.unitMeasure === "Litre (L)"
                      ? parseFloat(invReg).toFixed(2)
                      : invReg}{" "}
                    {/* {inv.unitMeasure.split(" ")[1].slice(1, -1)} */}
                  </th>
                  <td className="sales-items">
                    {new Date(inv.date).toString().substring(4, 25)}
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
