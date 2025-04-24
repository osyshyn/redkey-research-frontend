import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  researchFilters: [],
  folderSort: { type: null, direction: null },
  researchSort: { type: null, direction: null },
  userManagementFilters: [],
  isFilterModalOpen: false,
  isSortModalOpen: false,
  isUserManagementFilterModalOpen: false,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setResearchFilters: (state, action) => {
      state.researchFilters = action.payload.map((filter) => {
        // if (filter.type?.value === "initiation_date" && filter.value) {
        //   return {
        //     ...filter,
        //     value: filter.value.map((date) =>
        //       date instanceof Date ? date.toISOString() : date
        //     ),
        //   };
        // }
        return filter;
      });
    },

    setResearchSort: (state, action) => {
      state.researchSort = action.payload;
    },
    setFolderSort: (state, action) => {
      state.folderSort = action.payload;
    },

    setUserManagementFilters: (state, action) => {
      state.userManagementFilters = action.payload.map((filter) => {
        if (filter.type?.value === 'initiation_date' && filter.value) {
          return {
            ...filter,
            value: filter.value.map((date) =>
              date instanceof Date ? date.toISOString() : date
            ),
          };
        }
        return filter;
      });
    },

    clearResearchFilters: (state) => {
      state.researchFilters = [];
    },

    clearUserManagementFilters: (state) => {
      state.userManagementFilters = [];
    },

    clearFolderSort: (state) => {
      state.folderSort = { type: null, direction: null };
    },
    clearResearchSort: (state) => {
      state.researchSort = { type: null, direction: null };
    },

    toggleFilterModal: (state, action) => {
      state.isFilterModalOpen = action.payload ?? !state.isFilterModalOpen;
    },
    toggleSortModal: (state, action) => {
      state.isSortModalOpen = action.payload ?? !state.isSortModalOpen;
    },

    toggleUserManagementFilterModal: (state, action) => {
      state.isUserManagementFilterModalOpen =
        action.payload ?? !state.isUserManagementFilterModalOpen;
    },
  },
});

export const {
  setResearchFilters,
  setResearchSort,
  setFolderSort,
  clearResearchFilters,
  toggleFilterModal,
  toggleSortModal,
  setUserManagementFilters,
  clearUserManagementFilters,
  clearFolderSort,
  clearResearchSort,
  toggleUserManagementFilterModal,
} = filterSlice.actions;

export default filterSlice.reducer;
