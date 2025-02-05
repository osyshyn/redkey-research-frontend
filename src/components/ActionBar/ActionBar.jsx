import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFolder, createResearch } from "../../store/slices/researchSlice";
import SearchAndFilterPanel from "../SearchAndFilterPanel/SearchAndFilterPanel";
import CustomButton from "../CustomButton/CustomButton";
import FolderAndResearchModals from "../FolderAndResearchModals/FolderAndResearchModals";

import "./styles.scss";

const ActionBar = ({ onSearchChange, onFiltersChange, onCreateFolder }) => {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadResearchModalOpen, setIsUploadResearchModalOpen] =
    useState(false);

  const dispatch = useDispatch();
  const folders = useSelector((state) => state.research.folders);

  const folderOptions = useMemo(
    () =>
      folders.map((folder) => ({
        value: folder.id,
        label: folder.name,
      })),
    [folders]
  );

  // const handleCreateFolder = useCallback(
  //   (folderName) => {
  //     if (folderName.trim()) {
  //       dispatch(createFolder(folderName));
  //     } else {
  //       // console.log("Incorrect folder name");
  //     }
  //   },
  //   [dispatch]
  // );

  const handleSaveResearchData = useCallback(
    (researchData) => {
      dispatch(createResearch(researchData));
    },
    [dispatch]
  );

  return (
    <div className="action-bar">
      <div className="action-bar-title">
        <h1>Firm name</h1>
      </div>
      <div className="action-bar-controls">
        <SearchAndFilterPanel
          onSearchChange={onSearchChange}
          onFiltersChange={onFiltersChange}
          folderOptions={folderOptions}
        />
        <div className="action-bar-buttons">
          <CustomButton
            label="Create folder"
            style="red-outline"
            onClick={() => setIsCreateFolderModalOpen(true)}
          />
          <CustomButton
            label="Upload research"
            style="red-shadow"
            onClick={() => setIsUploadResearchModalOpen(true)}
          />
        </div>
      </div>

      <FolderAndResearchModals
        isCreateFolderModalOpen={isCreateFolderModalOpen}
        onCloseCreateFolderModal={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={onCreateFolder}
        // onCreateFolder={handleCreateFolder}
        isUploadResearchModalOpen={isUploadResearchModalOpen}
        onCloseUploadResearchModal={() => setIsUploadResearchModalOpen(false)}
        folderOptions={folderOptions}
        // onFileUpload={handleFileUpload}
        onSaveResearchData={handleSaveResearchData}
      />
    </div>
  );
};

export default ActionBar;
