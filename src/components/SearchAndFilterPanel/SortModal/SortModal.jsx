import React, { useState, useEffect } from 'react';
import CustomModal from '../../CustomModal/CustomModal';
import CustomDropdown from '../../CustomDropdown/CustomDropdown';
import CustomButton from '../../CustomButton/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFolderSort,
  setResearchSort,
  clearFolderSort,
  clearResearchSort,
} from '../../../store/slices/filterSlice';

const SortModal = ({ isOpen, onClose, currentSort }) => {
  const dispatch = useDispatch();
  const [sortType, setSortType] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const isFolderSort = currentSort?.hasOwnProperty('folderSort');
  const sortConfig = isFolderSort
    ? useSelector((state) => state.filters.folderSort)
    : useSelector((state) => state.filters.researchSort);

  const sortOptions = [
    { value: 'initiation_date', label: 'Initiation Date' },
    { value: 'publication_date', label: 'Publication Date' },
  ];

  const directionOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
  ];

  useEffect(() => {
    if (isOpen) {
      setSortType(sortConfig?.type || null);
      setSortDirection(sortConfig?.direction || null);
    }
  }, [isOpen, sortConfig]);

  const handleApply = () => {
    if (!sortType || !sortDirection) return;

    const config = { type: sortType, direction: sortDirection };

    isFolderSort
      ? dispatch(setFolderSort(config))
      : dispatch(setResearchSort(config));

    onClose();
  };

  const handleClear = () => {
    setSortType(null);
    setSortDirection(null);

    isFolderSort ? dispatch(clearFolderSort()) : dispatch(clearResearchSort());
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} modalTitle='Sort by'>
      <div className='filter-modal-clear-all'>
        <p className='clear-all' onClick={handleClear}>
          Clear all
        </p>
      </div>
      <div className='filter-modal-body'>
        <div className='all-filters'>
          <div className='filter-option'>
            <CustomDropdown
              label='Sort type'
              showLabel='hide-label'
              placeholder='Select sort type'
              options={sortOptions}
              value={sortOptions.find((o) => o.value === sortType)}
              onChange={(option) => {
                setSortType(option?.value);
                setSortDirection(null);
              }}
            />

            <CustomDropdown
              label='Sort direction'
              showLabel='hide-label'
              placeholder='Select direction'
              options={directionOptions}
              value={directionOptions.find((o) => o.value === sortDirection)}
              onChange={(option) => setSortDirection(option?.value)}
              isDisabled={!sortType}
            />
          </div>
        </div>
      </div>

      <div className='filter-modal-footer'>
        <CustomButton
          label='Apply Sorting'
          style='red-shadow'
          onClick={handleApply}
          disabled={!sortType || !sortDirection}
        />
      </div>
    </CustomModal>
  );
};

export default SortModal;
