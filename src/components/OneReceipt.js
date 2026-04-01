import { useEffect, useContext } from "react";
import ItemContext from "../context/itemProvider";
import axios from "../app/api/axios";

const OneReceipt = () => {
  const { transactions, currency, getTransactions, bizName } =
    useContext(ItemContext);
  console.log(transactions);
  const transId = localStorage.getItem("grocTransId");
  const currentTrans = transactions.find(
    (transaction) => transaction._id == transId,
  );
  console.log(currentTrans);

  // const latestTrans = async () => {
  //   const response = await axios.get("/grocery-transactions");
  //   const transId = localStorage.getItem("grocTransId");
  //   const currentTrans = response.data.find(
  //     (transaction) => transaction._id == transId,
  //   );
  //   console.log(currentTrans);
  // };

  // useEffect(() => {
  //   latestTrans();
  // }, [transId]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const theDay = new Date(currentTrans.date).toString().substring(4, 25);

  useEffect(() => {
    getTransactions();
  }, []);
  return (
    currentTrans && (
      <div className="one-receipt">
        <article className="outer-one-receipt">
          <section className="inner-one-receipt">
            <h3>{bizName}</h3>
            <p className="receipts-date">{currentTrans._id}</p>
            <p className="receipts-date">{theDay}</p>
            {currentTrans.goods.map((good) => {
              console.log(good);
              return (
                <div>
                  <h4>{good.name}</h4>
                  <p>
                    Qty: {parseFloat(good.qty).toFixed(2)}
                    {good.unitMeasure}
                  </p>
                  <p>
                    Unit Price: {currency}
                    {numberWithCommas(parseFloat(good.price).toFixed(2))}
                  </p>
                  <p>
                    Sub Total: {currency}
                    {numberWithCommas(parseFloat(good.total).toFixed(2))}
                  </p>
                </div>
              );
            })}
            <p>
              cash paid:
              {currentTrans.last4
                ? `...${currentTrans.last4}`
                : currentTrans.cashPaid}
            </p>
            <h4>
              Grand Total: {currency}
              {numberWithCommas(parseFloat(currentTrans.grandTotal).toFixed(2))}
            </h4>
          </section>
        </article>
      </div>
    )
  );
};

export default OneReceipt;
