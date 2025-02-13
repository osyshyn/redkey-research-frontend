import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  deleteFolder,
  changeFolderStatus,
} from "../../store/slices/researchSlice";

import FolderHeader from "./FolderHeader/FolderHeader";
import DropdownModalWrapper from "../DropdownModalWrapper/DropdownModalWrapper";
import DeleteModal from "../DeleteModal/DeleteModal";

import { FOLDER_STATUSES } from "../../constants/constants";
import { getStatusName } from "../../utils/userHelpers";

import settingsIconDropdown from "../../assets/icons/settings-icon-dropdown.svg";
import deleteIconRed from "../../assets/icons/delete-icon-red.svg";

import "./styles.scss";

const FolderWrapper = ({
  title,
  folderId,
  itemsAmount,
  status,
  children,
  componentType,
}) => {
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [statusDropdownPosition, setStatusDropdownPosition] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);

  const statusOptions = [
    { value: FOLDER_STATUSES.ACTIVE, label: "active" },
    { value: FOLDER_STATUSES.CLOSED, label: "closed" },
    { value: FOLDER_STATUSES.REJECTED, label: "rejected" },
    { value: FOLDER_STATUSES.WATCHLIST, label: "watchlist" },
  ];

  const folderMoreIconRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const dispatch = useDispatch();

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
  };

  const handleChangeStatusClick = (e) => {
    const position = e.target.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setStatusDropdownPosition({
      top: position.bottom + scrollTop,
      left: position.left,
    });
    setActiveDropdown("status");
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
      />

      <div className={`folder-contents ${isFolderOpen ? "open" : "closed"}`}>
        {isFolderOpen && children}
      </div>

      {activeDropdown === "folderMoreIcon" && dropdownPosition && (
        <div ref={folderMoreIconRef}>
          <DropdownModalWrapper
            position={dropdownPosition}
            options={[
              {
                optionName: "Change status",
                icon: settingsIconDropdown,
                onOptionClick: handleChangeStatusClick,
              },
              {
                optionName: "Delete",
                icon: deleteIconRed,
                onOptionClick: () => setIsDeleteFolderModalOpen(true),
              },
            ]}
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
