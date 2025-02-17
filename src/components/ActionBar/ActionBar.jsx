import React, { useState } from "react";
import SearchAndFilterPanel from "../SearchAndFilterPanel/SearchAndFilterPanel";
import CustomButton from "../CustomButton/CustomButton";
import FolderAndResearchModals from "../FolderAndResearchModals/FolderAndResearchModals";
import NewUserModal from "../NewUserModal/NewUserModal";
import FirmsModal from "../FirmsModal/FirmsModal";

import "./styles.scss";

const ActionBar = ({
  title,
  componentType = "",
  searchPanelProps,
  buttons = [],
  modalsProps = {},
}) => {
  const [isFirmsModalOpen, setIsFirmsModalOpen] = useState(false);
  return (
    <>
      <div className="action-bar">
        <div className="action-bar-title">
          <h1>{title}</h1>
        </div>
        <div className={`action-bar-controls ${componentType}`}>
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
        {componentType === "user_management" && (
          <NewUserModal {...modalsProps} />
        )}
      </div>
      {componentType === "admin_portal" && (
        <div className="firm-button">
          <CustomButton
            label="+ Add/remove research team"
            style="red-outline"
            onClick={() => {
              setIsFirmsModalOpen(true);
            }}
          />
        </div>
      )}

      {isFirmsModalOpen && (
        <FirmsModal
          isOpen={isFirmsModalOpen}
          onClose={() => setIsFirmsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ActionBar;
