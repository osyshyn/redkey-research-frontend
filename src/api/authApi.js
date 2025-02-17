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

export const logoutAPI = async () => {
  try {
    await axiosInstance.post("/auth/logout");

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const changePasswordAPI = async (passwords) => {
  try {
    const response = await axiosInstance.post("user/changePassword", passwords);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const getProfileAPI = async () => {
  try {
    const response = await axiosInstance.get("admin/getProfile");

    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error getting profile data:", error);
    console.log(error);
    throw error;
  }
};

export const changeProfileAPI = async (profileData) => {
  try {
    const response = await axiosInstance.post(
      "user/changeProfile",
      profileData
    );

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error changing profile:", error);
    throw error;
  }
};
