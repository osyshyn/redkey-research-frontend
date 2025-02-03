import React, { useState } from "react";
import FilterModal from "./FilterModal/FilterModal";
import searchIcon from "../../assets/icons/search-icon.svg";
import filterIcon from "../../assets/icons/filter-icon.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

import "./styles.scss";

const SearchAndFilterPanel = ({ onSearchChange, onFiltersChange }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() !== "") {
      onSearchChange(searchValue);
      setIsSearchSubmitted(true);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setIsSearchSubmitted(false);
    onSearchChange("");
  };

  return (
    <div className="search-and-filter-panel">
      <form onSubmit={handleSearchSubmit} autoComplete="off">
        <div className="search-input-container">
          <input
            className="search-input"
            type="text"
            name="searchQuery"
            value={searchValue}
            placeholder="Search"
            autoComplete="off"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {isSearchSubmitted && (
            <button
              type="button"
              className="close-icon"
              onClick={handleClearSearch}
            >
              <img src={closeIcon} alt="close icon" width="16" height="16" />
            </button>
          )}
          <button type="submit" className="search-icon">
            <img src={searchIcon} alt="search icon" width="16" height="16" />
          </button>
        </div>
      </form>

      <button className="filter-button" onClick={handleFilterClick}>
        <div className="filter-icon">
          <img src={filterIcon} alt="filter icon" />
        </div>
      </button>

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={handleFilterClose}
          onApply={handleFilterSave}
        />
      )}
    </div>
  );
};

export default SearchAndFilterPanel;
