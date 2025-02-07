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

import { deleteUsers } from "../../store/slices/userManagementSlice";

import CustomButton from "../CustomButton/CustomButton";
import DeleteModal from "../DeleteModal/DeleteModal";
import DropdownModalWrapper from "../DropdownModalWrapper/DropdownModalWrapper";
import FolderAndResearchModals from "../FolderAndResearchModals/FolderAndResearchModals";
import { USER_TYPES } from "../../constants/constants";

import moreIcon from "../../assets/icons/more-icon.svg";
import folderIcon from "../../assets/icons/folder-icon.svg";
import deleteLightRedIcon from "../../assets/icons/delete-icon-light-red.svg";
import deleteIconRed from "../../assets/icons/delete-icon-red.svg";
import closeIcon from "../../assets/icons/close-icon.svg";
import penIcon from "../../assets/icons/pen-icon.svg";
import passwordIcon from "../../assets/icons/password-icon.svg";

import "./styles.scss";

const UserManagementTable = ({ tableData, currentFolder, handleViewClick }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownData, setDropdownData] = useState(null);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  //   const [editingResearch, setEditingResearch] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isUploadResearchModalOpen, setIsUploadResearchModalOpen] =
    useState(false);

  const dropdownRef = useRef(null);
  const parentContainerRef = useRef(null);

  const dispatch = useDispatch();

  const getUserTypeName = (typeValue) => {
    const typeName = Object.keys(USER_TYPES)
      .find((key) => USER_TYPES[key] === typeValue)
      ?.toLowerCase();

    return typeName
      ? typeName.charAt(0).toUpperCase() + typeName.slice(1)
      : "Unknown";
  };

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

    const relativeTop = position.top - parentPosition.top + 110;
    const relativeLeft = position.left - parentPosition.left - 210;

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
            optionName: "Edit profile and accesses",
            icon: penIcon,
            onOptionClick: () => {},
          },
          {
            optionName: "Change password",
            icon: passwordIcon,
            onOptionClick: () => {},
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

  //   const handleSaveResearchData = useCallback(
  //     (researchData) => {
  //       dispatch(createResearch(researchData));
  //     },
  //     [dispatch]
  //   );

  //   const handleUpdateResearchData = useCallback(
  //     (researchData) => {
  //       console.log(researchData);

  //       dispatch(updateResearch(researchData));
  //     },
  //     [dispatch]
  //   );

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
        <div
          className="user-management-table-container"
          ref={parentContainerRef}
        >
          <table className="user-management-table">
            {selectedItems.length === 0 && (
              <thead>
                <tr>
                  <th className="user-management-table-header">Name</th>
                  <th className="user-management-table-header">Firm</th>
                  <th className="user-management-table-header">Type</th>
                  <th className="user-management-table-header">Registration</th>
                  <th className="user-management-table-header">Last login</th>
                  <th className="user-management-table-header">Accesses</th>
                  <th className="user-management-table-header"></th>
                </tr>
              </thead>
            )}

            <tbody>
              {selectedItems.length > 0 && (
                <tr className="selected-actions-panel">
                  <td colSpan="7">
                    <div className="selected-actions">
                      <div className="selected-items-wrapper">
                        <img
                          src={closeIcon}
                          alt="remove selected"
                          className="close-button-icon"
                          onClick={clearSelectedItems}
                        />
                        <p className="selected-user-items">
                          {selectedItems.length} items selected
                        </p>
                      </div>

                      <button
                        className="user-management-button delete"
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
                        Delete users
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
                    <div className="user-column">
                      <div className="custom-user-management-checkbox">
                        <input
                          type="checkbox"
                          id={`checkbox-${index}`}
                          onChange={() => handleCheckboxChange(index)}
                          checked={selectedItems.includes(index)}
                        />
                        <label htmlFor={`checkbox-${index}`}></label>
                      </div>
                      <div className="text-block">
                        <p>
                          {" "}
                          {item.first_name} {item.last_name}
                        </p>
                        <p className="user-management-email">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-data-item">firm</td>
                  <td className="table-data-item">
                    {getUserTypeName(item.role)}
                  </td>

                  <td className="table-data-item">
                    {/* {new Date(item.created_at || Date.now()).toLocaleDateString(
                      "en-US"
                    )} */}
                    <div className="user-column">
                      <div className="text-block">
                        <p>
                          {new Date(
                            item.created_at || Date.now()
                          ).toLocaleDateString("en-US")}
                        </p>
                        <p className="user-management-created-by">
                          by {""}
                          {item.creator
                            ? `${item.creator.first_name} ${item.creator.last_name}`
                            : `${item.first_name} ${item.last_name}`}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="table-data-item">
                    {item.last_login
                      ? new Date(item.last_login).toLocaleDateString("en-US")
                      : new Date(item.created_at).toLocaleDateString("en-US")}
                  </td>
                  <td className="table-data-item">Accesses test</td>

                  <td className="table-data-item">
                    <div className="actions-column">
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
        <div className="user-management-table-empty">
          {/* <img src={folderIcon} className="folder-icon" /> */}
          <p>
            This user management panel is empty. Click the button <br />
            below to add new user.
          </p>
          <div className="add-user-btn">
            <CustomButton
              label={"Add user"}
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
            ? "a user"
            : selectedItems.length > 1
            ? "the users"
            : "a user"
        }
        deleteButtonTitle={
          deleteType === "single"
            ? "Delete user"
            : selectedItems.length > 1
            ? "Delete users"
            : "Delete user"
        }
        onDelete={() => {
          if (deleteType === "single") {
            dispatch(deleteUsers([itemToDelete.id]));
          } else {
            const usersIdArray = selectedItems.map(
              (index) => tableData[index].id
            );
            clearSelectedItems();
            dispatch(deleteUsers(usersIdArray));
          }
          setIsDeleteModalOpen(false);
        }}
      />

      {/* <FolderAndResearchModals
        isUploadResearchModalOpen={isUploadResearchModalOpen}
        onCloseUploadResearchModal={() => {
          setIsUploadResearchModalOpen(false);
          setEditingResearch(null);
        }}
        folderOptions={folderOptions}
        onSaveResearchData={handleSaveResearchData}
        onUpdateResearchData={handleUpdateResearchData}
        editingResearch={editingResearch}
      /> */}
    </>
  );
};

export default UserManagementTable;
