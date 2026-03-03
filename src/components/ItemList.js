import { useContext } from "react";
import ItemContext from "../context/itemProvider";
import { Link } from "react-router-dom";

const ItemList = () => {
  const { items, picUrl, oneItem, currency } = useContext(ItemContext);
  console.log(items);
  return (
    <Link to="/edit-item" className="items-link">
      <div className="items-list">
        <h3 className="header">Item List</h3>
        <article className="items-container">
          {items &&
            items.items.map((item) => {
              return (
                <div
                  key={item._id}
                  onClick={() => oneItem(item._id)}
                  className="item-dets-cont"
                >
                  <img
                    src={`${picUrl}/images/groceryImages/${item.name}/${item.img}`}
                    alt=""
                  />
                  <h3>
                    {currency}
                    {item.availablePrices[0]}
                  </h3>
                  <h4>{item.name}</h4>
                  <h4>{item.numerator !== 0 ? item.numerator : ""}</h4>
                  <h4>{item.availableUnitMeasures[0]}</h4>
                  <p>{item.description}</p>
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
                </div>
              );
            })}
        </article>
      </div>
    </Link>
  );
};

export default ItemList;
