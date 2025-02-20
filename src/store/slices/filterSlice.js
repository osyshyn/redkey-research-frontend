import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  researchFilters: [],
  userManagementFilters: [],
  isFilterModalOpen: false,
  isUserManagementFilterModalOpen: false,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setResearchFilters: (state, action) => {
      state.researchFilters = action.payload.map((filter) => {
        if (filter.type?.value === "initiation_date" && filter.value) {
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

    setUserManagementFilters: (state, action) => {
      state.userManagementFilters = action.payload.map((filter) => {
        if (filter.type?.value === "initiation_date" && filter.value) {
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

    toggleFilterModal: (state, action) => {
      state.isFilterModalOpen = action.payload ?? !state.isFilterModalOpen;
    },

    toggleUserManagementFilterModal: (state, action) => {
      state.isUserManagementFilterModalOpen =
        action.payload ?? !state.isUserManagementFilterModalOpen;
    },
  },
});

export const {
  setResearchFilters,
  clearResearchFilters,
  toggleFilterModal,
  setUserManagementFilters,
  clearUserManagementFilters,
  toggleUserManagementFilterModal,
} = filterSlice.actions;

export default filterSlice.reducer;
