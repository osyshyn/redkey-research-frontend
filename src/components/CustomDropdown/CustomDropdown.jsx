// import React, { useState } from "react";
// import dropdownChevronIcon from "../../assets/icons/dropdown-chevron-icon.svg";

// import "./styles.scss";

// const CustomDropdown = ({
//   label,
//   options,
//   placeholder,
//   onChange,
//   value,
//   showLabel = "",
//   iconComponent: IconComponent = null,
//   filterStyles = "",
// }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleOptionClick = (option) => {
//     onChange(option);
//     setIsOpen(false);
//   };

//   return (
//     <div className="custom-dropdown">
//       {label && (
//         <label className={`custom-dropdown-label ${showLabel}`}>{label}</label>
//       )}
//       <div
//         className={`custom-dropdown-field ${filterStyles}`}
//         onClick={() => setIsOpen((prev) => !prev)}
//       >
//         <div className="dropdown-icon-value-container">
//           {/* {value?.icon && (
//             <>{value?.icon}</>
//           )}   */}
//           {IconComponent && <IconComponent className="filter-icons" />}
//           <span className={`${value ? "value" : "placeholder"}`}>
//             {value?.label || value || placeholder}
//           </span>
//         </div>
//         <img
//           src={dropdownChevronIcon}
//           alt="Dropdown Icon"
//           className={`dropdown-icon ${isOpen ? "open" : ""}`}
//         />
//       </div>
//       {isOpen && (
//         <div className="custom-dropdown-menu">
//           {options.map((option, index) => (
//             <div
//               key={option.value?.id ? option.value.id : option.value || index}
//               className={`custom-dropdown-item ${filterStyles}`}
//               onClick={() => handleOptionClick(option)}
//             >
//               {option.label || option}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomDropdown;

import React, { useState, useEffect, useRef } from "react";
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
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // useEffect(() => {
  //   if (value) {
  //     setInputValue(value.label);
  //   } else {
  //     setInputValue('')
  //   }
  // }, [value]);

  useEffect(() => {
    setInputValue(value?.label || "");
  }, [value]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
    if (!isOpen) setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
    setInputValue(option.label);
    setSearchTerm("");
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      {label && (
        <label className={`custom-dropdown-label ${showLabel}`}>{label}</label>
      )}
      <div className={`custom-dropdown-field ${filterStyles}`}>
        {searchable ? (
          <input
            type="text"
            className="dropdown-search-input"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setIsOpen(true)}
          />
        ) : (
          <div
            className="dropdown-display-value"
            onClick={() => setIsOpen(!isOpen)}
          >
            {IconComponent && <IconComponent className="filter-icons" />}
            <span className={`${value ? "value" : "placeholder"}`}>
              {value?.label || value || placeholder}
            </span>
          </div>
        )}

        {/* <div className="dropdown-icon-value-container">
         
          {IconComponent && <IconComponent className="filter-icons" />}
          <span className={`${value ? "value" : "placeholder"}`}>
            {value?.label || value || placeholder}
          </span>
        </div> */}
        <img
          src={dropdownChevronIcon}
          alt="Dropdown Icon"
          className={`dropdown-icon ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option.value?.id ? option.value.id : option.value || index}
                className={`custom-dropdown-item ${filterStyles}`}
                onClick={() => handleOptionClick(option)}
              >
                {option.label || option}
              </div>
            ))
          ) : (
            <div className="dropdown-no-results">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
