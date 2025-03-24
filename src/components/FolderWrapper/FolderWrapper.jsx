import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  deleteFolder,
  changeFolderStatus,
} from "../../store/slices/researchSlice";

import useDeviceType from "../../hooks/useDeviceType";

import FolderHeader from "./FolderHeader/FolderHeader";
import DropdownModalWrapper from "../DropdownModalWrapper/DropdownModalWrapper";
import DeleteModal from "../DeleteModal/DeleteModal";
import MobileModalWrapper from "../MobileModalWrapper/MobileModalWrapper";

import { statusOptions } from "../../constants/constants";
import { getStatusName } from "../../utils/userHelpers";

import SettingsIconDropdown from "../../assets/icons/settings-icon-dropdown.svg?react";
import DeleteIconRed from "../../assets/icons/delete-icon-red.svg?react";

import "./styles.scss";

const FolderWrapper = ({
  title,
  folderId,
  itemsAmount,
  status,
  children,
  componentType,
  stockTicker,
  earliestResearchDate
}) => {
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [statusDropdownPosition, setStatusDropdownPosition] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);
  const [isMobileMoreModalOpen, setIsMobileMoreModalOpen] = useState(false);
  const [isMobileChangeStatusModalOpen, setIsMobileChangeStatusModalOpen] =
    useState(false);

  const folderMoreIconRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const dispatch = useDispatch();

  const currentUserDevice = useDeviceType();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        activeDropdown === "folderMoreIcon" &&
        folderMoreIconRef.current &&
        !folderMoreIconRef.current.contains(e.target)
      ) {
        setActiveDropdown(null);
        setDropdownPosition(null);
      }

      if (
        activeDropdown === "status" &&
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target)
      ) {
        setActiveDropdown(null);
        setStatusDropdownPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const handleFolderToggle = () => {
    setIsFolderOpen((prevState) => !prevState);
  };

  const handleMoreClick = (e) => {
    if (currentUserDevice === "desktop") {
      const position = e.target.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setDropdownPosition({
        top: position.bottom + scrollTop,
        left: position.left,
      });
      setActiveDropdown(
        activeDropdown === "folderMoreIcon" ? null : "folderMoreIcon"
      );
      setStatusDropdownPosition(null);
    }
    if (currentUserDevice === "mobile") {
      setIsMobileMoreModalOpen(true);
    }
  };

  const handleChangeStatusClick = (e) => {
    if (currentUserDevice === "desktop") {
      const position = e.target.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setStatusDropdownPosition({
        top: position.bottom + scrollTop,
        left: position.left,
      });
      setActiveDropdown("status");
    }
    if (currentUserDevice === "mobile") {
      setIsMobileMoreModalOpen(false);
      setIsMobileChangeStatusModalOpen(true);
    }
  };

  const handleDeleteFolder = () => {
    dispatch(deleteFolder(folderId));
  };

  const handleChangeStatus = (newStatus, folderId) => {
    const folderInfo = {
      id: folderId,
      status: newStatus,
    };

    dispatch(changeFolderStatus(folderInfo));
    setActiveDropdown(null);
    setStatusDropdownPosition(null);
  };

  const filteredStatusOptions = statusOptions
    .filter((status) => status.value !== currentStatus)
    .map((status) => ({
      statusName: status.label,
      onOptionClick: () => handleChangeStatus(status.value, folderId),
    }));

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const folderMoreActionsOptions = [
    {
      optionName: "Change status",
      icon: <SettingsIconDropdown className="dropdown-menu-icon" />,
      onOptionClick: handleChangeStatusClick,
    },
    {
      optionName: "Delete",
      icon: <DeleteIconRed className="dropdown-menu-icon-red" />,
      onOptionClick: () => setIsDeleteFolderModalOpen(true),
    },
  ];

  return (
    <div className="folder-wrapper">
      <FolderHeader
        title={title}
        itemsAmount={itemsAmount}
        currentStatus={getStatusName(currentStatus)}
        onFolderToggle={handleFolderToggle}
        onMoreClick={handleMoreClick}
        isFolderOpen={isFolderOpen}
        folderMoreIconRef={folderMoreIconRef}
        componentType={componentType}
        stockTicker={stockTicker}
        earliestResearchDate={earliestResearchDate}
      />

      <div className={`folder-contents ${isFolderOpen ? "open" : "closed"}`}>
        {isFolderOpen && children}
      </div>

      {activeDropdown === "folderMoreIcon" && dropdownPosition && (
        <div ref={folderMoreIconRef}>
          <DropdownModalWrapper
            position={dropdownPosition}
            options={folderMoreActionsOptions}
          />
        </div>
      )}

      {activeDropdown === "status" && statusDropdownPosition && (
        <div ref={statusDropdownRef}>
          <DropdownModalWrapper
            position={statusDropdownPosition}
            options={filteredStatusOptions}
          />
        </div>
      )}

      {/* Mobile open folder more modal */}
      {currentUserDevice === "mobile" && isMobileMoreModalOpen && (
        <MobileModalWrapper
          isOpen={isMobileMoreModalOpen}
          onClose={() => setIsMobileMoreModalOpen(false)}
        >
          <div className="mobile-options-list">
            {folderMoreActionsOptions.map((option) => (
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

      {/* Mobile change status */}
      {currentUserDevice === "mobile" && isMobileChangeStatusModalOpen && (
        <MobileModalWrapper
          isOpen={isMobileChangeStatusModalOpen}
          onClose={() => setIsMobileChangeStatusModalOpen(false)}
        >
          <div className="mobile-statuses-list">
            {filteredStatusOptions.map((status) => (
              <div
                key={status.statusName}
                className={`mobile-status-item ${
                  status.statusName !== undefined ? status.statusName : ""
                }`}
                onClick={status.onOptionClick}
              >
                <span>{status.statusName}</span>
              </div>
            ))}
          </div>
        </MobileModalWrapper>
      )}

      <DeleteModal
        isOpen={isDeleteFolderModalOpen}
        onClose={() => setIsDeleteFolderModalOpen(false)}
        itemToDelete="the folder"
        deleteButtonTitle="Delete folder"
        onDelete={handleDeleteFolder}
      />
    </div>
  );
};

export default FolderWrapper;
