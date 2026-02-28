import Transactions from "./components/Transactions";

const initialState = {
  user: "",
  users: [],
  auth: {},
  validName: false,
  userFocus: false,
  pwd: "",
  validPwd: false,
  pwdFocus: false,
  matchPwd: "",
  validMatch: false,
  matchFocus: false,
  transArray: [],
  cash: false,
  total: 0,
  alertMsg: "",
  unitMeasure: "",
  paidAmount: "",
  balance: 0,
  email: "",
  errMsg: "",
  price: "",
  tranItemName: "",
  transactions: [],
  cancel: false,
  currentTransaction: {},
};

export default initialState;
