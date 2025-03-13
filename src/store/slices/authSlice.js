import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAPI,
  logoutAPI,
  changePasswordAPI,
  changeFirstOrResetPasswordAPI,
  getProfileAPI,
  changeProfileAPI,
  forgotPasswordSendEmailAPI,
  changeThemeAPI,
  requestGetAccessAPI,
} from "../../api/authApi";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials);
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || "Login failed");
      }
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutAPI();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const data = await changePasswordAPI(passwords);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error changing password"
      );
    }
  }
);

export const changeFirstOrResetPassword = createAsyncThunk(
  "auth/changeFirstOrResetPassword",
  async (passwordUserData, { rejectWithValue }) => {
    try {
      const data = await changeFirstOrResetPasswordAPI(passwordUserData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error changing/resetting password"
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProfileAPI();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error getting profile data"
      );
    }
  }
);

export const changeProfile = createAsyncThunk(
  "auth/changeProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await changeProfileAPI(profileData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error changing profile"
      );
    }
  }
);

export const forgotPasswordSendEmail = createAsyncThunk(
  "auth/forgotPasswordSendEmail",
  async (userEmail, { rejectWithValue }) => {
    try {
      const data = await forgotPasswordSendEmailAPI(userEmail);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error sending password reset email"
      );
    }
  }
);

export const changeTheme = createAsyncThunk(
  "auth/changeTheme",
  async (themeNum, { rejectWithValue }) => {
    try {
      const data = await changeThemeAPI(themeNum);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error changing theme"
      );
    }
  }
);

export const requestGetAccess = createAsyncThunk(
  "auth/requestGetAccess",
  async (accessFirmInfo, { rejectWithValue }) => {
    try {
      const data = await requestGetAccessAPI(accessFirmInfo);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error getting access to the firm. Please try again."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.status = "succeeded";
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(changeFirstOrResetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changeFirstOrResetPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(changeFirstOrResetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        console.log("state.user", state.user);
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(changeProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(changeProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })

      .addCase(changeProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(forgotPasswordSendEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPasswordSendEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(forgotPasswordSendEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(changeTheme.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changeTheme.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.theme = action.payload.theme;
      })
      .addCase(changeTheme.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(requestGetAccess.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(requestGetAccess.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(requestGetAccess.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
