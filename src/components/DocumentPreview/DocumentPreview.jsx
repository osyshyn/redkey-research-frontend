import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import useDeviceType from "../../hooks/useDeviceType";
import { handleDownload } from "../../utils/downloadHelpers";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import DownloadIcon from "../../assets/icons/download-icon.svg?react";
import closeIcon from "../../assets/icons/close-icon.svg";
import backMobileIcon from "../../assets/icons/back-mobile-icon.svg";

import "./styles.scss";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const DocumentPreview = ({ showPreview, selectedDocument, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  console.log("selectedDocument", selectedDocument);

  const currentUserDevice = useDeviceType();

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    if (currentUserDevice === "mobile") {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [currentUserDevice]);

  if (currentUserDevice === "mobile") {
    return ReactDOM.createPortal(
      <div className="modal-overlay">
        <div
          className="document-preview-mobile"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-header">
            <div className="mobile-name-wrapper">
              <img
                src={backMobileIcon}
                alt="Back"
                className="back-arrow"
                onClick={onClose}
              />
              <h1 className="title">{selectedDocument.title}</h1>
            </div>
            <DownloadIcon
              alt="Download all"
              className="mobile-view-download-icon"
              onClick={() => {
                handleDownload(selectedDocument);
              }}
            />
          </div>
          <div className="mobile-document-content">
            <div className="document-centered">
              <Document
                file={`${import.meta.env.VITE_API_URL}/${
                  selectedDocument.file.path
                }`}
                onLoadSuccess={onLoadSuccess}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={index} pageNumber={index + 1} scale={0.6} />
                ))}
              </Document>
            </div>
          </div>
        </div>
      </div>,
      document.getElementById("mobile-portal")
    );
  }

  return (
    <div className="document-preview">
      <img
        src={closeIcon}
        alt="Close"
        className="close-icon"
        onClick={onClose}
      />
      <Document
        file={`${import.meta.env.VITE_API_URL}/${selectedDocument.file.path}`}
        onLoadSuccess={onLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={index} pageNumber={index + 1} scale={0.9} />
        ))}
      </Document>
    </div>
  );
};

export default DocumentPreview;
