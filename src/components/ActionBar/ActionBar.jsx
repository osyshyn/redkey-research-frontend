import React, { useState } from "react";
import useDeviceType from "../../hooks/useDeviceType";
import SearchAndFilterPanel from "../SearchAndFilterPanel/SearchAndFilterPanel";
import CustomButton from "../CustomButton/CustomButton";
import FolderAndResearchModals from "../FolderAndResearchModals/FolderAndResearchModals";
import NewUserModal from "../NewUserModal/NewUserModal";
import FirmsModal from "../FirmsModal/FirmsModal";
import MobileModalWrapper from "../MobileModalWrapper/MobileModalWrapper";

// import MobileActionAddIcon from "../../assets/icons/mobile-action-add-button.svg?react";
// import FileUploadIcon from "../../assets/icons/file-upload-icon.svg?react";
// import FolderIcon from "../../assets/icons/folder-icon.svg?react";

import "./styles.scss";

const ActionBar = ({
  title,
  componentType = "",
  searchPanelProps,
  buttons = [],
  mobileButton = {},
  modalsProps = {},
  adminDesktopAddFirmProps = {},
}) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mobileActionAddData, setMobileActionAddData] = useState({
    options: [],
  });

  const { setIsFirmsModalOpen } = adminDesktopAddFirmProps;

  const currentUserDevice = useDeviceType();
  console.log("currentUserDevice", currentUserDevice, buttons);

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
          {/* desktop buttons */}
          {currentUserDevice === "desktop" && (
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
          )}
          {/* mobile buttons */}
          {currentUserDevice === "mobile" &&
            componentType !== "user_portal" && (
              <CustomButton
                label={mobileButton.label}
                style={mobileButton.style}
                onClick={mobileButton.onClick}
              />
            )}
        </div>
        {componentType === "admin_portal" && (
          <FolderAndResearchModals {...modalsProps} />
        )}
        {componentType === "user_management" && (
          <NewUserModal {...modalsProps} />
        )}
      </div>
      {currentUserDevice === "desktop" && componentType === "admin_portal" && (
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

      {currentUserDevice === "mobile" && (
        <MobileModalWrapper
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        >
          <div className="mobile-options-list">
            {mobileActionAddData.options?.map((option) => (
              <div
                key={option.optionName}
                className={`mobile-option-item ${
                  option.optionName === "Delete" ? "delete-option" : ""
                }`}
                onClick={option.onOptionClick}
              >
                {option.icon}
                <span>{option.optionName}</span>
              </div>
            ))}
          </div>
        </MobileModalWrapper>
      )}
    </>
  );
};

export default ActionBar;
