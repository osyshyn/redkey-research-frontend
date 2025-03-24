import axiosInstance from "./index";
import Cookies from "js-cookie";

export const loginAPI = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    const { access_token, refresh_token, reset_password } = response.data;

    // localStorage.setItem("access_token", access_token);
    localStorage.setItem("reset_password", reset_password);

    Cookies.set("access_token", access_token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refresh_token", refresh_token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

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

    // localStorage.removeItem("access_token");
    // localStorage.removeItem("refresh_token");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");

    localStorage.removeItem("selectedTheme");
    localStorage.removeItem("currentFirm");
    localStorage.removeItem("reset_password");

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
export const changeResetPasswordAPI = async (passwordData) => {
  try {
    const response = await axiosInstance.post(
      "auth/changePassword",
      passwordData
    );
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const checkForgotTokenAPI = async (token) => {
  try {
    const response = await axiosInstance.get(
      `auth/CheckForgotToken?token=${token}`
    );

    console.log("token response", response);
    return response.data;
  } catch (error) {
    console.error("Error checking forgot token:", error);
    throw error;
  }
};
export const checkMagicLinkAPI = async (token) => {
  try {
    const response = await axiosInstance.post("auth/checkMagicLink", token);

    console.log("token response", response);
    return response.data;
  } catch (error) {
    console.error("Error checking magic link:", error);
    throw error;
  }
};

export const changeFirstOrResetPasswordAPI = async (passwordUserData) => {
  try {
    console.log("HELLO", passwordUserData);

    const response = await axiosInstance.post(
      "auth/changePassword",
      passwordUserData
    );
    const { reset_password } = response.data;
    localStorage.setItem("reset_password", reset_password);
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

export const forgotPasswordSendEmailAPI = async (userEmail) => {
  try {
    const response = await axiosInstance.post("auth/forgotPasswordSendEmail", {
      email: userEmail,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending email to reset password:", error);
    throw error;
  }
};

export const changeThemeAPI = async (themeNum) => {
  try {
    const response = await axiosInstance.post("admin/changeTheme", {
      theme: themeNum,
    });

    localStorage.setItem("selectedTheme", themeNum);
    return response.data;
  } catch (error) {
    console.error("Error changing theme:", error);
    throw error;
  }
};

export const requestGetAccessAPI = async (accessFirmInfo) => {
  try {
    const response = await axiosInstance.post("user/requestGetAccess", {
      firm: accessFirmInfo,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting access to the firm:", error);
    throw error;
  }
};
