import { useState, useEffect, useRef } from "react";
import axios from "axios";

const CreateItem = () => {
  const itemRef = useRef();
  const now = new Date();
  const [name, setName] = useState("");
  const [unitMeasure, setUnitMeasure] = useState("");
  const [unitMeasure2, setUnitMeasure2] = useState("");
  const [description, setDescription] = useState("");
  const [availableUnitMeasures, setAvailableUnitMeasures] = useState([]);
  const [availableColours, setAvailableColours] = useState([]);
  const [availableStorage, setAvailableStorage] = useState([]);
  const [availableFootSizes, setAvailableFootSizes] = useState([]);
  const [availablePrices, setAvailablePrices] = useState([]);
  const [firstPrice, setFirstPrice] = useState("");
  const [secondPrice, setSecondPrice] = useState("");
  const [thirdPrice, setThirdPrice] = useState("");
  const [fourthPrice, setFouthPrice] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [ole, setOle] = useState("");
  const [category, setCategory] = useState("Groceries");

  const measurements = [
    "grams (g)",
    "Piece (pc)",
    "Plate (Plt)",
    "Dozen (dz)",
    "Bottle (Btl)",
    "ounce (oz)",
    "centiliter (CL)",
    "Sachet (sct)",
    "Ounce (Oz)",
    "Set (St)",
    "Bag (Bg)",
    "Pair (pr)",
    "centimiters (cm)",
    "Kilogram (kg)",
    "Kilowatthour (kWh)",
    "Kilowatt (kW)",
    "Litre (L)",
    "Pound (lbs)",
    "Cup (Cp)",
  ];

  const catArray = ["vegetable", "grain", "meat", "fish", "seasoning"];

  const colours = [
    "black",
    "red",
    "green",
    "blue",
    "brown",
    "dark brown",
    "yellowish brown",
    "white",
    "icy blue",
    "graphite",
    "gold",
    "silver",
    "crafted black",
    "navy",
    "pink",
    "silver shadow",
    "beige",
    "reddish brown",
    "tan",
    "wheat",
    "purple",
    "gray ",
  ];

  const footSize = [
    3, 3.5, 4, 4.5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12,
    12.5, 13, 13.5, 14,
  ];

  const storage = [64, 128, 256, 500, 512, 1000, 2000];

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
          image: file.name,
          now,
        };

        console.log(newItem);

        const response = await axios.post(
          `http://localhost:3500/grocery-items`,
          newItem,
        );
        console.log(response.data);
        const response2 = await axios.post(
          `http://localhost:3500/grocery-items/pic/${newItem.name}`,
          formData,
        );
        if (response) {
          setIsMatched(`new item, ${newItem.name} created`);
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

  const onColourChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setAvailableColours(values);
  };

  const onStorageChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    console.log(values);
    setAvailableStorage(values);
  };

  const onFootSizeChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setAvailableFootSizes(values);
  };

  const handleFirstPrice = (e) => {
    setFirstPrice(e.target.value);
  };
  const handleSecondPrice = (e) => {
    setSecondPrice(e.target.value);
  };

  const showUnits = () => {
    console.log(availableUnitMeasures);
  };

  return (
    <div className="create-item">
      <h3 id="create-item-heading">Create Item</h3>
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
              Availaible UnitMeasures:
              <br />
              <input
                type="text"
                list="measure"
                value={unitMeasure}
                onChange={(e) => setUnitMeasure(e.target.value)}
                required
              />
            </label>
            <datalist id="measure">
              {measurements.map((measurement, i) => {
                return (
                  <option
                    key={i}
                    className="create-item-options"
                    value={measurement}
                  >
                    {measurement}
                  </option>
                );
              })}
            </datalist>
          </div>
          <div>
            <input
              type="text"
              list="measure2"
              // required
              value={unitMeasure2}
              onChange={(e) => setUnitMeasure2(e.target.value)}
            />
            <datalist id="measure2">
              {measurements.map((measurement, i) => {
                return (
                  <option
                    key={i}
                    className="create-item-options"
                    value={measurement}
                  >
                    {measurement}
                  </option>
                );
              })}
            </datalist>
          </div>
        </article>
        <section className="create-item-price-header"></section>
        {/* <br /> */}
        <div className="create-item-price-cont">
          <article>
            <label>
              Availabale Prices:
              <br />
              <input
                type="text"
                value={firstPrice}
                required
                onChange={(e) => handleFirstPrice(e)}
              />
            </label>
          </article>
          <article>
            <input
              type="text"
              value={secondPrice}
              onChange={(e) => handleSecondPrice(e)}
            />
          </article>
        </div>
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
            //   id="catogory"
            list="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
        <datalist id="category">
          {catArray.map((cat) => {
            return <option value={cat}>{cat}</option>;
          })}
        </datalist>
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
