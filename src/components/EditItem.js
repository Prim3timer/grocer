import { useState, useReducer, useContext, useEffect } from "react";
import ItemContext from "../context/itemProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPlus,
  faTrash,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import initialState from "../store";
import reducer from "../reducer";
import axios from "../app/api/axios";
import { useNavigate } from "react-router-dom";

const EditItem = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, picUrl, getItems } = useContext(ItemContext);
  const [initialName, setInitalName] = useState("");
  const itemId = localStorage.getItem("itemId");
  const [name, setName] = useState("");
  const [firstPrice, setFirstPrice] = useState("");
  const [secondPrice, setSecondPrice] = useState("");
  const [firstUnitMeasure, setFirstUnitMeasure] = useState("");
  const [secondUnitMeasure, setSecondUnitMeasure] = useState("");
  const [currentItem, setCurrentItem] = useState({});
  const [description, setDescription] = useState("");
  const [numerator, setNumerator] = useState("");
  const now = new Date();
  const navigate = useNavigate();

  const getCurrentItem = () => {
    const item = items && items.items.find((item) => item._id === itemId);
    console.log(item);
    console.log(picUrl);
    if (item) {
      setCurrentItem(item);
      setName(item.name);
      setFirstPrice(item.availablePrices[0]);
      setFirstUnitMeasure(item.availableUnitMeasures[0]);
      setDescription(item.description);
      setNumerator(item.numerator);
      if (item.availablePrices.length > 1) {
        setSecondPrice(item.availablePrices[1]);
        setSecondUnitMeasure(item.availableUnitMeasures[1]);
      }
    }
  };

  const handleEdit = async (ide) => {
    // console.log(fiveArray);
    // setId(ide);
    // console.log(state.afa);
    // console.log(firstName);
    // const priceArray = [firstPrice, secondPrice, thirdPrice, fourthPrice];
    try {
      const newItem = {
        // name: afa,
        // price: priceArray,
        quantity: currentItem.qty,
        firstPrice,
        secondPrice,
        firstUnitMeasure,
        secondUnitMeasure,
        numerator,
        description,
        // image: files,
        now,
      };
      console.log(newItem);

      const response2 = await axios.patch(
        `/grocery-items/texts/${JSON.stringify(newItem)}?id=${currentItem._id}&firstName=${initialName}&index=${itemId}`,
      );
      dispatch({ type: "success", payload: true });
      // dispatch({ type: "errMsg", payload: response2.data.message });
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    } finally {
      setTimeout(() => {
        dispatch({ type: "success", payload: false });
        dispatch({ type: "errMsg", payload: "" });
      }, 3000);
    }
  };

  const assertain = () => {
    console.log(currentItem);
    dispatch({ type: "cancel", payload: true });
  };
  // console.log(items);

  const handleItemDelete = async () => {
    // console.log(item._id, item.name);
    try {
      const response = await axios.delete(
        `/grocery-items/delete/${currentItem._id}?name=${currentItem.name}`,
      );
      if (response) {
        navigate("/item-list");
      }
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
    // console.log("deleted");
  };

  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part
    // of the
    // page is touched.
    if (state.cancel) {
      dispatch({ type: "cancel", payload: false });
    }
  };
  console.log(Boolean(currentItem.img));

  useEffect(() => {
    getCurrentItem();
  }, []);
  return (
    <div className="edit-item">
      <h3>Edit Item</h3>
      <h4>{currentItem.name}</h4>
      {currentItem && (
        <div>
          <img
            src={
              currentItem.img &&
              `${picUrl}/images/groceryImages/${currentItem.name}/${currentItem.img}`
            }
          />

          <form className="edit-item-form">
            <label>
              Name:
              <br />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              First Unit Measure:
              <br />
              <input
                type="text"
                value={firstUnitMeasure}
                onChange={(e) => setFirstUnitMeasure(e.target.value)}
              />
            </label>
            <label>
              Second Unit Measure:
              <br />
              <input
                type="text"
                value={secondUnitMeasure}
                onChange={(e) => setSecondUnitMeasure(e.target.value)}
              />
            </label>
            <label>
              First Price:
              <br />
              <input
                type="text"
                value={firstPrice}
                onChange={(e) => setFirstPrice(e.target.value)}
              />
            </label>
            <label>
              Second Price:
              <br />
              <input
                type="text"
                value={secondPrice}
                onChange={(e) => setSecondPrice(e.target.value)}
              />
            </label>
            <label>
              denominator:
              <br />
              <input
                type="text"
                value={numerator}
                onChange={(e) => setNumerator(e.target.value)}
              />
            </label>
            <label>
              description:
              <br />
              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </label>
          </form>
          <div className={state.cancel ? "delete" : "no-delete"}>
            <h3
              id="verify-header"
              style={{
                margin: ".5rem auto",
                //   display: 'flex',
              }}
            >
              {" "}
              Delete {currentItem.name && currentItem.name} from items
            </h3>
            <article
              style={{
                display: "flex",
                //  flexDirection: 'row',
                columnGap: "4vw",
                justifyContent: "center",
              }}
            >
              <button onClick={remainDelete}>No</button>
              <button
                onClick={handleItemDelete}
                style={{
                  backgroundColor: "red",
                  borderColor: "red",
                }}
              >
                Yes
              </button>
            </article>
          </div>
        </div>
      )}
      <section className="edit-delete-text">
        <button className="user-action" onClick={assertain}>
          {" "}
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button className="user-action" onClick={handleEdit} type="submit">
          <FontAwesomeIcon icon={faSave} />
        </button>
      </section>
    </div>
  );
};

export default EditItem;
