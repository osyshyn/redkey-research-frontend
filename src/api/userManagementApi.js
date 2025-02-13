import axiosInstance from "./index";

export const createNewUserAPI = async (userData) => {
  try {
    const response = await axiosInstance.post("admin/createUser", {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      role: userData.role,
      company: userData.company,
      access: userData.access,
    });
    return response;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
};

export const updateUserAPI = async (updatedUserData) => {
  try {
    const response = await axiosInstance.post("admin/updateUser", {
      id: updatedUserData.id,
      first_name: updatedUserData.first_name,
      last_name: updatedUserData.last_name,
      email: updatedUserData.email,
      role: updatedUserData.role,
      company: updatedUserData.company,
      access: updatedUserData.access,
    });
    return response;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
};

export const getUsersAPI = async () => {
  try {
    const response = await axiosInstance.get("admin/getUsers");
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUsersAPI = async (usersIdArray) => {
  try {
    const response = await axiosInstance.post("admin/deleteUsers", {
      ids: usersIdArray,
    });
    return response;
  } catch (error) {
    console.error("Error deleting users:", error);
    throw error;
  }
};

export const changeUserPasswordAPI = async (userPasswords) => {
  try {
    const response = await axiosInstance.post(
      "admin/changeUserPassword",
      userPasswords
    );
    return response.data;
  } catch (error) {
    console.error("Error changing user password:", error);
    throw error;
  }
};
