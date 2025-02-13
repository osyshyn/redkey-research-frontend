import React, { useState } from "react";

import { handleDownload, handleDownloadAll } from "../../utils/downloadHelpers";

import folderIcon from "../../assets/icons/folder-icon.svg";
import downloadIcon from "../../assets/icons/download-icon.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

import "./styles.scss";

const FolderInnerListUser = ({ tableData, handleViewClick }) => {
  const [selectedItems, setSelectedItems] = useState([]);

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

  return (
    <>
      {tableData.length > 0 ? (
        <div className="folder-inner-list">
          <table className="folder-table">
            {selectedItems.length === 0 && (
              <thead>
                <tr>
                  <th className="folder-table-header">Research</th>
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
                      <button
                        className="research-button download-all"
                        onClick={() =>
                          handleDownloadAll(
                            selectedItems.map((index) => tableData[index]),
                            clearSelectedItems
                          )
                        }
                      >
                        <img
                          src={downloadIcon}
                          alt="Download all"
                          className="button-icon download-all"
                        />
                        Download
                      </button>
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
            </tbody>
          </table>
        </div>
      ) : (
        <div className="folder-table-empty">
          <img src={folderIcon} className="folder-icon" />
          <p>This folder is empty.</p>
        </div>
      )}
    </>
  );
};

export default FolderInnerListUser;
