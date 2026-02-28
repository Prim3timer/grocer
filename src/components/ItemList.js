import { useContext } from "react";
import ItemContext from "../context/itemProvider";
import { Link } from "react-router-dom";

const ItemList = () => {
  const { items, picUrl } = useContext(ItemContext);
  console.log(items);
  return (
    <Link to="/edit-item" className="items-link">
      <div className="items-list">
        <h3>Item List</h3>
        <article className="items-container">
          {items &&
            items.items.map((item) => {
              return (
                <div key={item._id}>
                  <img
                    src={`${picUrl}/images/groceryImages/${item.name}/${item.img}`}
                    alt=""
                  />
                  <h4>{item.availablePrices[0]}</h4>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              );
            })}
        </article>
      </div>
    </Link>
  );
};

export default ItemList;
