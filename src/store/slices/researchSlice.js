import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFoldersAPI,
  createFolderAPI,
  changeFolderStatusAPI,
  deleteFolderAPI,
  createResearchAPI,
  updateResearchAPI,
  deleteResearchAPI,
} from "../../api/researchApi";

export const getFolders = createAsyncThunk(
  "research/getFolders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFoldersAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createFolder = createAsyncThunk(
  "research/createFolder",
  async (folderName, { rejectWithValue }) => {
    try {
      const response = await createFolderAPI(folderName);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changeFolderStatus = createAsyncThunk(
  "research/changeFolderStatus",
  async (folderInfo, { rejectWithValue }) => {
    try {
      const response = await changeFolderStatusAPI(folderInfo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFolder = createAsyncThunk(
  "research/deleteFolder",
  async (folderId, { rejectWithValue }) => {
    try {
      await deleteFolderAPI(folderId);
      return folderId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createResearch = createAsyncThunk(
  "research/createResearch",
  async (researchData, { rejectWithValue }) => {
    try {
      const response = await createResearchAPI(researchData);
      console.log("research/createResearch", response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateResearch = createAsyncThunk(
  "research/updateResearch",
  async (updateResearchData, { rejectWithValue }) => {
    try {
      const response = await updateResearchAPI(updateResearchData);
      console.log("research/updateResearch", response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteResearch = createAsyncThunk(
  "research/deleteResearch",
  async (researchIdArray, { rejectWithValue }) => {
    try {
      await deleteResearchAPI(researchIdArray);
      return researchIdArray;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  folders: [],
  // research: [],
  foldersStatus: "idle",
  researchStatus: "idle",
  error: null,
};

const researchSlice = createSlice({
  name: "research",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getFolders.pending, (state) => {
        state.foldersStatus = "loading";
      })
      .addCase(getFolders.fulfilled, (state, action) => {
        state.foldersStatus = "succeeded";
        state.folders = action.payload;
      })
      .addCase(getFolders.rejected, (state, action) => {
        state.foldersStatus = "failed";
        state.error = action.payload;
      })

      .addCase(createFolder.pending, (state) => {
        state.foldersStatus = "loading";
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.foldersStatus = "succeeded";
        // state.folders.push(action.payload);
        state.folders.unshift(action.payload);
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.foldersStatus = "failed";
        state.error = action.payload;
      })

      .addCase(changeFolderStatus.pending, (state) => {
        state.foldersStatus = "loading";
      })

      .addCase(changeFolderStatus.fulfilled, (state, action) => {
        state.foldersStatus = "succeeded";
        const { id, status } = action.payload;
        const updatedFolders = state.folders.map((folder) => {
          if (folder.id === id) {
            return { ...folder, status };
          }
          return folder;
        });
        state.folders = updatedFolders;
      })

      .addCase(changeFolderStatus.rejected, (state, action) => {
        state.foldersStatus = "failed";
        state.error = action.payload;
      })

      .addCase(deleteFolder.pending, (state) => {
        state.foldersStatus = "loading";
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.foldersStatus = "succeeded";
        state.folders = state.folders.filter(
          (folder) => folder.id !== action.payload
        );
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.foldersStatus = "failed";
        state.error = action.payload;
      })

      .addCase(createResearch.pending, (state) => {
        state.researchStatus = "loading";
      })

      .addCase(createResearch.fulfilled, (state, action) => {
        state.researchStatus = "succeeded";
        const newResearch = action.payload;
        console.log("newResearch", newResearch);

        const updatedFolders = state.folders.map((folder) => {
          if (folder.id === newResearch.company.id) {
            return {
              ...folder,
              research: [...folder.research, newResearch],
            };
          }
          return folder;
        });

        state.folders = updatedFolders;
      })

      .addCase(createResearch.rejected, (state, action) => {
        state.researchStatus = "failed";
        state.error = action.payload;
      })

      .addCase(updateResearch.pending, (state) => {
        state.researchStatus = "loading";
      })

      // .addCase(updateResearch.fulfilled, (state, action) => {
      //   state.researchStatus = "succeeded";
      //   const updatedResearch = action.payload;

      //   const foldersWithoutResearch = state.folders.map((folder) => ({
      //     ...folder,
      //     research: folder.research.filter(
      //       (res) => res.id !== updatedResearch.id
      //     ),
      //   }));

      //   state.folders = foldersWithoutResearch.map((folder) => {
      //     if (folder.id === updatedResearch.company.id) {
      //       return {
      //         ...folder,
      //         research: [...folder.research, updatedResearch],
      //       };
      //     }
      //     return folder;
      //   });
      // })

      // .addCase(updateResearch.fulfilled, (state, action) => {
      //   state.researchStatus = "succeeded";
      //   const updatedResearch = action.payload;

      //   state.folders = state.folders.map((folder) => {
      //     const updatedResearchList = folder.research.filter(
      //       (res) => res.id !== updatedResearch.id
      //     );

      //     return folder.id === updatedResearch.company.id
      //       ? { ...folder, research: [updatedResearch, ...updatedResearchList] }
      //       : { ...folder, research: updatedResearchList };
      //   });
      // })

      .addCase(updateResearch.fulfilled, (state, action) => {
        state.researchStatus = "succeeded";
        const updatedResearch = action.payload;

        state.folders = state.folders.map((folder) => {
          if (folder.id === updatedResearch.company.id) {
            const researchIndex = folder.research.findIndex(
              (res) => res.id === updatedResearch.id
            );
            if (researchIndex !== -1) {
              const newResearch = [...folder.research];
              newResearch[researchIndex] = updatedResearch;
              return { ...folder, research: newResearch };
            } else {
              return {
                ...folder,
                research: [updatedResearch, ...folder.research],
              };
            }
          } else {
            return {
              ...folder,
              research: folder.research.filter(
                (res) => res.id !== updatedResearch.id
              ),
            };
          }
        });
      })

      .addCase(updateResearch.rejected, (state, action) => {
        state.researchStatus = "failed";
        state.error = action.payload;
      })

      .addCase(deleteResearch.pending, (state) => {
        state.researchStatus = "loading";
      })

      .addCase(deleteResearch.fulfilled, (state, action) => {
        state.researchStatus = "succeeded";
        const researchIdsToDelete = action.payload;
        state.folders = state.folders.map((folder) => {
          if (folder.research && folder.research.length > 0) {
            return {
              ...folder,
              research: folder.research.filter(
                (research) => !researchIdsToDelete.includes(research.id)
              ),
            };
          }
          return folder;
        });
      })

      .addCase(deleteResearch.rejected, (state, action) => {
        state.researchStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default researchSlice.reducer;
