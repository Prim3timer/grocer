import { useContext, useEffect } from "react";
import ItemContext from "../context/itemProvider";
import Transactions from "./Transactions";
import { Link, useNavigate, location, useLocation } from "react-router-dom";
import AuthContext from "../context/authProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AdminReceipt = () => {
  const {
    items,
    transactions,
    bizName,
    currency,
    numberWithCommas,
    currentUsers,
  } = useContext(ItemContext);
  const axiosPrivate = useAxiosPrivate();
  // const [currentUsers, setCurrentUsers] = useState([]);
  const { auth, setCurrentUsers, setAuth } = useContext(AuthContext);
  const userId = localStorage.getItem("AdminUserId");
  const myTrans = transactions.filter(
    (transaction) => transaction.cashierID === userId,
  );

  console.log(currentUsers);

  const currentSelect = auth?.users?.find(
    (currentUser) => currentUser._id === userId,
  );
  console.log(myTrans);

  useEffect(() => {
    // console.log(auth)
    let isMounted = true;
    // to cancel our request if the Component unmounts
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/groceryUsers", {
          signal: controller.signal,
        });
        console.log(response.status);

        isMounted && setCurrentUsers(response.data.users);
        const currentSelect = response.data.users.find(
          (user) => user._id === userId,
        );
        // setUser(currentSelect);

        console.log(currentUsers);

        // setAuth((prev) => {
        //   return {
        //     ...prev,
        //     users: response.data.users,
        //   };
        // });
      } catch (error) {
        console.error(error);

        // navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();
    // clean up function
    return () => {
      isMounted = false;

      controller.abort();
    };
  }, []);

  const oneShow = (id) => {
    localStorage.setItem("groceryTransactions", id);
    // auth.picker2 = id;
    // console.log(auth);
  };
  return transactions.length ? (
    <div>
      <h3>
        {currentSelect && currentSelect.username}'s Receipts ({myTrans.length})
      </h3>
      {myTrans.map((transaction) => {
        const theDay = new Date(transaction.date).toString().substring(4, 25);
        return (
          <section key={transaction._id} className="receipt-main-cont">
            {transactions.length !== 0 ? (
              <article className="receipts">
                <br />
                <h4 className="biz-name">{bizName}</h4>
                {/* <p>{theDay}</p> */}
                <p>{transaction._id}</p>
                {transaction.goods.map((good) => {
                  return (
                    <div className="goods-container" key={good._id}>
                      <Link
                        to="/one-receipt"
                        style={{
                          textDecoration: "none",
                        }}
                        onClick={() => oneShow(transaction._id)}
                      >
                        {/* <h4>{good._id}</h4> */}
                        <h4>{good.name}</h4>
                        <p>
                          Qty: {parseFloat(good.qty).toFixed(2)}{" "}
                          {good.unitMeasure}
                          {good.qty > 1 ? "s" : ""}
                        </p>
                        <p>
                          Unit Price: {currency}
                          {numberWithCommas(parseFloat(good.price).toFixed(2))}
                        </p>
                        <p>
                          Sub Total: {currency}
                          {numberWithCommas(parseFloat(good.total).toFixed(2))}
                        </p>
                      </Link>
                    </div>
                  );
                })}

                {transaction.last4 ? (
                  <p>card ending in....{transaction.last4}</p>
                ) : transaction.cashPaid ? (
                  <p>
                    cash paid: {currency}
                    {transaction.cashPaid}
                  </p>
                ) : (
                  ""
                )}
                <h4 className="receipts-grand-total">
                  Grand Total: {currency}
                  {numberWithCommas(
                    parseFloat(transaction.grandTotal).toFixed(2),
                  )}
                </h4>
                {/* <h5>Cashier: {transaction.cashier}</h5> */}
                {/* <h3
                  onClick={(e) => assertain(transaction._id, e)}
                  style={{
                    textAlign: "center",
                  }}
                >
                  <FaTrashAlt role="button" />
                </h3> */}
                <br />
              </article>
            ) : (
              <p>"empty list"</p>
            )}
          </section>
        );
      })}
    </div>
  ) : (
    <h3 className="loading">loading...</h3>
  );
};

export default AdminReceipt;
