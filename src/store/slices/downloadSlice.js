// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { createDownloadRecordAPI } from "../../api/downloadApi";

// export const createDownloadRecord = createAsyncThunk(
//   "download/createRecord",
//   async (fileId, { rejectWithValue }) => {
//     try {
//       const response = await createDownloadRecordAPI(fileId);
//       return response.data;
//     } catch (error) {
//       console.error("Error creating download record:", error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const downloadSlice = createSlice({
//   name: "download",
//   initialState: {
//     records: [],
//     loading: false,
//     error: null,
//     // currentRecordId: null,
//   },
//   reducers: {
//     // resetCurrentRecordId: (state) => {
//     //   state.currentRecordId = null;
//     // },
//     // setCurrentRecordId: (state, action) => {
//     //   state.currentRecordId = action.payload;
//     // },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createDownloadRecord.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createDownloadRecord.fulfilled, (state, action) => {
//         state.loading = false;
//         state.records.push(action.payload);
//         // state.currentRecordId = action.payload.id;
//       })
//       .addCase(createDownloadRecord.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // export const { resetCurrentRecordId, setCurrentRecordId } = downloadSlice.actions;

// export default downloadSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createDownloadRecordAPI, getDownloadsAPI } from "../../api/downloadApi";

export const createDownloadRecord = createAsyncThunk(
  "download/createDownloadRecord",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await createDownloadRecordAPI(fileId);
      return response.data;
    } catch (error) {
      console.error("Error creating download record:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDownloads = createAsyncThunk(
  "download/getDownloads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDownloadsAPI();
      return response.data;
    } catch (error) {
      console.error("Error fetching downloads:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const downloadSlice = createSlice({
  name: "download",
  initialState: {
    records: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDownloadRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDownloadRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(createDownloadRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDownloads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDownloads.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(getDownloads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default downloadSlice.reducer;
