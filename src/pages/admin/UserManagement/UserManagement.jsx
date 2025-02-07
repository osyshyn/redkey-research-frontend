import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFolders, createFolder } from "../../../store/slices/researchSlice";
import {
  setResearchFilters,
  clearResearchFilters,
  toggleFilterModal,
} from "../../../store/slices/filterSlice";
import { getUsers } from "../../../store/slices/userManagementSlice";

import { createNewUser } from "../../../store/slices/userManagementSlice";
import Header from "../../../components/Header/Header";
import FolderWrapper from "../../../components/FolderWrapper/FolderWrapper";
import UserManagementTable from "../../../components/UserManagementTable/UserManagementTable";
import Pagination from "../../../components/Pagination/Pagination";
import ActionBar from "../../../components/ActionBar/ActionBar";
import closeIcon from "../../../assets/icons/close-icon.svg";

import "./styles.scss";

const UserManagement = () => {
  const [numPages, setNumPages] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [isCreateNewUserModalOpen, setIsCreateNewUserModalOpen] =
    useState(false);
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector(
    (state) => state.userManagement
  );

  console.log("USERS", users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleSaveNewUser = (userData) => {
    dispatch(createNewUser(userData));
  };

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

  return (
    <>
      <Header />
      <ActionBar
        title="User management"
        componentType={"user_management"}
        searchPanelProps={
          {
            // onSearchChange: handleSearchChange,
            // onFiltersChange: handleFiltersChange,
            // folderOptions: folderOptions,
          }
        }
        buttons={[
          {
            label: "Export report",
            style: "red-outline",
            onClick: () => {
              console.log("Export report");
            },
          },
          {
            label: "New user",
            style: "red-shadow",
            onClick: () => setIsCreateNewUserModalOpen(true),
          },
        ]}
        modalsProps={{
          isCreateNewUserModalOpen: isCreateNewUserModalOpen,
          onCloseCreateNewUserModal: () => setIsCreateNewUserModalOpen(false),
          onSaveNewUser: handleSaveNewUser,
          //   onUpdateNewUser = () => {},
        }}
      />

      <div className="user-management-table-wrapper">
        <UserManagementTable tableData={users} />

        <Pagination
          currentPage={currentPage}
          totalItems={10}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* {currentFolders.length >= 1 && (
        <Pagination
          currentPage={currentPage}
          totalItems={searchInFilteredFolders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )} */}
    </>
  );
};

export default UserManagement;
