import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFilterModal , toggleSortModal} from '../../store/slices/filterSlice';

import FilterModal from './FilterModal/FilterModal';
import SortModal from './SortModal/SortModal';

import searchIcon from '../../assets/icons/search-icon.svg';
import filterIcon from '../../assets/icons/filter-icon.svg';
import arrowsSortIcon from '../../assets/icons/arrows-sort.svg';
import closeIcon from '../../assets/icons/close-icon.svg';

import './styles.scss';

const SearchAndFilterPanel = ({
  onSearchChange,
  onFiltersChange,
  // folderOptions = [],
  users = [],
  firmsList = [],
  componentType,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const dispatch = useDispatch();

  const {
    isFilterModalOpen,
    researchFilters,
    isSortModalOpen,
    researchSort,
    isUserManagementFilterModalOpen,
    userManagementFilters,
  } = useSelector((state) => state.filters);

  const handleFilterClick = () => {
    dispatch(toggleFilterModal(true));
  };

  const handleFilterClose = () => {
    dispatch(toggleFilterModal(false));
  };

  const handleFilterSave = (filters) => {
    dispatch(toggleFilterModal(false));
    onFiltersChange(filters);
  };
  const handleSortClick = () => {
    dispatch(toggleSortModal(true));
  };

  const handleSortClose = () => {
    dispatch(toggleSortModal(false));
  };

  const handleSortSave = (filters) => {
    dispatch(toggleSortModal(false));
    onFiltersChange(filters);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() !== '') {
      onSearchChange(searchValue);
      setIsSearchSubmitted(true);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setIsSearchSubmitted(false);
    onSearchChange('');
  };

  const initialFilters =
    componentType === 'user_management'
      ? userManagementFilters
      : researchFilters;

  return (
    <div className='search-and-filter-panel'>
      <form onSubmit={handleSearchSubmit} autoComplete='off'>
        <div className='search-input-container'>
          <input
            className='search-input'
            type='text'
            name='searchQuery'
            value={searchValue}
            placeholder='Search'
            autoComplete='off'
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {isSearchSubmitted && (
            <button
              type='button'
              className='search-close-icon'
              onClick={handleClearSearch}
            >
              <img src={closeIcon} alt='close icon' width='16' height='16' />
            </button>
          )}
          <button type='submit' className='search-icon'>
            <img src={searchIcon} alt='search icon' width='16' height='16' />
          </button>
        </div>
      </form>

      {componentType !== 'user_sessions' && (
        <button className='filter-button' onClick={handleFilterClick}>
          <div className='filter-icon'>
            <img src={filterIcon} alt='filter icon' />
          </div>
        </button>
      )}
      {componentType !== 'user_sessions' &&
        componentType !== 'user_management' && (
          <button className='filter-button' onClick={handleSortClick}>
            <div className='filter-icon'>
              <img src={arrowsSortIcon} alt='sort icon' />
            </div>
          </button>
        )}

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={handleFilterClose}
          onApply={handleFilterSave}
          // folderOptions={folderOptions}
          users={users}
          firmsList={firmsList}
          initialFilters={initialFilters}
          componentType={componentType}
        />
      )}
      {isSortModalOpen && (
        <SortModal
          isOpen={isSortModalOpen}
          onClose={handleSortClose}
          onApply={handleSortSave}
          initialFilters={researchSort}
          componentType={componentType}
        />
      )}
    </div>
  );
};

export default SearchAndFilterPanel;
