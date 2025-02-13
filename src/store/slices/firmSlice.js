import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFirmsAPI } from "../../api/firmApi";

export const getFirms = createAsyncThunk(
  "firm/getFirms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFirmsAPI();
      return response.data;
    } catch (error) {
      console.error("Error getting firms:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const firmSlice = createSlice({
  name: "firm",
  initialState: {
    firms: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFirms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFirms.fulfilled, (state, action) => {
        state.loading = false;
        state.firms = action.payload;
      })
      .addCase(getFirms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default firmSlice.reducer;
