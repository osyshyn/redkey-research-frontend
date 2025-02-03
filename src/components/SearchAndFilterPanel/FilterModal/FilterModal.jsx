import React, { useState } from "react";
import CustomModal from "../../CustomModal/CustomModal";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import CustomButton from "../../CustomButton/CustomButton";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";
import closeIconGrey from "../../../assets/icons/close-icon-grey.svg";

import "./styles.scss";

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [additionalFilters, setAdditionalFilters] = useState([]);

  const dropdownOptions = [
    { label: "Companies", value: "companies" },
    { label: "Status", value: "status" },
    { label: "Due date", value: "due_date" },
  ];

  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Closed", value: "2" },
    { label: "Rejected", value: "3" },
    { label: "Watchlist", value: "4" },
  ];

  const companiesOptions = [
    { label: "Company A", value: "companyA" },
    { label: "Company B", value: "companyB" },
    { label: "Company C", value: "companyC" },
  ];

  console.log(additionalFilters);

  const addFilter = () => {
    if (additionalFilters.length < 3) {
      setAdditionalFilters([...additionalFilters, { type: null, value: null }]);
    }
  };

  const removeFilter = (index) => {
    const newFilters = [...additionalFilters];
    newFilters.splice(index, 1);
    setAdditionalFilters(newFilters);
  };

  const handleFilterTypeChange = (index, option) => {
    const newFilters = [...additionalFilters];
    newFilters[index] = { type: option, value: null };
    setAdditionalFilters(newFilters);
  };

  const handleFilterValueChange = (index, value) => {
    const newFilters = [...additionalFilters];
    newFilters[index].value = value;
    setAdditionalFilters(newFilters);
  };

  const handleClearAll = () => {
    const newFilters = additionalFilters.map((filter) => ({
      ...filter,
      value: null,
    }));
    setAdditionalFilters(newFilters);
  };

  const isApplyDisabled = additionalFilters.some(
    (filter) => !filter.type || !filter.value
  );

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} modalTitle="Filters">
      {additionalFilters.length > 0 && (
        <div className="filter-modal-clear-all">
          <p className="clear-all" onClick={handleClearAll}>
            Clear all
          </p>
        </div>
      )}

      <div className="filter-modal-body">
        <div className="all-filters">
          {additionalFilters.map((filter, index) => (
            <div key={index} className="filter-option">
              <CustomDropdown
                label={`Filter ${index + 1}`}
                placeholder="Select filter type"
                options={dropdownOptions}
                value={filter.type}
                onChange={(option) => handleFilterTypeChange(index, option)}
                showLabel="hide-label"
              />

              {filter.type && filter.type.value === "due_date" ? (
                <CustomDatePicker
                  label={`Filter ${index + 1}`}
                  placeholder="Select due date"
                  value={filter.value}
                  onChange={(date) => handleFilterValueChange(index, date)}
                />
              ) : (
                <CustomDropdown
                  label={`Filter ${index + 1}`}
                  placeholder="Select filter value"
                  options={
                    filter.type
                      ? filter.type.value === "status"
                        ? statusOptions
                        : filter.type.value === "companies"
                        ? companiesOptions
                        : []
                      : []
                  }
                  value={filter.value}
                  onChange={(option) => handleFilterValueChange(index, option)}
                  showLabel="hide-label"
                />
              )}

              <img
                src={closeIconGrey}
                alt="Delete filter option"
                className="delete-filter-option-icon"
                onClick={() => removeFilter(index)}
              />
            </div>
          ))}
          {additionalFilters.length < 3 && (
            <p className="add-filter-button" onClick={addFilter}>
              + Add filter
            </p>
          )}
        </div>
      </div>

      {additionalFilters.length > 0 && (
        <div className="filter-modal-footer">
          <div>
            <CustomButton
              label="Apply Filters"
              style="red-shadow"
              onClick={() => onApply(additionalFilters)}
              disabled={isApplyDisabled}
            />
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default FilterModal;
