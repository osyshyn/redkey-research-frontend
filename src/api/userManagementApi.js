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

    console.log("RESP", response);

    // {
    //     "theme": 1,
    //     "reset_password": true,
    //     "created_at": "2025-02-07T13:13:02.118Z",
    //     "updated_at": "2025-02-07T13:13:02.118Z",
    //     "id": 13,
    //     "company": 1,
    //     "first_name": "new",
    //     "last_name": "user",
    //     "email": "hello@gmail.com",
    //     "role": 1,
    //     "password": "$2a$10$PvpSCVhJe1t4wh34vMgnpeRrYWlTt1IzLKTwcV8ICBUTtffSrAvv.",
    //     "create_user_id": 2,
    //     "access": [
    //         {
    //             "value": false,
    //             "firm": {
    //                 "id": 1,
    //                 "name": "Antrim Research"
    //             }
    //         },
    //         {
    //             "value": false,
    //             "firm": {
    //                 "id": 2,
    //                 "name": "Lafitte Research"
    //             }
    //         },
    //         {
    //             "value": false,
    //             "firm": {
    //                 "id": 3,
    //                 "name": "Pacific Square Research"
    //             }
    //         },
    //         {
    //             "value": true,
    //             "firm": {
    //                 "id": 4,
    //                 "name": "Pryrania Research"
    //             }
    //         }
    //     ]
    // }

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
  