import { useState, useReducer, useContext } from "react";
import ItemContext from "../context/itemProvider";

const EditItem = () => {
  const { items, picUrl } = useContext(ItemContext);
  console.log(items);
  return (
    <div>
      <h3>Edit Item</h3>
      {items.items.map((item) => {
        return (
          <div className="edit-item">
            <img
              src={`${picUrl}/images/groceryImages/${item.name}/${item.img}`}
            />
            <p>{item.name}</p>
            <p>{item.availablePrices[0]}</p>
            <p>{item.availableUnitMeasures[0]}</p>
            <p>{item.denominator}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EditItem;
