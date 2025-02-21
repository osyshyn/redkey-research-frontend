import React from "react";

import "./styles.scss";

const DropdownModalWrapper = ({ position, options }) => {
  return (
    <div
      className="dropdown-folder-menu"
      style={{ top: `${position.top + 8}px`, left: `${position.left}px` }}
    >
      {options.map((option) => {
        const isStatusOption = option.statusName !== undefined;
        const optionName = isStatusOption
          ? option.statusName
          : option.optionName;
        const optionIcon = option.icon;
        const optionHandler = option.onOptionClick;
        const additionalClass = isStatusOption
          ? "status-option"
          : "object-option";
        const isDeleteOption = optionName === "Delete";

        return (
          <div
            key={optionName}
            className={`dropdown-item ${additionalClass} ${
              isDeleteOption ? "delete-option" : ""
            } ${isStatusOption ? option.statusName : ""}`}
            onClick={optionHandler}
          >
            {optionIcon && <>{optionIcon}</>}
            {optionName.charAt(0).toUpperCase() + optionName.slice(1)}
          </div>
        );
      })}
    </div>
  );
};

export default DropdownModalWrapper;
