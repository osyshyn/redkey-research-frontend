import axiosInstance from "./index";

export const getFoldersAPI = async () => {
  try {
    const response = await axiosInstance.get("/admin/getFolders");
    return response;
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
};

export const createFolderAPI = async (folderName, selectedFirmFolder, folderStockTicker) => {
  try {
    const response = await axiosInstance.post("/admin/createFolder", {
      name: folderName,
      firm: { id: selectedFirmFolder.value },
      stock_ticker : folderStockTicker
    });
    return response;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const changeFolderStatusAPI = async (folderInfo) => {
  try {
    const response = await axiosInstance.post(
      "admin/changeFolderStatus",
      folderInfo
    );
    return response;
  } catch (error) {
    console.error("Error changing folder status:", error);
    throw error;
  }
};

export const deleteFolderAPI = async (folderId) => {
  try {
    const response = await axiosInstance.post("admin/deleteFolder", {
      id: folderId,
    });
    return response;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};

export const createResearchAPI = async (researchData) => {
  try {
    const response = await axiosInstance.post("/admin/createResearch", {
      title: researchData.title || "Default Title",
      company: {
        id: researchData.companyId,
      },
      firm: {
        id: researchData.firmId || 1,
      },
      publication_date: researchData.date || new Date().toISOString(),
      report_type: researchData.reportType,
      file: {
        id: researchData.fileId,
      },
    });

    console.log("RESP", response);

    return response;
  } catch (error) {
    console.error("Error creating research:", error);
    throw error;
  }
};

export const updateResearchAPI = async (updateResearchData) => {
  try {
    const response = await axiosInstance.post("admin/updateResearch", {
      id: updateResearchData.id,
      title: updateResearchData.title || "Default Title",
      company: {
        id: updateResearchData.companyId,
      },
      firm: {
        id: updateResearchData.firmId || 1,
      },
      publication_date: updateResearchData.date || new Date().toISOString(),
      report_type: updateResearchData.reportType || 1,
      file: {
        id: updateResearchData.fileId,
      },
    });

    return response;
  } catch (error) {
    console.error("Error updating research:", error);
    throw error;
  }
};

export const deleteResearchAPI = async (researchIdArray) => {
  try {
    const response = await axiosInstance.post("admin/deleteResearch", {
      ids: researchIdArray,
    });
    return response;
  } catch (error) {
    console.error("Error deleting research:", error);
    throw error;
  }
};
