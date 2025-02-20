import React, { useState, useEffect } from "react";

import CustomModal from "../../CustomModal/CustomModal";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import CustomButton from "../../CustomButton/CustomButton";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";

import closeIconGrey from "../../../assets/icons/close-icon-grey.svg";
import statusFilterIcon from "../../../assets/icons/status-filter-icon.svg";
import companyFilterIcon from "../../../assets/icons/company-filter-icon.svg";
import calendarFilterIcon from "../../../assets/icons/calendar-filter-icon.svg";
import registeredByIcon from "../../../assets/icons/registered-by-icon.svg";

import "./styles.scss";

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  folderOptions = [],
  users,
  firmsList = [],
  initialFilters,
  componentType,
}) => {
  const [additionalFilters, setAdditionalFilters] = useState(
    JSON.parse(JSON.stringify(initialFilters || []))
  );

  const creators = users
    .map((user) => user.creator)
    .filter((creator) => creator !== null)
    .reduce((uniqueCreators, creator) => {
      const exists = uniqueCreators.some((item) => item.id === creator.id);
      if (!exists) {
        uniqueCreators.push(creator);
      }
      return uniqueCreators;
    }, []);

  useEffect(() => {
    if (isOpen) {
      setAdditionalFilters(JSON.parse(JSON.stringify(initialFilters)));
    }
  }, [isOpen, initialFilters]);

  const dropdownFolderOptions = [
    { icon: companyFilterIcon, label: "Companies", value: "companies" },
    { icon: statusFilterIcon, label: "Status", value: "status" },
    { icon: calendarFilterIcon, label: "Initiation date", value: "initiation_date" },
  ];

  const dropdownUserManagementOptions = [
    { icon: registeredByIcon, label: "Registered by", value: "registered_by" },
    { icon: statusFilterIcon, label: "Accesses", value: "accesses" },
  ];

  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Closed", value: "2" },
    { label: "Rejected", value: "3" },
    { label: "Watchlist", value: "4" },
  ];

  const addFilter = () => {
    if (additionalFilters.length < 3) {
      setAdditionalFilters([...additionalFilters, { type: null, value: null }]);
    }
  };

  const removeFilter = (index) => {
    const newFilters = additionalFilters.filter((_, i) => i !== index);
    setAdditionalFilters(newFilters);
    if (newFilters.length === 0) {
      onApply(newFilters);
    }
  };

  const handleFilterTypeChange = (index, option) => {
    const newFilters = additionalFilters.map((filter, i) =>
      i === index ? { ...filter, type: option, value: null } : filter
    );
    setAdditionalFilters(newFilters);
  };

  const handleFilterValueChange = (index, value) => {
    const newFilters = [...additionalFilters];

    if (newFilters[index].type?.value === "initiation_date") {
      newFilters[index].value = value.map((date) =>
        date ? date.toISOString() : null
      );
    } else {
      newFilters[index].value = value;
    }

    setAdditionalFilters(newFilters);
  };

  const handleClearAll = () => {
    setAdditionalFilters([]);
    onApply([]);
  };

  const isApplyDisabled = additionalFilters.some(
    (filter) => !filter.type || !filter.value
  );

  const getAvailableOptions = (currentIndex) => {
    const usedTypes = additionalFilters
      .filter((_, index) => index !== currentIndex)
      .map((filter) => filter.type?.value)
      .filter(Boolean);

    if (componentType === "admin_portal" || componentType === "user_portal") {
      return dropdownFolderOptions.filter(
        (option) =>
          !usedTypes.includes(option.value) ||
          additionalFilters[currentIndex]?.type?.value === option.value
      );
    } else if (componentType === "user_management") {
      return dropdownUserManagementOptions.filter(
        (option) =>
          !usedTypes.includes(option.value) ||
          additionalFilters[currentIndex]?.type?.value === option.value
      );
    }
  };

  const registeredByOptions = creators.map((creator) => ({
    label: `${creator.first_name} ${creator.last_name}`,
    value: creator,
  }));

  const accessOptions = firmsList.map((firm) => ({
    label: firm.name,
    value: firm,
  }));

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
                options={getAvailableOptions(index)}
                value={filter.type}
                onChange={(option) => handleFilterTypeChange(index, option)}
                showLabel="hide-label"
              />

              {filter.type?.value === "initiation_date" ? (
                <CustomDatePicker
                  label={`Filter ${index + 1}`}
                  placeholder="Start date - end date"
                  value={
                    filter.value && filter.value.length
                      ? filter.value
                          .filter((dateStr) => dateStr)
                          .map((dateStr) => new Date(dateStr))
                      : []
                  }
                  onChange={(dates) => handleFilterValueChange(index, dates)}
                  showLabel="date-picker-hide-label"
                  isRange={true}
                />
              ) : (
                <CustomDropdown
                  label={`Filter ${index + 1}`}
                  placeholder="Select filter value"
                  options={
                    filter.type?.value === "status"
                      ? statusOptions
                      : filter.type?.value === "companies"
                      ? folderOptions
                      : filter.type?.value === "registered_by"
                      ? registeredByOptions
                      : filter.type?.value === "accesses"
                      ? accessOptions
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
