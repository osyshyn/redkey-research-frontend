import React, { useState } from "react";
import dropdownChevronIcon from "../../assets/icons/dropdown-chevron-icon.svg";

import "./styles.scss";

const CustomDropdown = ({ label, options, placeholder, onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      {label && <label className="custom-dropdown-label">{label}</label>}
      <div
        className="custom-dropdown-field"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={`${value ? "value" : "placeholder"}`}>
          {value?.label || value || placeholder}
        </span>
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
              key={option.value || index}
              className="custom-dropdown-item"
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
