import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import CustomModal from "../CustomModal/CustomModal";
import CustomInput from "../CustomInput/CustomInput";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";
import FileUpload from "../FileUpload/FileUpload";
import CustomButton from "../CustomButton/CustomButton";

const FolderAndResearchModals = ({
  isCreateFolderModalOpen = false,
  onCloseCreateFolderModal = () => {},
  onCreateFolder = () => {},

  isUploadResearchModalOpen = false,
  onCloseUploadResearchModal = () => {},
  folderOptions = [],
  onSaveResearchData = () => {},
  onUpdateResearchData = () => {},
  editingResearch = null,
}) => {
  const [folderName, setFolderName] = useState("");
  const [researchTitle, setResearchTitle] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [researchDate, setResearchDate] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const currentFileId = useSelector((state) => state.upload.currentFileId);

  // const REPORT_TYPES = {
  //   INITIATION: 1,
  //   FINAL_REPORT: 2,
  // };
  
  // const reportTypeOptions = [
  //   { value: REPORT_TYPES.INITIATION, label: "Initiation" },
  //   { value: REPORT_TYPES.FINAL_REPORT, label: "Final Report" },
  // ];

  // console.log(editingResearch);
  // console.log('reportType', reportType);
  

  useEffect(() => {
    if (editingResearch) {
      setResearchTitle(editingResearch.title || "");
      setSelectedFolder(editingResearch.currentFolder || null);
      setResearchDate(
        editingResearch.publication_date
          ? new Date(editingResearch.publication_date)
          : null
      );
      setReportType(editingResearch.report_type || null);
    }
  }, [editingResearch]);

  useEffect(() => {
    const isAllFieldsFilled =
      (researchTitle.trim() &&
        selectedFolder &&
        researchDate &&
        reportType &&
        currentFileId !== null) ||
      editingResearch?.file;
    setIsSaveDisabled(!isAllFieldsFilled);
  }, [researchTitle, selectedFolder, researchDate, reportType, currentFileId]);
  

  const handleSaveResearch = () => {
    const researchData = {
      title: researchTitle,
      companyId: selectedFolder.value,
      date: researchDate,
      reportType: reportType,
      fileId: currentFileId || editingResearch?.file?.id,
    };

    if (editingResearch) {
      onUpdateResearchData({ ...researchData, id: editingResearch.id });
    } else {
      onSaveResearchData(researchData);
    }

    setResearchTitle("");
    setSelectedFolder(null);
    setResearchDate(null);
    setReportType(null);
    onCloseUploadResearchModal();
  };

  const modalRoot = document.getElementById("modal-root");

  return (
    <>
      {modalRoot &&
        ReactDOM.createPortal(
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
          </CustomModal>,
          modalRoot
        )}

      {modalRoot &&
        ReactDOM.createPortal(
          <CustomModal
            isOpen={isUploadResearchModalOpen}
            onClose={onCloseUploadResearchModal}
            modalTitle={editingResearch ? "Edit Research" : "Upload Research"}
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
                // options={reportTypeOptions}
                // options={['Initiation', 'Final Report']}
                value={reportType}
                onChange={(option) => setReportType(option)}
              />
            </div>
            <FileUpload existingFile={editingResearch?.file || null} />

            <div className="modal-actions-button">
              <CustomButton
                label="Save"
                style="red-shadow"
                onClick={handleSaveResearch}
                disabled={isSaveDisabled}
              />
            </div>
          </CustomModal>,
          modalRoot
        )}
    </>
  );
};

export default FolderAndResearchModals;
