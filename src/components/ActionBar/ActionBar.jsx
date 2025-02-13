import React from "react";
import SearchAndFilterPanel from "../SearchAndFilterPanel/SearchAndFilterPanel";
import CustomButton from "../CustomButton/CustomButton";
import FolderAndResearchModals from "../FolderAndResearchModals/FolderAndResearchModals";
import NewUserModal from "../NewUserModal/NewUserModal";

import "./styles.scss";

const ActionBar = ({
  title,
  componentType = "",
  searchPanelProps,
  buttons = [],
  modalsProps = {},
}) => {
  return (
    <div className="action-bar">
      <div className="action-bar-title">
        <h1>{title}</h1>
      </div>
      <div className="action-bar-controls">
        <SearchAndFilterPanel
          {...searchPanelProps}
          componentType={componentType}
        />
        <div className="action-bar-buttons">
          {buttons.map((btn, idx) => (
            <CustomButton
              key={idx}
              label={btn.label}
              style={btn.style}
              onClick={btn.onClick}
            />
          ))}
        </div>
      </div>
      {componentType === "admin_portal" && (
        <FolderAndResearchModals {...modalsProps} />
      )}
      {componentType === "user_management" && <NewUserModal {...modalsProps} />}
    </div>
  );
};

export default ActionBar;
