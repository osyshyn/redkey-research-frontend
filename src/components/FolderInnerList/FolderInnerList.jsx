import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import ReactDOM from "react-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  createResearch,
  updateResearch,
  deleteResearch,
} from "../../store/slices/researchSlice";

import { handleDownload, handleDownloadAll } from "../../utils/downloadHelpers";
import { getReportTypeName } from "../../utils/userHelpers";
import useDeviceType from "../../hooks/useDeviceType";

import CustomButton from "../CustomButton/CustomButton";
import DeleteModal from "../DeleteModal/DeleteModal";
import DropdownModalWrapper from "../DropdownModalWrapper/DropdownModalWrapper";
import FolderAndResearchModals from "../FolderAndResearchModals/FolderAndResearchModals";
import MobileModalWrapper from "../MobileModalWrapper/MobileModalWrapper";

import moreIcon from "../../assets/icons/more-icon.svg";
import FolderIcon from "../../assets/icons/folder-icon.svg?react";
import DownloadIcon from "../../assets/icons/download-icon.svg?react";
import DownloadLightGreyIcon from "../../assets/icons/download-icon-light-grey.svg?react";
import deleteLightRedIcon from "../../assets/icons/delete-icon-light-red.svg";
import DeleteIconRed from "../../assets/icons/delete-icon-red.svg?react";
import ViewIcon from "../../assets/icons/view-icon.svg?react";
import PenIcon from "../../assets/icons/pen-icon.svg?react";
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

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mobileMoreIconData, setMobileMoreIconData] = useState({
    options: [],
  });

  const dropdownRef = useRef(null);
  const parentContainerRef = useRef(null);

  const currentUserDevice = useDeviceType();

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
    if (currentUserDevice === "desktop") {
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
              icon: <DownloadLightGreyIcon className="dropdown-menu-icon" />,
              onOptionClick: () => {
                handleDownload(item);
                setActiveDropdownIndex(null);
              },
            },
            {
              optionName: "Delete",
              icon: <DeleteIconRed className="dropdown-menu-icon-red" />,
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
    }
    if (currentUserDevice === "mobile") {
      e.stopPropagation();

      setMobileMoreIconData({
        options: [
          {
            optionName: "Edit",
            icon: <PenIcon className="mobile-dropdown-menu-icon" />,
            onOptionClick: () => {
              setEditingResearch({ ...item, currentFolder });
              setIsUploadResearchModalOpen(true);
              clearSelectedItems();
              setIsMobileModalOpen(false);
            },
          },
          {
            optionName: "View",
            icon: <ViewIcon className="mobile-dropdown-menu-icon" />,
            onOptionClick: () => {
              handleViewClick(item);
              clearSelectedItems();
              setIsMobileModalOpen(false);
            },
          },
          {
            optionName: "Download",
            icon: <DownloadIcon className="mobile-dropdown-menu-icon" />,
            onOptionClick: () => {
              handleDownload(item);
              clearSelectedItems();
              setIsMobileModalOpen(false);
            },
          },
          {
            optionName: "Delete",
            icon: <DeleteIconRed className="mobile-dropdown-menu-icon-red" />,
            onOptionClick: () => {
              setDeleteType("single");
              setItemToDelete(item);
              clearSelectedItems();
              setIsMobileModalOpen(false);
              setIsDeleteModalOpen(true);
            },
          },
        ],
      });

      setIsMobileModalOpen(true);
    }
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
            {selectedItems.length === 0 && currentUserDevice === "desktop" && (
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
              {selectedItems.length > 0 && currentUserDevice === "desktop" && (
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
                              selectedItems.map((index) => tableData[index]),
                              clearSelectedItems
                            )
                          }
                        >
                          <DownloadIcon
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

              {/* Desktop*/}
              {currentUserDevice === "desktop" &&
                tableData.map((item, index) => (
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
                    <td className="table-data-item">
                      {getReportTypeName(item.report_type)}
                    </td>
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

              {/* Mobile */}
              {currentUserDevice === "mobile" &&
                tableData.map((item, index) => (
                  <tr
                    key={index}
                    className={`table-data-body-row ${
                      selectedItems.includes(index) ? "selected" : ""
                    }`}
                  >
                    <td className="table-data-item">
                      <div>
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
                          <p className="research-title">{item.title}</p>
                        </div>
                        <p className="mobile-publication-date">
                          Published on{" "}
                          {new Date(
                            item.created_at || Date.now()
                          ).toLocaleDateString("en-US")}
                        </p>
                      </div>
                      <img
                        src={moreIcon}
                        className="more-icon"
                        onClick={(e) => handleMoreClick(e, item, index)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="folder-table-empty">
          <FolderIcon className="folder-icon" />
          <p>
            This folder is empty. Click the button <br />
            below to add new researches.
          </p>
          <div className="add-research-btn">
            <CustomButton
              label={"Add research"}
              style={"red-shadow add-research-mobile"}
              onClick={() => setIsUploadResearchModalOpen(true)}
            />
          </div>
        </div>
      )}

      {currentUserDevice === "mobile" && (
        <MobileModalWrapper
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        >
          <div className="mobile-options-list">
            {mobileMoreIconData.options?.map((option) => (
              <div
                key={option.optionName}
                className={`mobile-option-item ${
                  option.optionName === "Delete" ? "delete-option" : ""
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
        onClose={() => {
          setIsDeleteModalOpen(false);
          clearSelectedItems();
        }}
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

      {/* mobile delete and download selected */}
      {selectedItems.length > 0 &&
        currentUserDevice === "mobile" &&
        ReactDOM.createPortal(
          <div className="mobile-selected-actions">
            <div className="mobile-selected-items-wrapper">
              <img
                src={closeIcon}
                alt="remove selected"
                className="mobile-close-button-icon"
                onClick={clearSelectedItems}
              />
              <p className="mobile-selected-folder-items">
                {`${selectedItems.length} ${
                  selectedItems.length === 1 ? "item" : "items"
                } selected`}
              </p>
            </div>
            <div className="mobile-folder-research-button-container">
              <button
                className="mobile-research-button download-all"
                onClick={() =>
                  handleDownloadAll(
                    selectedItems.map((index) => tableData[index]),
                    clearSelectedItems
                  )
                }
              >
                <DownloadIcon
                  alt="Download all"
                  className="mobile-button-icon download-all"
                />
              </button>
              <button
                className="mobile-research-button download-all"
                onClick={() => {
                  setDeleteType("multiple");
                  setIsDeleteModalOpen(true);
                }}
              >
                <DeleteIconRed
                  alt="Delete all"
                  className="mobile-button-icon mobile-dropdown-menu-icon-red"
                />
              </button>{" "}
            </div>
          </div>,
          document.getElementById("mobile-portal")
        )}
    </>
  );
};

export default FolderInnerList;
