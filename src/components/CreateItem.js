import { useState, useEffect, useRef } from "react";
import axios from "../app/api/axios";

const CreateItem = () => {
  const itemRef = useRef();
  const now = new Date();
  const [name, setName] = useState("");
  const [unitMeasure, setUnitMeasure] = useState("");
  const [unitMeasure2, setUnitMeasure2] = useState("");
  const [description, setDescription] = useState("");
  const [availableUnitMeasures, setAvailableUnitMeasures] = useState([]);
  const [firstPrice, setFirstPrice] = useState("");
  const [secondPrice, setSecondPrice] = useState("");
  const [firstQty, setFirstQty] = useState(0);
  const [secondQty, setSecondQty] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [ole, setOle] = useState("");
  const [category, setCategory] = useState("");
  const [denominator, setDenominator] = useState(0);

  const numaRef = useRef();

  const catArray = ["vegetable", "grain", "meat", "fish", "seasoning"];

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file.size > 2000000) {
      setSuccess(true);

      setErrMsg("Please limit file sizes to 2MB. Thank you.");
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } else {
      setShowUpdate(true);
      setIsMatched("creating item...");
      e.preventDefault();
      // const { name, unitMeasure, image, ole } = state;
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
      }
      console.log(formData);

      console.log(file);
      const prices = [Number(firstPrice), Number(secondPrice)];
      const measures = [unitMeasure, unitMeasure2];
      const qtys = [firstQty, secondQty];
      const withPriceValue = prices.filter((item) => item !== 0);
      const withUnitValue = measures.filter((item) => item !== "");
      try {
        const newItem = {
          name: `${name}`,
          availablePrices: withPriceValue,
          availableUnitMeasures: withUnitValue,
          description,
          qty: ole,
          category,
          denominator,
          image: file.name,
          now,
        };

        console.log(ole);

        const response = await axios.post(`/grocery-items`, newItem);
        console.log(response.data);
        const response2 = await axios.post(
          `/grocery-items/pic/${newItem.name}`,
          formData,
        );
        if (response) {
          setIsMatched(`new item, ${newItem.name} created`);
          setName("");
          setUnitMeasure("");
          setUnitMeasure2("");
          setFirstPrice("");
          setSecondPrice("");
          setFirstQty("");
          setSecondQty("");
          setCategory("");
          setDescription("");

          setTimeout(() => {
            setIsMatched(``);
            setShowUpdate(false);
          }, 3000);
        }
      } catch (error) {
        setErrMsg(error.message);
        setTimeout(() => {
          setErrMsg("");
        }, 3000);
      } finally {
        itemRef.current.focus();
      }
    }
  };

  const handleUnitMeasures = () => {
    const units = [unitMeasure, unitMeasure2];
    setAvailableUnitMeasures(units);
  };

  useEffect(() => {
    handleUnitMeasures();
    console.log(availableUnitMeasures);
  }, [unitMeasure, unitMeasure2]);

  const handleFirstPrice = (e) => {
    setFirstPrice(e.target.value);
  };
  const handleSecondPrice = (e) => {
    setSecondPrice(e.target.value);
  };

  const showUnits = () => {
    console.log(availableUnitMeasures);
  };

  const demSetter = (e) => {
    // unitMeasure2 && console.log(numaRef.current.value());
    if (
      unitMeasure.toLowerCase().toLocaleLowerCase() === "dozen".toLowerCase()
    ) {
      setDenominator(12);
    } else {
      setDenominator(0);
    }
  };

  useEffect(() => {
    demSetter();
  }, [unitMeasure]);

  return (
    <div className="create-item">
      <h3 className="header">Create Item</h3>
      <form id="create-item-form" onSubmit={(e) => handleSubmit(e)}>
        <label>
          Name:
          <br />
          <input
            ref={itemRef}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        {/* <h3 id="ulu" */}
        <article className="unit-measures">
          <div>
            <label>
              First Unit Measure:
              <br />
              <input
                type="text"
                value={unitMeasure}
                onChange={(e) => setUnitMeasure(e.target.value)}
                required
              />
            </label>
          </div>
          {firstPrice && (
            <div>
              <label>
                Second Unit Measure
                <br />
                <input
                  type="text"
                  placeholder="optional"
                  // required
                  value={unitMeasure2}
                  onChange={(e) => setUnitMeasure2(e.target.value)}
                />
              </label>
            </div>
          )}
        </article>
        <section className="create-item-price-header"></section>
        {/* <br /> */}
        <div className="create-item-price-cont">
          <article>
            <label>
              Fisrt Price:
              <br />
              <input
                type="text"
                value={firstPrice}
                required
                onChange={(e) => handleFirstPrice(e)}
              />
            </label>
          </article>
          {unitMeasure2 && (
            <article>
              <label>
                Second Price <br />
                <input
                  type="text"
                  value={secondPrice}
                  onChange={(e) => handleSecondPrice(e)}
                  required
                />
              </label>
            </article>
          )}
        </div>
        {unitMeasure2 && (
          <div>
            <label>
              How many {unitMeasure2}s in a {unitMeasure}?
              <br />
              <input
                type="text"
                required
                value={denominator}
                onChange={(e) => setDenominator(e.target.value)}
              />
            </label>
          </div>
        )}
        <label>
          in stock: <br />
          <input
            type="text"
            required
            value={ole}
            onChange={(e) => setOle(e.target.value)}
          />
        </label>

        <label>
          category:
          <br />
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
        <label>
          Description: <br />
          <textarea
            maxLength={300}
            className="item-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>

        <div className="create-item-image-box">
          <h4>Add Image</h4>
          <p>Maximum size of 2MB.</p>
          <input
            type="file"
            // required
            onChange={handleFile}
            multiple
          />
        </div>
        <section className="action-create">
          <button type="submit" className="pop">
            Add Item
          </button>
        </section>
      </form>
      <h3 className={showUpdate ? "delete" : "hide-show-update"}>
        {isMatched}
      </h3>
      {success ? <h3 className="delete">{errMsg}</h3> : ""}
    </div>
  );
};

export default CreateItem;
