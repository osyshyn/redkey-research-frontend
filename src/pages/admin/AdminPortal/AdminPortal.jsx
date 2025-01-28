import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFolders } from "../../../store/slices/researchSlice";
import Header from "../../../components/Header/Header";
import FolderWrapper from "../../../components/FolderWrapper/FolderWrapper";
import FolderInnerList from "../../../components/FolderInnerList/FolderInnerList";
import ActionBar from "../../../components/ActionBar/ActionBar";
import closeIcon from "../../../assets/icons/close-icon.svg";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import "./styles.scss";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const AdminPortal = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

  const dispatch = useDispatch();

  const { folders, status } = useSelector((state) => state.research);

  useEffect(() => {
    if (folders.length === 0 && status !== "loading") {
      dispatch(getFolders());
    }
  }, [dispatch, folders, status]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleFiltersChange = (newFilters) => {
    // no provided filers yet
  };

  const handleViewClick = (item) => {
    setSelectedDocument(item);
    setShowPreview(true);
  };

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <>
      <Header />
      <ActionBar
        onSearchChange={handleSearchChange}
        onFiltersChange={handleFiltersChange}
      />
      <div className="folders-and-document-container">
        <div className="folders-container">
          {folders.map((folder, index) => (
            <FolderWrapper
              key={index}
              title={folder.name}
              folderId={folder.id}
              itemsAmount={folder.research.length}
              status={folder.status}
            >
              <FolderInnerList
                tableData={folder.research}
                handleViewClick={handleViewClick}
              />
            </FolderWrapper>
          ))}
        </div>
        {showPreview &&
          selectedDocument &&
          selectedDocument?.file?.type === "file" && (
            <div className="document-preview">
              <img
                src={closeIcon}
                alt="Close"
                className="close-icon"
                onClick={closePreview}
              />
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
          )}
      </div>
    </>
  );
};

export default AdminPortal;
