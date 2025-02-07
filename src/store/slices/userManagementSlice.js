import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewUserAPI,
  getUsersAPI,
  deleteUsersAPI,
} from "../../api/userManagementApi";

export const createNewUser = createAsyncThunk(
  "userManagement/createNewUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await createNewUserAPI(userData);
      return response.data;
    } catch (error) {
      console.error("Error creating new user:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUsers = createAsyncThunk(
  "userManagement/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsersAPI();
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUsers = createAsyncThunk(
  "userManagement/deleteUsers",
  async (usersIdArray, { rejectWithValue }) => {
    try {
      await deleteUsersAPI(usersIdArray);
      return usersIdArray;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => !action.payload.includes(user.id)
        );
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userManagementSlice.reducer;
