import { useContext, useEffect, useReducer, useState } from "react";
import ItemContext from "../context/itemProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import initialState from "../store";
import reducer from "../reducer";
import axios from "../app/api/axios";

const ItemList = () => {
  const { items, picUrl, oneItem, currency } = useContext(ItemContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const axiosPrivate = useAxiosPrivate();
  const [shopItems, setShopItems] = useState("");
  console.log(items);

  const getItems = async () => {
    const response = await axiosPrivate.get("/grocery-items");
    try {
      const filterItems =
        response &&
        response.data.items.filter((item) =>
          item.name.toLowerCase().includes(state.search.toLowerCase()),
        );
      console.log(filterItems);

      setShopItems(filterItems);
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
  };

  useEffect(() => {
    getItems();
  }, [state.search]);
  return (
    <div className="items-list">
      <h3 className="header">Item List</h3>
      <form className="searcher">
        <input
          placeholder="filter items"
          value={state.search}
          onChange={(e) =>
            dispatch({ type: "search", payload: e.target.value })
          }
        />
      </form>
      <Link to="/edit-item" className="items-link">
        <article className="items-container">
          {shopItems &&
            shopItems.map((item) => {
              return (
                <div
                  key={item._id}
                  onClick={() => oneItem(item._id)}
                  className="item-dets-cont"
                >
                  <img
                    src={`${picUrl}/images/groceryImages/${item.name}/${item.img}`}
                    alt="no image"
                  />
                  <section className="list-item-texts">
                    <h3>
                      {currency}
                      {item.availablePrices[0]}/{item.availableUnitMeasures[0]}
                    </h3>
                    <h4>{item.name}</h4>
                    <h4>
                      {item.qty} {item.availableUnitMeasures[0]}
                      {item.qty > 1 ? "s" : ""}
                      {item.numerator !== 0
                        ? `, ${item.numerator} ${item.availableUnitMeasures[1]}${item.numerator > 1 ? "s" : ""}`
                        : ""}
                    </h4>
                    {/* <h4>{item.availableUnitMeasures[0]}</h4> */}
                    {/* <p>{item.description}</p> */}
                    <p>
                      created:{" "}
                      {new Date(item.dateCreated).toLocaleString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      })}
                    </p>
                  </section>
                </div>
              );
            })}
        </article>
      </Link>
    </div>
  );
};

export default ItemList;
