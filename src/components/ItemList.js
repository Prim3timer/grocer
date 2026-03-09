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
      </div>
    </Link>
  );
};

export default ItemList;
