import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import useDeviceType from "../../hooks/useDeviceType";
import { useSelector, useDispatch } from "react-redux";
import { resetCurrentFileId } from "../../store/slices/uploadSlice";
import CustomModal from "../CustomModal/CustomModal";
import CustomInput from "../CustomInput/CustomInput";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";
import FileUpload from "../FileUpload/FileUpload";
import CustomButton from "../CustomButton/CustomButton";
import { reportTypeOptions } from "../../constants/constants";
import { getReportTypeName } from "../../utils/userHelpers";

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
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [selectedFirmFolder, setSelectedFirmFolder] = useState(null);
  const [researchDate, setResearchDate] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isFolderSaveDisabled, setIsFolderSaveDisabled] = useState(true);
  const [isDuplicateWarningOpen, setDuplicateWarningOpen] = useState(false);

  const [folderNameError, setFolderNameError] = useState("");
  const [researchNameError, setResearchNameError] = useState("");

  const [hasFile, setHasFile] = useState(!!editingResearch?.file);

  const dispatch = useDispatch();
  const currentUserDevice = useDeviceType();

  const currentFileId = useSelector((state) => state.upload.currentFileId);
  const firmsList = useSelector((state) => state.firm.firms);

  console.log("currentFileId", currentFileId);

  const firmsListOptions = useMemo(
    () =>
      firmsList.map((firm) => ({
        value: firm.id,
        label: firm.name,
      })),
    [firmsList]
  );

  console.log("editingResearch", editingResearch, folderOptions);

  useEffect(() => {
    if (editingResearch) {
      setResearchTitle(editingResearch.title || "");
      setSelectedFolder(editingResearch.currentFolder || null);
      setSelectedFirm(
        { value: editingResearch.firm.id, label: editingResearch.firm.name } ||
          null
      );
      setResearchDate(
        editingResearch.publication_date
          ? new Date(editingResearch.publication_date)
          : null
      );
      setReportType(getReportTypeName(editingResearch.report_type) || null);
    }
  }, [editingResearch]);

  // useEffect(() => {
  //   const isAllFieldsFilled =
  //     researchTitle.trim() &&
  //       !researchNameError &&
  //       selectedFolder &&
  //       selectedFirm &&
  //       researchDate &&
  //       reportType &&
  //       (currentFileId !== null || hasFile || editingResearch?.file);
  //   setIsSaveDisabled(!isAllFieldsFilled);
  // }, [
  //   researchTitle,
  //   selectedFolder,
  //   selectedFirm,
  //   researchDate,
  //   reportType,
  //   currentFileId,
  // hasFile, editingResearch?.file
  // ]);

  useEffect(() => {
    const isMainFieldsFilled = 
      researchTitle.trim() && 
      !researchNameError && 
      selectedFolder && 
      selectedFirm && 
      researchDate && 
      reportType;
  
    const isFileValid = currentFileId !== null || hasFile;
  
    setIsSaveDisabled(!(isMainFieldsFilled && isFileValid));
  }, [
    researchTitle, 
    researchNameError,
    selectedFolder,
    selectedFirm,
    researchDate,
    reportType,
    currentFileId,
    hasFile
  ]);

  useEffect(() => {
    const isFolderValid =
      folderName.trim().length > 0 && selectedFirmFolder && !folderNameError;
    setIsFolderSaveDisabled(!isFolderValid);
  }, [folderName, selectedFirmFolder, folderNameError]);

  const handleFolderNameChange = (e) => {
    const value = e.target.value;

    if (/^[a-zA-Z0-9 _.,-]*$/.test(value)) {
      setFolderName(value);
      if (value.length > 40) {
        setFolderNameError("Folder name cannot exceed 40 characters.");
      } else {
        setFolderNameError("");
      }
    }
  };
  const handleResearchNameChange = (e) => {
    const value = e.target.value;

    setResearchTitle(value);
    if (value.length > 80) {
      setResearchNameError("Research title cannot exceed 80 characters.");
    } else {
      setResearchNameError("");
    }
  };

  const handleCreateFolder = () => {
    let newFolderName = folderName.trim();
    if (!newFolderName) return;

    const existingFolders = folderOptions.map((folder) => folder.label);

    let index = 1;
    let uniqueName = newFolderName;

    while (existingFolders.includes(uniqueName)) {
      uniqueName = `${newFolderName} (${index++})`;
    }

    onCreateFolder(uniqueName, selectedFirmFolder);
    setFolderName("");
    setSelectedFirmFolder(null);
    onCloseCreateFolderModal();
    if (existingFolders.includes(newFolderName)) {
      setDuplicateWarningOpen(true);
      return;
    }
  };

  const handleSaveResearch = () => {
    if (!currentFileId && !editingResearch?.file) {
      return; 
    }
    const researchData = {
      title: researchTitle,
      companyId: selectedFolder.value,
      firmId: selectedFirm.value,
      date: researchDate,
      reportType: reportType.value,
      fileId: currentFileId || editingResearch?.file?.id,
    };

    if (editingResearch) {
      onUpdateResearchData({ ...researchData, id: editingResearch.id });
    } else {
      onSaveResearchData(researchData);
    }

    setResearchTitle("");
    setSelectedFolder(null);
    setSelectedFirm(null);
    setResearchDate(null);
    setReportType(null);
    dispatch(resetCurrentFileId());
    setHasFile(false);
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
              onChange={handleFolderNameChange}
              error={folderNameError ? true : false}
            />
            {folderNameError && (
              <div className="error-text">{folderNameError}</div>
            )}
            <CustomDropdown
              label="Firm"
              placeholder="Select a firm"
              options={firmsListOptions}
              value={selectedFirmFolder}
              onChange={(option) => setSelectedFirmFolder(option)}
            />
            <div className="modal-actions-button">
              <CustomButton
                label="Create"
                style="red-shadow"
                disabled={isFolderSaveDisabled}
                onClick={handleCreateFolder}
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
              onChange={handleResearchNameChange}
              error={researchNameError ? true : false}
            />
            {researchNameError && (
              <div className="error-text">{researchNameError}</div>
            )}
            <div
              className={`${
                currentUserDevice === "desktop" ? "upload-company-firm" : ""
              }`}
            >
              <CustomDropdown
                label="Company"
                placeholder="Select a company"
                options={folderOptions}
                value={selectedFolder}
                onChange={(option) => setSelectedFolder(option)}
              />
              <CustomDropdown
                label="Firm"
                placeholder="Select a firm"
                options={firmsListOptions}
                value={selectedFirm}
                onChange={(option) => setSelectedFirm(option)}
              />
            </div>
            <div
              className={`${
                currentUserDevice === "desktop" ? "upload-modal-type-date" : ""
              }`}
            >
              <CustomDatePicker
                label="Publication date"
                placeholder="Select a date"
                value={researchDate}
                onChange={(date) => setResearchDate(date)}
              />
              <CustomDropdown
                label="Report type"
                placeholder="Select report type"
                options={reportTypeOptions}
                value={reportType}
                onChange={(option) => setReportType(option)}
              />
            </div>
            <FileUpload existingFile={editingResearch?.file || null}  onFileChange={setHasFile} />

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

      <CustomModal
        isOpen={isDuplicateWarningOpen}
        onClose={() => setDuplicateWarningOpen(false)}
        modalTitle="Duplicate Folder"
      >
        <p>
          A folder with this name already exists. An index will be added
          automatically.
        </p>
      </CustomModal>
    </>
  );
};

export default FolderAndResearchModals;
