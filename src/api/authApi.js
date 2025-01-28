import axiosInstance from "./index";

export const loginAPI = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    const { access_token, refresh_token } = response.data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);

    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
