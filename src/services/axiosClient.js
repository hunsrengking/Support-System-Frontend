import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // baseURL: "http://192.168.100.149:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// const token = localStorage.getItem("token");
// if (token) {
//   axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

export default axiosClient;
