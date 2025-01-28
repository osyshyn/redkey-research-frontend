import React, { useState } from "react";
import moreIcon from "../../assets/icons/more-icon.svg";
import folderIcon from "../../assets/icons/folder-icon.svg";
import downloadIcon from "../../assets/icons/download-icon.svg";
import deleteLightRedIcon from "../../assets/icons/delete-icon-light-red.svg";
import closeIcon from "../../assets/icons/close-icon.svg";
import CustomButton from "../CustomButton/CustomButton";

import "./styles.scss";

const FolderInnerList = ({ tableData, handleViewClick }) => {
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
            <thead>
              <tr>
                <th className="folder-table-header">Research</th>
                <th className="folder-table-header">Type</th>
                <th className="folder-table-header">Responsible</th>
                <th className="folder-table-header">Date</th>
                <th className="folder-table-header"></th>
              </tr>
            </thead>
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
                        <button className="research-button download-all">
                          <img
                            src={downloadIcon}
                            alt="Download all"
                            className="button-icon download-all"
                          />
                          Download all
                        </button>
                        <button
                          className="research-button delete"
                          onClick={() => {}}
                        >
                          <img
                            src={deleteLightRedIcon}
                            alt="Delete all"
                            className="button-icon delete"
                          />
                          Delete researchs
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
                          {(item.created_at
                            ? new Date(item.created_at)
                            : new Date(Date.now())
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
                      <div className="admin-portal-action-btn">Edit</div>
                      <div
                        className="admin-portal-action-btn"
                        onClick={() => handleViewClick(item)}
                      >
                        View
                      </div>
                      <img src={moreIcon} className="more-icon" />
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
              onClick={() => {}}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FolderInnerList;
