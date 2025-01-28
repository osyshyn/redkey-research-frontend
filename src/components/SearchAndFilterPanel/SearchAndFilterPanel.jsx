import React, { useState } from "react";
import FilterModal from "./FilterModal/FilterModal";
import searchIcon from "../../assets/icons/search-icon.svg";
import filterIcon from "../../assets/icons/filter-icon.svg";

import "./styles.scss";

const SearchAndFilterPanel = ({ onSearchChange, onFiltersChange }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSearchInput = (e) => {
    setSearchValue(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterSave = (filters) => {
    setIsFilterModalOpen(false);
    onFiltersChange(filters);
  };

  const handleFilterClose = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <div className="search-and-filter-panel">
      <div className="search-input-container">
        <input
          className="search-input"
          type="text"
          value={searchValue}
          placeholder="Search"
          onChange={handleSearchInput}
        />
        <div className="search-icon">
          <img src={searchIcon} alt="search icon" width="16" height="16" />
        </div>
      </div>

      <button className="filter-button" onClick={handleFilterClick}>
        <div className="filter-icon">
          <img src={filterIcon} alt="filter icon" width="21" height="21" />
        </div>
      </button>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleFilterClose}
        onSave={handleFilterSave}
      />
    </div>
  );
};

export default SearchAndFilterPanel;
