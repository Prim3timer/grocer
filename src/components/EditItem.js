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
import { type } from "@testing-library/user-event/dist/type";

const EditItem = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, picUrl, getItems } = useContext(ItemContext);
  const [currentPic, setCurrentPic] = useState("");
  const itemId = localStorage.getItem("itemId");
  const [name, setName] = useState("");
  const [firstPrice, setFirstPrice] = useState("");
  const [secondPrice, setSecondPrice] = useState("");
  const [firstUnitMeasure, setFirstUnitMeasure] = useState("");
  const [secondUnitMeasure, setSecondUnitMeasure] = useState("");
  const [currentItem, setCurrentItem] = useState({});
  const [description, setDescription] = useState("");
  const [denominator, setDenominator] = useState("");
  const [file, setFile] = useState({});
  const now = new Date();
  const navigate = useNavigate();

  console.log(file, state.success, currentPic);
  const getCurrentItem = () => {
    setFile("");
    const item = items && items.items.find((item) => item._id === itemId);
    console.log(item);
    console.log(picUrl);
    if (item) {
      setCurrentItem(item);
      setName(item.name);
      setFirstPrice(item.availablePrices[0]);
      setFirstUnitMeasure(item.availableUnitMeasures[0]);
      setDescription(item.description);
      setDenominator(item.denominator);
      setCurrentPic(item.img);
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
        denominator,
        description,
        // image: files,
        now,
      };
      console.log(newItem);

      const response2 = await axios.patch(
        `/grocery-items/texts/${JSON.stringify(newItem)}?id=${currentItem._id}&firstName=${currentItem.n}&index=${itemId}`,
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
      dispatch({ type: "success", payload: true });
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

  const handleFile = (e) => {
    try {
      e.preventDefault();
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
      if (file && file.size <= 2000000) {
        // setInitalName(file.name);
        // setSuccess(true);
        // setId(ide);
        // setPicArray(newArray);
        // setId(ide);
      } else if (file.size > 200000) {
        dispatch({ type: "success", payload: true });
        console.log("please choose a smaller file");
        dispatch({ type: "errMsg", payload: "please choose a smaller file" });
      }
      console.log(e.target.files[0]);
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
  };

  const handleUpload = async () => {
    console.log("upload");
    try {
      if (file.size > 2000000) {
        dispatch({
          type: "errMsg",
          payload: "Please limit file sizes to 2MB. Thank you.",
        });
      } else {
        const formData = new FormData();
        const imageName = file.name;
        formData.append("image", file);
        const response = await axios.patch(
          `/grocery/pic/${currentItem.name}?id=${currentItem._id}`,
          formData,
        );
        // setFile("");
        if (response) {
          console.log(response.data.message);

          dispatch({ type: "success", payload: true });
          dispatch({ type: "errMsg", payload: response.data.message });

          setTimeout(() => {
            dispatch({ type: "success", payload: false });
          }, 3000);
        }
      }
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
    setCurrentPic("");
  };

  const handleDeletePic = async (image) => {
    try {
      console.log(image);
      const response = await axios.delete(
        `/grocery-delete-pic/${currentItem.img}?name=${currentItem.name}&id=${currentItem._id}`,
      );
      if (response) {
        dispatch({ type: "success", payload: true });
        dispatch({ type: "errMsg", payload: response.data });
        setTimeout(() => {
          dispatch({ type: "success", payload: false });
        }, 3000);
      }
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
  };

  const imgFunc = async () => {
    if (file && file.size > 2000000) {
      dispatch({
        type: "errMsg",
        payload: "Please limit file sizes to 2MB. Thank you.",
      });
    } else {
      const response = await axios.get("/grocery-items");

      const backPic = response.data.items.find((item) => item._id === itemId);
      console.log(backPic);
      setTimeout(() => {
        setCurrentPic(backPic.img);
      }, 150);
    }
  };

  useEffect(() => {
    imgFunc();
  }, [state.success]);

  useEffect(() => {
    getCurrentItem();
  }, []);
  return (
    <div className="edit-item">
      <h3 className="header">Edit Item</h3>
      <h4>{currentItem.name}</h4>
      {currentItem && (
        <div>
          <article className="canvas">
            {currentPic !== "" ? (
              <section>
                <img
                  src={
                    currentItem.img &&
                    `${picUrl}/images/groceryImages/${currentItem.name}/${
                      currentPic
                    }`
                  }
                />
                <label
                  onClick={() => handleDeletePic(currentItem.img)}
                  className="del-icon-outer"
                >
                  {" "}
                  <FontAwesomeIcon
                    className="del-icon-inner"
                    icon={faTimes}
                  />{" "}
                </label>
              </section>
            ) : !file && currentPic === "" ? (
              <div className="plus">
                <p className="plus-header">upload an image</p>
                <label htmlFor="addImage">
                  <FontAwesomeIcon icon={faPlus} className="fa-plus" />
                </label>
                <input
                  type="file"
                  className={"add-pic-edit"}
                  onChange={(e) => handleFile(e)}
                  // onClick={() => hanldeImageId(pic.id)}
                  htmlFor="addImage"
                />
              </div>
            ) : (
              <div className="file-present">
                <p className="pic-name">{file.name}</p>
                <button onClick={handleUpload}>upload</button>
              </div>
            )}
          </article>

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
                value={denominator}
                onChange={(e) => setDenominator(e.target.value)}
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
      {state.success ? <h2 className="delete">{state.errMsg}</h2> : ""}
    </div>
  );
};

export default EditItem;
