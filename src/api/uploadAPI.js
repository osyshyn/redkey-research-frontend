import axiosInstance from "./index";

export const uploadFileAPI = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "file");

    const response = await axiosInstance.post("/upload/uploadFile", formData);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteUploadFileAPI = async (fileId) => {
  try {
    const response = await axiosInstance.post("/upload/deleteUploadFile", {
      id: fileId,
    });
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
