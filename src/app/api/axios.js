import axios from "axios";

const BASE_URL = process.env.REACT_APP_URL;

export default axios.create({
  baseUrl: BASE_URL,
});
