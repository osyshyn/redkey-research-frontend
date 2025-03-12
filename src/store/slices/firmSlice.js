import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFirmsAPI,
  createFirmAPI,
  deleteFirmAPI,
  updateFirmAPI,
} from "../../api/firmApi";

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

export const createFirm = createAsyncThunk(
  "firm/createFirm",
  async (firmName, { rejectWithValue }) => {
    try {
      const response = await createFirmAPI(firmName);
      return response.data;
    } catch (error) {
      console.error("Error creating firm:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFirm = createAsyncThunk(
  "firm/deleteFirm",
  async (firmIdsArray, { rejectWithValue }) => {
    try {
      await deleteFirmAPI(firmIdsArray);
      return firmIdsArray;
    } catch (error) {
      console.error("Error deleting firm:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateFirm = createAsyncThunk(
  "firm/updateFirm",
  async (firmData, { rejectWithValue }) => {
    try {
      const response = await updateFirmAPI(firmData);
      return response.data;
    } catch (error) {
      console.error("Error updating firm:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const loadCurrentFirm = () => {
  const storedFirm = localStorage.getItem("currentFirm");
  return storedFirm ? JSON.parse(storedFirm) : {name:'All'};
};



const firmSlice = createSlice({
  name: "firm",
  initialState: {
    firms: [],
    currentFirm: loadCurrentFirm(),
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentFirm: (state, action) => {
      state.currentFirm = action.payload;
      localStorage.setItem("currentFirm", JSON.stringify(action.payload));
    },
  },
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
      })

      .addCase(createFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFirm.fulfilled, (state, action) => {
        state.loading = false;
        state.firms.push(action.payload);
      })
      .addCase(createFirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFirm.fulfilled, (state, action) => {
        state.loading = false;
        const firmIdsToDelete = action.payload;
        state.firms = state.firms.filter(
          (firm) => !firmIdsToDelete.includes(firm.id)
        );
        if (
          state.currentFirm &&
          firmIdsToDelete.includes(state.currentFirm.id)
        ) {
          state.currentFirm = null;
          localStorage.removeItem("currentFirm");
        }
      })

      .addCase(deleteFirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFirm.fulfilled, (state, action) => {
        state.loading = false;
        const updatedFirm = action.payload;

        state.firms = state.firms.map((firm) =>
          firm.id === updatedFirm.id ? updatedFirm : firm
        );
        if (state.currentFirm?.id === updatedFirm.id) {
          state.currentFirm = updatedFirm;
        }
      })
      .addCase(updateFirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentFirm } = firmSlice.actions;

export default firmSlice.reducer;
