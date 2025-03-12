// import axios from "axios";
// import Cookies from 'js-cookie';

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   // headers: {
//   //   "Content-Type": "application/json",
//   // },
// });

// // axiosInstance.interceptors.request.use(
// //   (config) => {
// //     const access_token = localStorage.getItem("access_token");
// //     if (access_token) {
// //       config.headers["Authorization"] = `${access_token}`;
// //     }

// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const access_token = Cookies.get("access_token");  
//     if (access_token) {
//       config.headers["Authorization"] = `${access_token}`; 
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;



import axios from "axios";
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};


let isRefreshing = false;
let subscribers = [];

const addSubscriber = (callback) => subscribers.push(callback);
const onRefreshed = (token) => {
  subscribers.forEach(cb => cb(token));
  subscribers = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    if (accessToken && isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
            refresh_token: refreshToken
          });

           console.log('HERE TO', response);
           

          const newAccessToken = response.data.access_token;
          Cookies.set('access_token', newAccessToken, { 
            expires: 7, 
            secure: true, 
            sameSite: 'Strict' 
          });

          accessToken = newAccessToken;
          onRefreshed(newAccessToken);
        } catch (error) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/login';
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            config.headers.Authorization = newToken;
            resolve(config);
          });
        });
      }
    }

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refresh_token');
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          refresh_token: refreshToken
        });

        Cookies.set('access_token', response.data.access_token);
        originalRequest.headers.Authorization = response.data.access_token;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

