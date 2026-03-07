import { useState, useContext } from "react";
import ItemContext from "../context/itemProvider";

const OneReceipt = () => {
  const { transactions, currency } = useContext(ItemContext);
  const transId = localStorage.getItem("grocTransId");
  const currentTrans = transactions.find(
    (transaction) => transaction._id === transId,
  );

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <div className="one-receipt">
      {/* <h3>Reciept</h3> */}
      <section className="inner-one-receipt">
        {currentTrans.goods.map((good) => {
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
    </div>
  );
};

export default OneReceipt;
