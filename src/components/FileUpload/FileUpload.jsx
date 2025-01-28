import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadFile,
  deleteFile,
  resetCurrentFileId,
  setCurrentFileId,
} from "../../store/slices/uploadSlice";
import fileUploadIcon from "../../assets/icons/file-upload-icon.svg";
import fileIcon from "../../assets/icons/file-icon.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

import "./styles.scss";

const FileUpload = () => {
  const dispatch = useDispatch();
  const currentFileId = useSelector((state) => state.upload.currentFileId);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setUploadProgress(0);
    const reader = new FileReader();

    reader.onloadstart = () => {
      setUploadProgress(0);
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onloadend = () => {
      setUploadedFile({
        name: file.name,
        content: reader.result,
        size: formatFileSize(file.size),
      });
      setUploadProgress(100);
      setFileUploaded(true);
      console.log(file);

      dispatch(uploadFile(file)).then((response) => {
        if (response.payload?.id) {
          dispatch(setCurrentFileId(response.payload.id));
        }
      });
    };

    reader.readAsDataURL(file);
  };

  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const handleRemoveFile = () => {
    dispatch(deleteFile(currentFileId));
    dispatch(resetCurrentFileId());
    setFileUploaded(false);
  };

  return (
    <div>
      <p className="add-file-label">Add file</p>
      {!fileUploaded && (
        <div
          className={`file-upload ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="fileInput" className="file-upload-label">
            <img
              src={fileUploadIcon}
              alt="Upload Icon"
              className="upload-icon"
            />
            <p className="file-upload-text">
              Drag & drop or click <br /> to choose a file
            </p>
          </label>
        </div>
      )}

      {fileUploaded && (
        <div className="progress-bar-and-title-wrapper">
          <div className="uploaded-file-info">
            <img src={fileIcon} alt="File Icon" className="file-icon" />
            <p className="file-name">
              {uploadedFile.name}
              <span className="uploaded-file-size">({uploadedFile.size})</span>
            </p>
            <img
              src={closeIcon}
              alt="Close Icon"
              className="close-icon"
              onClick={handleRemoveFile}
            />
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="percentage">{uploadProgress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
