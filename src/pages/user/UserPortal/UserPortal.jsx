import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFolders } from "../../../store/slices/researchSlice";
import { setResearchFilters } from "../../../store/slices/filterSlice";
import { getFirms, setCurrentFirm } from "../../../store/slices/firmSlice";
import Header from "../../../components/Header/Header";
import FolderWrapper from "../../../components/FolderWrapper/FolderWrapper";
import FolderInnerListUser from "../../../components/FolderInnerListUser/FolderInnerListUser";
import Pagination from "../../../components/Pagination/Pagination";
import ActionBar from "../../../components/ActionBar/ActionBar";
import Loader from "../../../components/Loader/Loader";
import UserSubscriptionModal from "../../../components/UserSubscriptionModal/UserSubscriptionModal";
import DocumentPreview from "../../../components/DocumentPreview/DocumentPreview";

import closeIcon from "../../../assets/icons/close-icon.svg";

// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

import "./styles.scss";

// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const UserPortal = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  // const [numPages, setNumPages] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const dispatch = useDispatch();

  const { folders, foldersStatus } = useSelector((state) => state.research);
  const { researchFilters } = useSelector((state) => state.filters);
  const user = useSelector((state) => state.auth.user);
  const currentFirm = useSelector((state) => state.firm.currentFirm);

  console.log("USER", user);

  useEffect(() => {
    dispatch(getFirms());
  }, [dispatch]);

  useEffect(() => {
    if (currentFirm) {
      const hasAccess = user?.access?.some(
        (access) => access.firm.id === currentFirm.id && access.value === true
      );
      if (hasAccess) {
        setShowAccessDenied(false);
      } else if (!hasAccess) {
        setShowAccessDenied(true);
        // dispatch(setCurrentFirm(null));
      }
    }
  }, [currentFirm, user]);

  const folderOptions = useMemo(
    () =>
      folders.map((folder) => ({
        value: folder.id,
        label: folder.name,
      })),
    [folders]
  );

  const foldersFilteredByFirm = folders.filter(
    (folder) => folder?.firm.id === currentFirm?.id
  );

  const filteredFolders = foldersFilteredByFirm
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
    if (foldersStatus === "idle") {
      dispatch(getFolders());
    }
  }, [dispatch, foldersStatus]);

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

  const handleViewClick = (item) => {
    setSelectedDocument(item);
    setShowPreview(true);
  };

  // const onLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages);
  // };

  const closePreview = () => {
    setShowPreview(false);
  };

  if (showAccessDenied) {
    return (
      <>
        <Header />
        {foldersStatus === "loading" ? <Loader /> : <UserSubscriptionModal />}
      </>
    );
  }

  useEffect(() => {
    const totalPages = Math.ceil(searchInFilteredFolders.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    if (searchInFilteredFolders.length === 0) {
      setCurrentPage(1);
    }
  }, [searchInFilteredFolders, itemsPerPage, currentPage]);

  return (
    <>
      <Header />
      <ActionBar
        title={`${
          currentFirm?.name.charAt(0).toUpperCase() + currentFirm?.name.slice(1)
        } Research`}
        componentType={"user_portal"}
        searchPanelProps={{
          onSearchChange: handleSearchChange,
          onFiltersChange: handleFiltersChange,
          folderOptions: folderOptions,
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
                    itemsAmount={
                      folder?.research?.filter(
                        (researchItem) =>
                          researchItem?.firm?.id === currentFirm?.id &&
                          researchItem?.firm?.name === currentFirm?.name
                      ).length
                    }
                    status={folder.status}
                    componentType={"user_portal"}
                  >
                    <FolderInnerListUser
                      tableData={
                        folder?.research?.filter(
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
                <DocumentPreview
                  showPreview={showPreview}
                  selectedDocument={selectedDocument}
                  onClose={closePreview}
                />
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

export default UserPortal;
