import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomModal from "../CustomModal/CustomModal";
import CustomInput from "../CustomInput/CustomInput";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";
import FileUpload from "../FileUpload/FileUpload";
import CustomButton from "../CustomButton/CustomButton";

const FolderAndResearchModals = ({
  isCreateFolderModalOpen,
  onCloseCreateFolderModal,
  onCreateFolder,

  isUploadResearchModalOpen,
  onCloseUploadResearchModal,
  folderOptions,
  onSaveResearchData,
}) => {
  const [folderName, setFolderName] = useState("");
  const [researchTitle, setResearchTitle] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [researchDate, setResearchDate] = useState(null);
  const [reportType, setReportType] = useState(null);
  // const [uploadedFile, setUploadedFile] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const currentFileId = useSelector((state) => state.upload.currentFileId);

  useEffect(() => {
    const isAllFieldsFilled =
      researchTitle.trim() &&
      selectedFolder &&
      researchDate &&
      reportType &&
      currentFileId !== null;
    setIsSaveDisabled(!isAllFieldsFilled);
  }, [researchTitle, selectedFolder, researchDate, reportType, currentFileId]);

  const handleSaveResearch = () => {
    const researchData = {
      title: researchTitle,
      companyId: selectedFolder.value,
      date: researchDate,
      reportType: reportType,
      fileId: currentFileId,
    };

    onSaveResearchData(researchData);

    setResearchTitle("");
    setSelectedFolder(null);
    setResearchDate(null);
    setReportType(null);
    // setUploadedFile(null);
    onCloseUploadResearchModal();
  };

  return (
    <>
      {/* Create Folder Modal */}
      <CustomModal
        isOpen={isCreateFolderModalOpen}
        onClose={onCloseCreateFolderModal}
        modalTitle="Create Folder"
      >
        <CustomInput
          label="Folder name"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <div className="modal-actions-button">
          <CustomButton
            label="Create"
            style="red-shadow"
            onClick={() => {
              onCreateFolder(folderName);
              setFolderName("");
              onCloseCreateFolderModal();
            }}
          />
        </div>
      </CustomModal>

      {/* Upload Research Modal */}
      <CustomModal
        isOpen={isUploadResearchModalOpen}
        onClose={onCloseUploadResearchModal}
        modalTitle="Upload Research"
      >
        <CustomInput
          label="Title"
          placeholder="Enter research title"
          value={researchTitle}
          onChange={(e) => setResearchTitle(e.target.value)}
        />
        <CustomDropdown
          label="Company"
          placeholder="Select a company"
          options={folderOptions}
          value={selectedFolder}
          onChange={(option) => setSelectedFolder(option)}
        />
        <div className="upload-modal-type-date">
          <CustomDatePicker
            label="Publication date"
            placeholder="Select a date"
            value={researchDate}
            onChange={(date) => setResearchDate(date)}
          />
          <CustomDropdown
            label="Report type"
            placeholder="Select report type"
            options={[1, 2]}
            value={reportType}
            onChange={(option) => setReportType(option)}
          />
        </div>
        <FileUpload />
        <div className="modal-actions-button">
          <CustomButton
            label="Save"
            style="red-shadow"
            onClick={handleSaveResearch}
            disabled={isSaveDisabled}
          />
        </div>
      </CustomModal>
    </>
  );
};

export default FolderAndResearchModals;
