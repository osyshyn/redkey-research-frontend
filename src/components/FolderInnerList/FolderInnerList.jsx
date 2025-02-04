import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createResearch,
  updateResearch,
  deleteResearch,
} from "../../store/slices/researchSlice";

import CustomButton from "../CustomButton/CustomButton";
import DeleteModal from "../DeleteModal/DeleteModal";
import DropdownModalWrapper from "../DropdownModalWrapper/DropdownModalWrapper";
import FolderAndResearchModals from "../FolderAndResearchModals/FolderAndResearchModals";

import moreIcon from "../../assets/icons/more-icon.svg";
import folderIcon from "../../assets/icons/folder-icon.svg";
import downloadIcon from "../../assets/icons/download-icon.svg";
import downloadLightGreyIcon from "../../assets/icons/download-icon-light-grey.svg";
import deleteLightRedIcon from "../../assets/icons/delete-icon-light-red.svg";
import deleteIconRed from "../../assets/icons/delete-icon-red.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

import "./styles.scss";

const FolderInnerList = ({ tableData, currentFolder, handleViewClick }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownData, setDropdownData] = useState(null);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [editingResearch, setEditingResearch] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isUploadResearchModalOpen, setIsUploadResearchModalOpen] =
    useState(false);

  const dropdownRef = useRef(null);
  const parentContainerRef = useRef(null);

  const dispatch = useDispatch();
  const folders = useSelector((state) => state.research.folders);

  console.log(folders, tableData);

  const folderOptions = useMemo(
    () =>
      folders.map((folder) => ({
        value: folder.id,
        label: folder.name,
      })),
    [folders]
  );

  const handleCheckboxChange = (index) => {
    const newSelectedItems = [...selectedItems];
    if (newSelectedItems.includes(index)) {
      const itemIndex = newSelectedItems.indexOf(index);
      newSelectedItems.splice(itemIndex, 1);
    } else {
      newSelectedItems.push(index);
    }
    setSelectedItems(newSelectedItems);
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  const handleMoreClick = (e, item, index) => {
    const position = e.target.getBoundingClientRect();
    const parentPosition = parentContainerRef.current.getBoundingClientRect();

    const relativeTop = position.top - parentPosition.top - 80;
    const relativeLeft = position.left - parentPosition.left - 150;

    if (activeDropdownIndex === index) {
      setActiveDropdownIndex(null);
    } else {
      setActiveDropdownIndex(index);
      setDropdownData({
        position: {
          top: relativeTop,
          left: relativeLeft,
        },
        options: [
          {
            optionName: "Download",
            icon: downloadLightGreyIcon,
            onOptionClick: () => handleDownload(item),
          },
          {
            optionName: "Delete",
            icon: deleteIconRed,
            onOptionClick: () => {
              setDeleteType("single");
              setItemToDelete(item);
              setIsDeleteModalOpen(true);
            },
          },
        ],
      });
    }
    clearSelectedItems();
  };

  const handleSaveResearchData = useCallback(
    (researchData) => {
      dispatch(createResearch(researchData));
    },
    [dispatch]
  );

  const handleUpdateResearchData = useCallback(
    (researchData) => {
      console.log(researchData);

      dispatch(updateResearch(researchData));
    },
    [dispatch]
  );

  const handleDownload = (item) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}/${item.file.path}`;

    if (!fileUrl) {
      console.error("PDF file URL not found");
      return;
    }

    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("File download failed");
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = item.title + ".pdf";
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDownloadAll = (items) => {
    items.forEach((item) => {
      const fileUrl = `${import.meta.env.VITE_API_URL}/${item.file.path}`;

      if (fileUrl) {
        fetch(fileUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error("File download failed");
            }
            return response.blob();
          })
          .then((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = item.title + ".pdf";
            link.click();
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.error(`File for ${item.title} not found`);
      }
    });

    clearSelectedItems();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {tableData.length > 0 ? (
        <div className="folder-inner-list" ref={parentContainerRef}>
          <table className="folder-table">
            {selectedItems.length === 0 && (
              <thead>
                <tr>
                  <th className="folder-table-header">Research</th>
                  <th className="folder-table-header">Type</th>
                  <th className="folder-table-header">Responsible</th>
                  <th className="folder-table-header">Date</th>
                  <th className="folder-table-header"></th>
                </tr>
              </thead>
            )}

            <tbody>
              {selectedItems.length > 0 && (
                <tr className="selected-actions-panel">
                  <td colSpan="5">
                    <div className="selected-actions">
                      <div className="selected-items-wrapper">
                        <img
                          src={closeIcon}
                          alt="remove selected"
                          className="close-button-icon"
                          onClick={clearSelectedItems}
                        />
                        <p className="selected-folder-items">
                          {selectedItems.length} items selected
                        </p>
                      </div>
                      <div className="research-buttons-wrapper">
                        <button
                          className="research-button download-all"
                          onClick={() =>
                            handleDownloadAll(
                              selectedItems.map((index) => tableData[index])
                            )
                          }
                        >
                          <img
                            src={downloadIcon}
                            alt="Download all"
                            className="button-icon download-all"
                          />
                          Download all
                        </button>
                        <button
                          className="research-button delete"
                          onClick={() => {
                            if (selectedItems.length > 0) {
                              setDeleteType("multiple");
                              setIsDeleteModalOpen(true);
                            }
                          }}
                        >
                          <img
                            src={deleteLightRedIcon}
                            alt="Delete all"
                            className="button-icon delete"
                          />
                          Delete researches
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {tableData.map((item, index) => (
                <tr
                  key={index}
                  className={`table-data-body-row ${
                    selectedItems.includes(index) ? "selected" : ""
                  }`}
                >
                  <td className="table-data-item">
                    <div className="research-column">
                      <div className="custom-folder-checkbox">
                        <input
                          type="checkbox"
                          id={`checkbox-${index}`}
                          onChange={() => handleCheckboxChange(index)}
                          checked={selectedItems.includes(index)}
                        />
                        <label htmlFor={`checkbox-${index}`}></label>
                      </div>
                      <div className="text-block">
                        <p className="research-title">{item.title}</p>
                        <p className="published-date">
                          Published on{" "}
                          {new Date(
                            item.created_at || Date.now()
                          ).toLocaleDateString("en-US")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="table-data-item">{item.report_type}</td>
                  <td className="table-data-item">
                    {item.creator.first_name} {item.creator.last_name}
                  </td>
                  <td className="table-data-item">
                    {new Date(item.publication_date).toLocaleDateString(
                      "en-US"
                    )}
                  </td>
                  <td className="table-data-item">
                    <div className="actions-column">
                      <div
                        className="admin-portal-action-btn"
                        onClick={() => {
                          setEditingResearch({ ...item, currentFolder });
                          setIsUploadResearchModalOpen(true);
                          clearSelectedItems();
                        }}
                      >
                        Edit
                      </div>
                      <div
                        className="admin-portal-action-btn"
                        onClick={() => {
                          handleViewClick(item);
                          clearSelectedItems();
                        }}
                      >
                        View
                      </div>
                      <img
                        src={moreIcon}
                        className="more-icon"
                        onClick={(e) => handleMoreClick(e, item, index)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="folder-table-empty">
          <img src={folderIcon} className="folder-icon" />
          <p>
            This folder is empty. Click the button <br />
            below to add new researches.
          </p>
          <div className="add-research-btn">
            <CustomButton
              label={"Add research"}
              style={"red-shadow"}
              onClick={() => setIsUploadResearchModalOpen(true)}
            />
          </div>
        </div>
      )}

      {dropdownData && activeDropdownIndex !== null && (
        <div ref={dropdownRef}>
          <DropdownModalWrapper
            position={dropdownData.position}
            options={dropdownData.options}
          />
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemToDelete={
          deleteType === "single"
            ? "the research"
            : selectedItems.length > 1
            ? "the researches"
            : "the research"
        }
        deleteButtonTitle={
          deleteType === "single"
            ? "Delete research"
            : selectedItems.length > 1
            ? "Delete researches"
            : "Delete research"
        }
        onDelete={() => {
          if (deleteType === "single") {
            dispatch(deleteResearch([itemToDelete.id]));
          } else {
            const researchIds = selectedItems.map(
              (index) => tableData[index].id
            );
            clearSelectedItems();
            dispatch(deleteResearch(researchIds));
          }
          setIsDeleteModalOpen(false);
        }}
      />

      <FolderAndResearchModals
        isUploadResearchModalOpen={isUploadResearchModalOpen}
        onCloseUploadResearchModal={() => {
          setIsUploadResearchModalOpen(false);
          setEditingResearch(null);
        }}
        folderOptions={folderOptions}
        onSaveResearchData={handleSaveResearchData}
        onUpdateResearchData={handleUpdateResearchData}
        editingResearch={editingResearch}
      />
    </>
  );
};

export default FolderInnerList;
