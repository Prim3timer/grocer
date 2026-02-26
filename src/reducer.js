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
        //  state.qty = action.payload
        if (item._id === action.id) {
          return {
            ...item,
            qty: action.payload,
            total: item.availablePrices[0] * action.payload,
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
          cartTotal.total += cartItem.availablePrices[0] * cartItem.qty;
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
    case "UNITMEASURE":
      const currentArray = state.transArray.map((item) => {
        if (item._id === action.id) {
          return { ...item, unitMeasure: action.payload };
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
      return { ...state, balance: newBalance };
    default:
      throw new Error();
  }
};

export default reducer;
