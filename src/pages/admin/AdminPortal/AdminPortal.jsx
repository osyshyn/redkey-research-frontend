import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getFolders,
  createFolder,
  createResearch,
} from "../../../store/slices/researchSlice";
import {
  setResearchFilters,
  clearResearchFilters,
} from "../../../store/slices/filterSlice";
import { getFirms } from "../../../store/slices/firmSlice";
import Header from "../../../components/Header/Header";
import FolderWrapper from "../../../components/FolderWrapper/FolderWrapper";
import FolderInnerList from "../../../components/FolderInnerList/FolderInnerList";
import Pagination from "../../../components/Pagination/Pagination";
import ActionBar from "../../../components/ActionBar/ActionBar";
import Loader from "../../../components/Loader/Loader";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadResearchModalOpen, setIsUploadResearchModalOpen] =
    useState(false);

  const dispatch = useDispatch();

  const { folders, foldersStatus } = useSelector((state) => state.research);

  const { researchFilters } = useSelector((state) => state.filters);
  const currentFirm = useSelector((state) => state.firm.currentFirm);

  useEffect(() => {
    dispatch(getFirms());
  }, [dispatch]);

  

  const folderOptions = useMemo(
    () =>
      folders.map((folder) => ({
        value: folder.id,
        label: folder.name,
      })),
    [folders]
  );

  const handleSaveResearchData = useCallback(
    (researchData) => {
      dispatch(createResearch(researchData));
    },
    [dispatch]
  );

  const filteredFolders = folders
    .filter((folder) => {
      return researchFilters.every((filter) => {
        const filterType = filter.type.value;
        const filterValue = filter.value.value;

        if (filterType === "status") {
          return folder.status.toString() === filterValue.toString();
        }

        if (filterType === "companies") {
          return folder.id.toString() === filterValue.toString();
        }

        return true;
      });
    })
    .map((folder) => {
      const filteredResearch = folder.research.filter((research) => {
        return researchFilters.every((filter) => {
          if (filter.type.value === "initiation_date") {
            const [startDate, endDate] = filter.value.map(
              (dateStr) => new Date(dateStr)
            );
            const publicationDate = new Date(research.publication_date);
            return publicationDate >= startDate && publicationDate <= endDate;
          }
          return true;
        });
      });

      return { ...folder, research: filteredResearch };
    })
    .filter((folder) => {
      const hasDueDateFilter = researchFilters.some(
        (filter) => filter.type.value === "initiation_date"
      );
      return hasDueDateFilter ? folder.research.length > 0 : true;
    });

  const searchInFilteredFolders = searchValue
    ? filteredFolders
        .map((folder) => ({
          ...folder,
          research: folder.research.filter((item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase())
          ),
        }))
        .filter((folder) => folder.research.length > 0)
    : filteredFolders;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFolders = searchInFilteredFolders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    if (folders.length === 0 && foldersStatus !== "loading") {
      dispatch(getFolders());
    }
  }, [dispatch, folders, foldersStatus]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleFiltersChange = (newFilters) => {
    dispatch(setResearchFilters(newFilters));
    setCurrentPage(1);
  };

  const handleCreateFolder = useCallback(
    (folderName) => {
      if (folderName.trim()) {
        dispatch(clearResearchFilters());
        dispatch(createFolder(folderName));
      }
    },
    [dispatch]
  );

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
      title={
  currentFirm?.name === "All"
    ? "All Researches"
    : `${currentFirm?.name.charAt(0).toUpperCase() + currentFirm?.name.slice(1)} Research`
}

        componentType={"admin_portal"}
        searchPanelProps={{
          onSearchChange: handleSearchChange,
          onFiltersChange: handleFiltersChange,
          folderOptions: folderOptions,
        }}
        buttons={[
          {
            label: "Create folder",
            style: "red-outline",
            onClick: () => setIsCreateFolderModalOpen(true),
          },
          {
            label: "Upload research",
            style: "red-shadow",
            onClick: () => setIsUploadResearchModalOpen(true),
          },
        ]}
        modalsProps={{
          isCreateFolderModalOpen,
          onCloseCreateFolderModal: () => setIsCreateFolderModalOpen(false),
          onCreateFolder: handleCreateFolder,
          isUploadResearchModalOpen,
          onCloseUploadResearchModal: () => setIsUploadResearchModalOpen(false),
          folderOptions,
          onSaveResearchData: handleSaveResearchData,
        }}
      />
      {foldersStatus === "loading" ? (
        <Loader />
      ) : (
        <>
          <div className="folders-and-document-container">
            <div className="folders-container">
              {currentFolders.length > 0 ? (
                currentFolders.map((folder, index) => (
                  <FolderWrapper
                    key={index}
                    title={folder.name}
                    folderId={folder.id}
                    // itemsAmount={folder.research.length}
                    itemsAmount={
                      currentFirm?.name === "All"
                        ? folder?.research?.length
                        : folder?.research?.filter(
                            (researchItem) =>
                              researchItem?.firm?.id === currentFirm?.id &&
                              researchItem?.firm?.name === currentFirm?.name
                          ).length
                    }
                    status={folder.status}
                    componentType={"admin_portal"}
                  >
                    <FolderInnerList
                      // tableData={folder.research.filter(
                      //   (researchItem) =>
                      //     (researchItem?.firm?.id === currentFirm?.id &&
                      //     researchItem?.firm?.name === currentFirm?.name)
                      // )}
                      tableData={
                        currentFirm?.name === "All"
                          ? folder?.research
                          : folder?.research?.filter(
                              (researchItem) =>
                                researchItem?.firm?.id === currentFirm?.id &&
                                researchItem?.firm?.name === currentFirm?.name
                            ) || [folder.research[0]]
                      }
                      currentFolder={{ value: folder.id, label: folder.name }}
                      handleViewClick={handleViewClick}
                    />
                  </FolderWrapper>
                ))
              ) : (
                <p className="no-folders-message">
                  No folders available to display
                </p>
              )}
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
                      <Page key={index} pageNumber={index + 1} scale={0.9} />
                    ))}
                  </Document>
                </div>
              )}
          </div>

          {currentFolders.length >= 1 && (
            <div className="pagination-wrapper">
              <Pagination
                currentPage={currentPage}
                totalItems={searchInFilteredFolders.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[3, 6, 10]}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminPortal;
