const reducer = (state, action) => {
  switch (action.type) {
    case "user":
      return { ...state, user: action.payload };
    case "users":
      return { ...state, users: action.payload };
    case "auth":
      return { ...state, auth: action.payload };
    case "validName":
      return { ...state, validName: action.payload };
    case "validEmail":
      return { ...state, validEmail: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "userFocus":
      return { ...state, userFocus: action.payload };
    case "pwd":
      return { ...state, pwd: action.payload };
    case "validPwd":
      return { ...state, validPwd: action.payload };
    case "pwdFocus":
      return { ...state, pwdFocus: action.payload };
    case "matchPwd":
      return { ...state, matchPwd: action.payload };
    case "validMatch":
      return { ...state, validMatch: action.payload };
    case "matchFocus":
      return { ...state, matchFocus: action.payload };
    case "success":
      return { ...state, success: action.payload };
    case "errMsg":
      return { ...state, errMsg: action.payload };
    case "TRANSARRAY":
      const newArray = [...state.transArray, action.payload];
      return { ...state, transArray: newArray };
    case "FILTERTRANSARRAY":
      const filterate = state.transArray.filter(
        (item) => item._id !== action.payload,
      );
      return { ...state, transArray: filterate };
    case "FIELDCHANGE":
      const tempCart3 = state.transArray.map((item) => {
        const theIndeces = item.availableUnitMeasures.indexOf(item.unitMeasure);
        if (item._id === action.id) {
          return {
            ...item,
            qty: action.payload,
            total: item.availablePrices[theIndeces] * action.payload,
          };
        }
        return item;
      });
      return { ...state, transArray: tempCart3 };
    case "CASH":
      return { ...state, cash: action.payload };
    case "getTotal":
      const { amount, total } = state.transArray.reduce(
        (cartTotal, cartItem) => {
          const theIndeces = cartItem.availableUnitMeasures.indexOf(
            cartItem.unitMeasure,
          );
          cartTotal.total +=
            cartItem.availablePrices[theIndeces] * cartItem.qty;
          cartTotal.amount += cartItem.qty;
          return cartTotal;
        },
        {
          amount: 0,
          total: 0,
        },
      );
      return { ...state, amount, total };
    case "ALERTMSG":
      return { ...state, alertMsg: action.payload };
    case "unitMeasure":
      const currentArray = state.transArray.map((item) => {
        if (item._id === action.id) {
          const currentIndex = item.availableUnitMeasures.indexOf(
            action.payload,
          );
          return {
            ...item,
            unitMeasure: action.payload,
            total: item.availablePrices[currentIndex],
            price: item.availablePrices[currentIndex],
            qty: 1,
            index: action.index,
            total: item.availablePrices[currentIndex] * item.qty,
          };
        }
        return item;
      });
      return {
        ...state,
        unitMeasure: action.payload,
        transArray: currentArray,
      };
    case "difference":
      state.paidAmount = action.payload;
      const newBalance = state.paidAmount - state.total;
      return { ...state, balance: newBalance, cashPaid: action.payload };
    case "price":
      return { ...state, price: action.payload };
    case "transactions":
      return { ...state, transactions: action.payload };
    case "cancel":
      return { ...state, cancel: action.payload };
    case "currentTransaction":
      return { ...state, currentTransaction: action.payload };
    case "currentTransactions":
      return { ...state, currentTransactions: action.payload };
    case "search":
      return { ...state, search: action.payload };
    case "search2":
      return { ...state, search2: action.payload };
    case "success":
      return { ...state, success: action.payload };
    case "inventItems":
      return { ...state, inventItems: action.payload };
    case "inventMeasure":
      const newInventory = state.inventItems.map((item) => {
        if (item._id === action.id) {
          // console.log(item);
          const measureIndex = action.measureIndex;
          const itemNum = item.numerator;
          const itemQty = item.qty;
          const qtyArray = [itemNum, itemQty];
          console.log(measureIndex);
          return {
            ...item,
            qty:
              measureIndex === 1
                ? item.numerator
                : measureIndex === 0
                  ? item.qty
                  : "",
          };
        }
        return item;
      });
      // console.log(newInventory);
      return { ...state, inventItems: newInventory };
    default:
      throw new Error();
  }
};

export default reducer;
