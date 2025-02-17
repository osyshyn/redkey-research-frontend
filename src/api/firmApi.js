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

export const createFirmAPI = async (firmName) => {
  try {
    const response = await axiosInstance.post("admin/createFirm", {
      name: firmName,
    });
    return response;
  } catch (error) {
    console.error("Error creating firm:", error);
    throw error;
  }
};

export const deleteFirmAPI = async (firmIdsArray) => {
  try {
    const response = await axiosInstance.post("admin/deleteFirms", {
      ids: firmIdsArray,
    });
    return response;
  } catch (error) {
    console.error("Error deleting firm:", error);
    throw error;
  }
};

export const updateFirmAPI = async (firmData) => {
  try {
    const response = await axiosInstance.post("admin/updateFirm", {
      id: firmData.id,
      name: firmData.name,
    });
    return response;
  } catch (error) {
    console.error("Error updating firm:", error);
    throw error;
  }
};
