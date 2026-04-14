import axios from "axios";

const API = axios.create({
  baseURL: "https://servicehub-77ky.onrender.com/api",
});

export default API;