import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadFileAPI, deleteUploadFileAPI } from "../../api/uploadAPI";

export const uploadFile = createAsyncThunk(
  "upload/uploadFile",
  async (file, { rejectWithValue }) => {
    try {
      const response = await uploadFileAPI(file);
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  "upload/deleteFile",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await deleteUploadFileAPI(fileId);
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const fileSlice = createSlice({
  name: "upload",
  initialState: {
    files: [],
    loading: false,
    error: null,
    currentFileId: null,
  },
  reducers: {
    resetCurrentFileId: (state) => {
      state.currentFileId = null;
    },

    setCurrentFileId: (state, action) => {
      state.currentFileId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files.push(action.payload);
        console.log("action.payload", action.payload);
        state.currentFileId = action.payload.result.id;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter((file) => file.id !== action.meta.arg);
        if (state.currentFileId === action.meta.arg) {
          state.currentFileId = null;
        }
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCurrentFileId, setCurrentFileId } = fileSlice.actions;

export default fileSlice.reducer;
