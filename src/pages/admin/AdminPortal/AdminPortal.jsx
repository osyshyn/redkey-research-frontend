import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getFolders,
  createFolder,
  createResearch,
} from '../../../store/slices/researchSlice';
import {
  setResearchFilters,
  clearResearchFilters,
  setFolderSort,
  setResearchSort,
} from '../../../store/slices/filterSlice';
import { getFirms } from '../../../store/slices/firmSlice';

import useDeviceType from '../../../hooks/useDeviceType';

import Header from '../../../components/Header/Header';
import FolderWrapper from '../../../components/FolderWrapper/FolderWrapper';
import FolderInnerList from '../../../components/FolderInnerList/FolderInnerList';
import Pagination from '../../../components/Pagination/Pagination';
import ActionBar from '../../../components/ActionBar/ActionBar';
import Loader from '../../../components/Loader/Loader';
import DocumentPreview from '../../../components/DocumentPreview/DocumentPreview';
import MobileModalWrapper from '../../../components/MobileModalWrapper/MobileModalWrapper';
import FirmsModal from '../../../components/FirmsModal/FirmsModal';
import UserSubscriptionModal from '../../../components/UserSubscriptionModal/UserSubscriptionModal';

import MobileActionAddIcon from '../../../assets/icons/mobile-action-add-button.svg?react';
import LoadIcon from '../../../assets/icons/load-icon.svg?react';
import FolderIcon from '../../../assets/icons/folder-icon.svg?react';
import PlusIcon from '../../../assets/icons/plus-icon.svg?react';
import closeIcon from '../../../assets/icons/close-icon.svg';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import './styles.scss';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const AdminPortal = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadResearchModalOpen, setIsUploadResearchModalOpen] =
    useState(false);

  const [isFirmsModalOpen, setIsFirmsModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mobileActionAddData, setMobileActionAddData] = useState({
    options: [],
  });

  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const dispatch = useDispatch();

  const { folders, foldersStatus } = useSelector((state) => state.research);
  const { researchFilters, folderSort, researchSort } = useSelector(
    (state) => state.filters
  );
  const currentFirm = useSelector((state) => state.firm.currentFirm);
  const user = useSelector((state) => state.auth.user);

  const currentUserDevice = useDeviceType();

  console.log('FOLDERS', folders, currentFirm);

  useEffect(() => {
    dispatch(getFirms());
  }, [dispatch]);

  useEffect(() => {
    if (currentFirm && user?.role === 2) {
      const hasAccess = user?.access?.some(
        (access) => access.firm.id === currentFirm.id && access.value === true
      );
      if (hasAccess) {
        setShowAccessDenied(false);
      } else if (!hasAccess) {
        setShowAccessDenied(true);
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

  const handleSaveResearchData = useCallback(
    (researchData) => {
      dispatch(createResearch(researchData));
    },
    [dispatch]
  );

  // const sortedFolders = [...folders].sort((a, b) => {
  //   const statusOrder = { 1: 0, 4: 1, 3: 2, 2: 3 };
  //   const orderA = statusOrder[a.status] ?? Infinity;
  //   const orderB = statusOrder[b.status] ?? Infinity;
  //   return orderA - orderB;
  // });

  const sortedFolders = useMemo(() => {
    const foldersCopy = [...folders];

    foldersCopy.sort((a, b) => {
      const statusOrder = { 1: 0, 4: 1, 2: 2, 3: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    if (researchSort?.type === 'initiation_date') {
      foldersCopy.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return researchSort.direction === 'newest'
          ? dateB - dateA
          : dateA - dateB;
      });
    }
    if (researchSort?.type === 'publication_date') {
      foldersCopy.sort((a, b) => {
        const dateA = new Date(a.latest_research_date);
        const dateB = new Date(b.latest_research_date);
        return researchSort.direction === 'newest'
          ? dateB - dateA
          : dateA - dateB;
      });
    }

    return foldersCopy;
  }, [folders, researchSort]);

  const foldersFilteredByFirm = sortedFolders.filter((folder) => {
    if (currentFirm?.name === 'All') {
      return true;
    }
    return folder?.firm?.id === currentFirm?.id;
  });

  const filteredFolders = foldersFilteredByFirm
    .filter((folder) => {
      return researchFilters.every((filter) => {
        const filterType = filter.type.value;
        const filterValue = filter.value.value;

        if (filterType === 'status') {
          return folder.status.toString() === filterValue.toString();
        }

        if (filterType === 'companies') {
          return folder.id.toString() === filterValue.toString();
        }

        return true;
      });
    })

    .map((folder) => {
      const sortFilter = researchFilters.find(
        (filter) => filter.type.value === 'initiation_date'
      );

      if (!sortFilter) return folder;

      const direction = sortFilter.value.value;

      const sortedResearch = [...folder.research].sort((a, b) => {
        const dateA = new Date(a.publication_date);
        const dateB = new Date(b.publication_date);
        return direction === 'newest-oldest' ? dateB - dateA : dateA - dateB;
      });

      return { ...folder, research: sortedResearch };
    })
    .filter((folder) => {
      const hasDueDateFilter = researchFilters.some(
        (filter) => filter.type.value === 'initiation_date'
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
        .filter(
          (folder) =>
            folder.research.length > 0 ||
            folder.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            folder.stock_ticker
              ?.toLowerCase()
              .includes(searchValue.toLowerCase())
        )
    : filteredFolders;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFolders = searchInFilteredFolders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    if (foldersStatus === 'idle') {
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

  const handleSortChange = (sortConfig) => {
    if (sortConfig.type === 'initiation_date') {
      dispatch(setFolderSort(sortConfig));
    } else {
      dispatch(setResearchSort(sortConfig));
    }
    setCurrentPage(1);
  };
  const handleCreateFolder = useCallback(
    (folderName, selectedFirmFolder, folderStockTicker) => {
      if (folderName.trim()) {
        dispatch(clearResearchFilters());
        dispatch(
          createFolder({ folderName, selectedFirmFolder, folderStockTicker })
        );
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

  const handleOpenMobileModal = () => {
    // e.stopPropagation();

    setMobileActionAddData({
      options: [
        {
          optionName: 'Upload research',
          icon: <LoadIcon className='mobile-dropdown-menu-icon' />,
          onOptionClick: () => {
            setIsMobileModalOpen(false);
            setIsUploadResearchModalOpen(true);
          },
        },
        {
          optionName: 'Create folder',
          icon: <FolderIcon className='mobile-dropdown-menu-icon' />,
          onOptionClick: () => {
            setIsMobileModalOpen(false);
            setIsCreateFolderModalOpen(true);
          },
        },
        {
          optionName: 'Add/remove research team',
          icon: <PlusIcon className='mobile-dropdown-menu-icon' />,
          onOptionClick: () => {
            setIsFirmsModalOpen(true);
          },
        },
      ],
    });

    setIsMobileModalOpen(true);
  };

  useEffect(() => {
    const totalPages = Math.ceil(searchInFilteredFolders.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    if (searchInFilteredFolders.length === 0) {
      setCurrentPage(1);
    }
  }, [searchInFilteredFolders, itemsPerPage, currentPage]);

  if (showAccessDenied) {
    return (
      <>
        <Header />
        {foldersStatus === 'loading' ? <Loader /> : <UserSubscriptionModal />}
      </>
    );
  }

  return (
    <>
      <Header componentType={'admin_portal'} />
      <ActionBar
        title={
          currentFirm?.name === 'All'
            ? 'All Researches'
            : `${
                currentFirm?.name.charAt(0).toUpperCase() +
                currentFirm?.name.slice(1)
              } Research`
        }
        componentType={'admin_portal'}
        searchPanelProps={{
          onSearchChange: handleSearchChange,
          onFiltersChange: handleFiltersChange,
          onSortChange: handleSortChange,
          // folderOptions: folderOptions,
        }}
        buttons={[
          {
            label: 'Create folder',
            style: 'red-outline',
            onClick: () => setIsCreateFolderModalOpen(true),
          },
          {
            label: 'Upload research',
            style: 'red-shadow',
            onClick: () => setIsUploadResearchModalOpen(true),
          },
        ]}
        mobileButton={{
          label: <MobileActionAddIcon className='action-bar-plus-icon' />,
          style: 'red-shadow',
          onClick: handleOpenMobileModal,
        }}
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
      {foldersStatus === 'loading' ? (
        <Loader />
      ) : folders.length === 0 ? (
        <div className='folders-and-document-container'>
          <div className='folders-container'>
            <p className='no-folders-message'>
              No folders available to display
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className='folders-and-document-container'>
            <div className='folders-container'>
              {currentFolders.length > 0 ? (
                currentFolders.map((folder, index) => (
                  <FolderWrapper
                    key={index}
                    title={folder.name}
                    stockTicker={folder.stock_ticker}
                    folderId={folder.id}
                    // itemsAmount={folder.research.length}
                    itemsAmount={
                      currentFirm?.name === 'All'
                        ? folder?.research?.length
                        : folder?.research?.filter(
                            (researchItem) =>
                              researchItem?.firm?.id === currentFirm?.id &&
                              researchItem?.firm?.name === currentFirm?.name
                          ).length
                    }
                    earliestResearchDate={
                      folder.research && folder.research.length > 0
                        ? new Date(
                            Math.min(
                              ...folder.research.map(
                                (item) => new Date(item.publication_date)
                              )
                            )
                          ).toLocaleDateString('en-US')
                        : 'No researches yet'
                    }
                    status={folder.status}
                    componentType={'admin_portal'}
                    researchData={
                      currentFirm?.name === 'All'
                        ? folder?.research
                        : folder?.research?.filter(
                            (researchItem) =>
                              researchItem?.firm?.id === currentFirm?.id &&
                              researchItem?.firm?.name === currentFirm?.name
                          ) || [folder.research[0]]
                    }
                  >
                    <FolderInnerList
                      // tableData={folder.research.filter(
                      //   (researchItem) =>
                      //     (researchItem?.firm?.id === currentFirm?.id &&
                      //     researchItem?.firm?.name === currentFirm?.name)
                      // )}
                      tableData={
                        currentFirm?.name === 'All'
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
                <p className='no-folders-message'>
                  No folders available to display
                </p>
              )}
            </div>
            {showPreview &&
              selectedDocument &&
              selectedDocument?.file?.type === 'file' && (
                <DocumentPreview
                  showPreview={showPreview}
                  selectedDocument={selectedDocument}
                  onClose={closePreview}
                />
              )}
          </div>

          {currentFolders.length >= 1 && (
            <div className='pagination-wrapper'>
              <Pagination
                currentPage={currentPage}
                totalItems={searchInFilteredFolders.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[10, 15, 20]}
              />
            </div>
          )}
        </>
      )}

      {currentUserDevice === 'mobile' && (
        <MobileModalWrapper
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        >
          <div className='mobile-options-list'>
            {mobileActionAddData.options?.map((option) => (
              <div
                key={option.optionName}
                className={`mobile-option-item ${
                  option.optionName === 'Delete' ? 'delete-option' : ''
                }`}
                onClick={option.onOptionClick}
              >
                {option.icon}
                <span>{option.optionName}</span>
              </div>
            ))}
          </div>
        </MobileModalWrapper>
      )}

      {isFirmsModalOpen && (
        <FirmsModal
          isOpen={isFirmsModalOpen}
          onClose={() => setIsFirmsModalOpen(false)}
        />
      )}
    </>
  );
};

export default AdminPortal;
