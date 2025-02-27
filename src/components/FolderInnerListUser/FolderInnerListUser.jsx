import React, { useState } from "react";
import ReactDOM from "react-dom";

import { handleDownload, handleDownloadAll } from "../../utils/downloadHelpers";
import useDeviceType from "../../hooks/useDeviceType";

import MobileModalWrapper from "../MobileModalWrapper/MobileModalWrapper";

import FolderIcon from "../../assets/icons/folder-icon.svg?react";
import DownloadIcon from "../../assets/icons/download-icon.svg?react";
import ViewIcon from "../../assets/icons/view-icon.svg?react";
import closeIcon from "../../assets/icons/close-icon.svg";
import moreIcon from "../../assets/icons/more-icon.svg";

import "./styles.scss";

const FolderInnerListUser = ({ tableData, handleViewClick }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mobileMoreiconData, setMobileMoreIconData] = useState({
    options: [],
  });

  const currentUserDevice = useDeviceType();

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

  const handleMoreClick = (e, item, index) => {
    e.stopPropagation();

    setMobileMoreIconData({
      options: [
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
      ],
    });

    setIsMobileModalOpen(true); // Открываем модалку
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  return (
    <>
      {tableData.length > 0 ? (
        <div className="folder-inner-list">
          <table className="folder-table">
            {selectedItems.length === 0 && currentUserDevice === "desktop" && (
              <thead>
                <tr>
                  <th className="folder-table-header">Research</th>
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
                          {`${selectedItems.length} ${
                            selectedItems.length === 1 ? "item" : "items"
                          } selected`}
                        </p>
                      </div>
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
                        Download
                      </button>
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
                        <p className="research-title">{item.title}</p>
                      </div>
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
                            handleViewClick(item);
                            clearSelectedItems();
                          }}
                        >
                          View
                        </div>
                        <div
                          className="admin-portal-action-btn"
                          onClick={() => {
                            handleDownload(item);
                            clearSelectedItems();
                          }}
                        >
                          Download
                        </div>
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
                          {new Date(item.publication_date).toLocaleDateString(
                            "en-US"
                          )}
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
          <p>This folder is empty.</p>
        </div>
      )}

      {currentUserDevice === "mobile" && ( 
        <MobileModalWrapper
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        >
          <div className="mobile-options-list">
            {mobileMoreiconData.options?.map((option) => (
              <div
                key={option.optionName}
                className="mobile-option-item"
                onClick={option.onOptionClick}
              >
                {option.icon}
                <span>{option.optionName}</span>
              </div>
            ))}
          </div>
        </MobileModalWrapper>
      )}

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
          </div>,
          document.getElementById("mobile-portal")
        )}
    </>
  );
};

export default FolderInnerListUser;
