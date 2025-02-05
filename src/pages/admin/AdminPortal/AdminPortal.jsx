// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getFolders } from "../../../store/slices/researchSlice";
// import Header from "../../../components/Header/Header";
// import FolderWrapper from "../../../components/FolderWrapper/FolderWrapper";
// import FolderInnerList from "../../../components/FolderInnerList/FolderInnerList";
// import Pagination from "../../../components/Pagination/Pagination";
// import ActionBar from "../../../components/ActionBar/ActionBar";
// import closeIcon from "../../../assets/icons/close-icon.svg";

// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// import "./styles.scss";

// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// const AdminPortal = () => {
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [showPreview, setShowPreview] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(3);
//   const [selectedFilters, setSelectedFilters] = useState([]);

//   const dispatch = useDispatch();

//   const { folders, status } = useSelector((state) => state.research);

//   console.log("selectedFilters", selectedFilters);

//   const filteredFolders = folders.filter((folder) => {
//     return selectedFilters.every((filter) => {
//       const filterType = filter.type.value;
//       const filterValue = filter.value.value;

//       if (filterType === "status") {
//         return folder.status.toString() === filterValue.toString();
//       }

//       if (filterType === "companies") {
//         return folder.id.toString() === filterValue.toString();
//       }

//       if (filterType === "due_date") {
//         const [startDate, endDate] = filter.value.map(
//           (dateStr) => new Date(dateStr)
//         );

//         return folder.research.some((research) => {
//           const publicationDate = new Date(research.publication_date);
//           return publicationDate >= startDate && publicationDate <= endDate;
//         });
//       }

//       return true;
//     });
//   });

//   const searchInFilteredFolders = filteredFolders.map((folder) => ({
//     ...folder,
//     research: folder.research.filter((item) =>
//       item.title.toLowerCase().includes(searchValue.toLowerCase())
//     ),
//   }));

//   console.log("filteredFolders2", filteredFolders, searchInFilteredFolders);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentFolders = searchInFilteredFolders.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   useEffect(() => {
//     if (folders.length === 0 && status !== "loading") {
//       dispatch(getFolders());
//     }
//   }, [dispatch, folders, status]);

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   console.log(searchValue, folders);

//   const handleItemsPerPageChange = (newSize) => {
//     setItemsPerPage(newSize);
//     setCurrentPage(1);
//   };

//   const handleSearchChange = (value) => {
//     setSearchValue(value);
//   };

//   const handleFiltersChange = (newFilters) => {
//     console.log("newFilters", newFilters, folders);
//     setSelectedFilters(newFilters);

//     // no provided filers yet
//   };

//   const handleViewClick = (item) => {
//     setSelectedDocument(item);
//     setShowPreview(true);
//   };

//   const onLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const closePreview = () => {
//     setShowPreview(false);
//   };

//   return (
//     <>
//       <Header />
//       <ActionBar
//         onSearchChange={handleSearchChange}
//         onFiltersChange={handleFiltersChange}
//       />
//       <div className="folders-and-document-container">
//         <div className="folders-container">
//           {currentFolders.map((folder, index) => (
//             <FolderWrapper
//               key={index}
//               title={folder.name}
//               folderId={folder.id}
//               itemsAmount={folder.research.length}
//               status={folder.status}
//             >
//               <FolderInnerList
//                 tableData={folder.research}
//                 currentFolder={{ value: folder.id, label: folder.name }}
//                 handleViewClick={handleViewClick}
//               />
//             </FolderWrapper>
//           ))}
//         </div>
//         {showPreview &&
//           selectedDocument &&
//           selectedDocument?.file?.type === "file" && (
//             <div className="document-preview">
//               <img
//                 src={closeIcon}
//                 alt="Close"
//                 className="close-icon"
//                 onClick={closePreview}
//               />
//               <Document
//                 file={`${import.meta.env.VITE_API_URL}/${
//                   selectedDocument.file.path
//                 }`}
//                 onLoadSuccess={onLoadSuccess}
//               >
//                 {Array.from(new Array(numPages), (el, index) => (
//                   <Page key={index} pageNumber={index + 1} scale={0.9} />
//                 ))}
//               </Document>
//             </div>
//           )}
//       </div>

//       {folders.length > 1 && currentFolders.length > 1 && (
//         <Pagination
//           currentPage={currentPage}
//           totalItems={folders.length}
//           itemsPerPage={itemsPerPage}
//           onPageChange={handlePageChange}
//           onItemsPerPageChange={handleItemsPerPageChange}
//         />
//       )}
//     </>
//   );
// };

// export default AdminPortal;

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFolders, createFolder } from "../../../store/slices/researchSlice";
import Header from "../../../components/Header/Header";
import FolderWrapper from "../../../components/FolderWrapper/FolderWrapper";
import FolderInnerList from "../../../components/FolderInnerList/FolderInnerList";
import Pagination from "../../../components/Pagination/Pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const dispatch = useDispatch();

  const { folders, status } = useSelector((state) => state.research);

  console.log("selectedFilters", selectedFilters);

  // const filteredFolders = folders.filter((folder) => {
  //   return selectedFilters.every((filter) => {
  //     const filterType = filter.type.value;
  //     const filterValue = filter.value.value;

  //     if (filterType === "status") {
  //       return folder.status.toString() === filterValue.toString();
  //     }

  //     if (filterType === "companies") {
  //       return folder.id.toString() === filterValue.toString();
  //     }

  //     if (filterType === "due_date") {
  //       const [startDate, endDate] = filter.value.map(
  //         (dateStr) => new Date(dateStr)
  //       );

  //       return folder.research.some((research) => {
  //         const publicationDate = new Date(research.publication_date);
  //         return publicationDate >= startDate && publicationDate <= endDate;
  //       });
  //     }

  //     return true;
  //   });
  // });

  // const searchInFilteredFolders = filteredFolders.map((folder) => ({
  //   ...folder,
  //   research: folder.research.filter((item) =>
  //     item.title.toLowerCase().includes(searchValue.toLowerCase())
  //   ),
  // }));

   const searchInFilteredFolders = searchValue
    ? folders
        .map((folder) => ({
          ...folder,
          research: folder.research.filter((item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase())
          ),
        }))
        .filter((folder) => folder.research.length > 0)
    : folders;

  // console.log("filteredFolders2", filteredFolders, searchInFilteredFolders);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentFolders = searchInFilteredFolders.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );
  const currentFolders = searchInFilteredFolders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    if (folders.length === 0 && status !== "loading") {
      dispatch(getFolders());
    }
  }, [dispatch, folders, status]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  console.log(searchValue, folders);

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleFiltersChange = (newFilters) => {
    console.log("newFilters", newFilters, folders);
    setSelectedFilters(newFilters);

    // no provided filers yet
  };

  const handleCreateFolder = useCallback(
    (folderName) => {
      if (folderName.trim()) {
        setSelectedFilters([]);
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
        onSearchChange={handleSearchChange}
        onFiltersChange={handleFiltersChange}
        onCreateFolder={handleCreateFolder}
      />
      <div className="folders-and-document-container">
        <div className="folders-container">
          {currentFolders.map((folder, index) => (
            <FolderWrapper
              key={index}
              title={folder.name}
              folderId={folder.id}
              itemsAmount={folder.research.length}
              status={folder.status}
            >
              <FolderInnerList
                tableData={folder.research}
                currentFolder={{ value: folder.id, label: folder.name }}
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
                  <Page key={index} pageNumber={index + 1} scale={0.9} />
                ))}
              </Document>
            </div>
          )}
      </div>

      {folders.length >= 1 && currentFolders.length >= 1 && (
        <Pagination
          currentPage={currentPage}
          totalItems={folders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </>
  );
};

export default AdminPortal;

// const filteredFolders = folders.filter((folder) => {
//   return selectedFilters.every((filter) => {
//     const filterType = filter.type.value;
//     const filterValue = filter.value.value;

//     if (filterType === "status") {
//       return folder.status.toString() === filterValue.toString();
//     }

//     if (filterType === "companies") {
//       return folder.id.toString() === filterValue.toString();
//     }

//     if (filterType === "due_date") {
//       const [startDate, endDate] = filter.value.map(
//         (dateStr) => new Date(dateStr)
//       );

//       return folder.research.some((research) => {
//         const publicationDate = new Date(research.publication_date);
//         return publicationDate >= startDate && publicationDate <= endDate;
//       });
//     }

//     return true;
//   });
// });

// const searchInFilteredFolders = filteredFolders.map((folder) => ({
//   ...folder,
//   research: folder.research.filter((item) =>
//     item.title.toLowerCase().includes(searchValue.toLowerCase())
//   ),
// }));

// console.log("filteredFolders2", filteredFolders, searchInFilteredFolders);

// const indexOfLastItem = currentPage * itemsPerPage;
// const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// const currentFolders = searchInFilteredFolders.slice(
//   indexOfFirstItem,
//   indexOfLastItem
// );
