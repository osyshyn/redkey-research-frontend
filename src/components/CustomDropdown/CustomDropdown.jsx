import React, { useState } from "react";
import dropdownChevronIcon from "../../assets/icons/dropdown-chevron-icon.svg";

import "./styles.scss";

const CustomDropdown = ({
  label,
  options,
  placeholder,
  onChange,
  value,
  showLabel = "",
  iconComponent: IconComponent = null,
  filterStyles = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      {label && (
        <label className={`custom-dropdown-label ${showLabel}`}>{label}</label>
      )}
      <div
        className={`custom-dropdown-field ${filterStyles}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="dropdown-icon-value-container">
          {/* {value?.icon && (
            <>{value?.icon}</>
          )}   */}
          {IconComponent && <IconComponent className="filter-icons" />}
          <span className={`${value ? "value" : "placeholder"}`}>
            {value?.label || value || placeholder}
          </span>
        </div>
        <img
          src={dropdownChevronIcon}
          alt="Dropdown Icon"
          className={`dropdown-icon ${isOpen ? "open" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map((option, index) => (
            <div
              key={option.value?.id ? option.value.id : option.value || index}
              className={`custom-dropdown-item ${filterStyles}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label || option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
