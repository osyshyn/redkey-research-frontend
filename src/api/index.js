import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const access_token = localStorage.getItem("access_token");
//     if (access_token) {
//       config.headers["Authorization"] = `${access_token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      config.headers["Authorization"] = `${access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
