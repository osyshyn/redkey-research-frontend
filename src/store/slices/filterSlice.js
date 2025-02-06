import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  researchFilters: [],
  isFilterModalOpen: false,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // setResearchFilters: (state, action) => {
    //   state.researchFilters = action.payload;
    // },
    setResearchFilters: (state, action) => {
      state.researchFilters = action.payload.map((filter) => {
        if (filter.type?.value === "due_date" && filter.value) {
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
    toggleFilterModal: (state, action) => {
      state.isFilterModalOpen = action.payload ?? !state.isFilterModalOpen;
    },
  },
});

export const { setResearchFilters, clearResearchFilters, toggleFilterModal } =
  filterSlice.actions;
export default filterSlice.reducer;
