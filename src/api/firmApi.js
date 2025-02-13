import axiosInstance from "./index";

export const getFirmsAPI = async () => {
  try {
    const response = await axiosInstance.get("admin/getFirms");
    return response;
  } catch (error) {
    console.error("Error getting firms:", error);
    throw error;
  }
};
