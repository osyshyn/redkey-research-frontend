import React from "react";
import ReactDOM from "react-dom";

import "./styles.scss";

const ResearchFilesDropdown = ({ position, options }) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="research-files-menu"
      style={{ top: `${position.top + 8}px`, left: `${position.left}px` }}
    >
      {options.map((option) => {
        const optionName = option.optionName;
        const optionIcon = option.icon;
        const optionHandler = option.onOptionClick;

        return (
          <div
            key={optionName}
            className={"research-files-dropdown-item"}
            onClick={optionHandler}
          >
            {optionIcon && <img src={optionIcon} alt="" />}
            {optionName.charAt(0).toUpperCase() + optionName.slice(1)}
          </div>
        );
      })}
    </div>,
    modalRoot
  );
};

export default ResearchFilesDropdown;
