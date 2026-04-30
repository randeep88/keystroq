import axios from "axios";

export const api = axios.create({
  baseURL: "https://keywars-backend.onrender.com/api",
  withCredentials: true,
});
