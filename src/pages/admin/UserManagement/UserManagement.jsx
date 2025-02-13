import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserManagementFilters } from "../../../store/slices/filterSlice";
import {
  getUsers,
  updateUser,
} from "../../../store/slices/userManagementSlice";
import { createNewUser } from "../../../store/slices/userManagementSlice";
import { clearUserManagementFilters } from "../../../store/slices/filterSlice";

import Header from "../../../components/Header/Header";
import UserManagementTable from "../../../components/UserManagementTable/UserManagementTable";
import Pagination from "../../../components/Pagination/Pagination";
import ActionBar from "../../../components/ActionBar/ActionBar";
import Loader from "../../../components/Loader/Loader";

import "./styles.scss";

const UserManagement = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [isCreateNewUserModalOpen, setIsCreateNewUserModalOpen] =
    useState(false);
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector(
    (state) => state.userManagement
  );

  const firmsList = useSelector((state) => state.firm.firms);
  const { userManagementFilters } = useSelector((state) => state.filters);

  console.log("USERS", users);

  console.log("userManagementFilters", userManagementFilters);

  const filteredUsers = users.filter((user) => {
    return userManagementFilters.every((filter) => {
      const filterType = filter.type.value;
      const filterValue = filter.value.value;

      if (filterType === "registered_by") {
        return user.creator?.id === filterValue.id;
      }

      if (filterType === "accesses") {
        return user.access?.some(
          (firmObj) =>
            firmObj.firm.id === filterValue.id && firmObj.value === true
        );
      }

      return true;
    });
  });

  const searchInFilteredUsers = searchValue
    ? filteredUsers.filter((user) =>
        [user.first_name, user.last_name, user.email].some((field) =>
          field.toLowerCase().includes(searchValue.toLowerCase())
        )
      )
    : filteredUsers;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = searchInFilteredUsers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleSaveNewUser = (userData) => {
    console.log("TEST CREATE USER");

    dispatch(clearUserManagementFilters());
    dispatch(createNewUser(userData));
  };
  const handleUpdateUser = (updatedUserData) => {
    dispatch(clearUserManagementFilters());
    dispatch(updateUser(updatedUserData));
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
    dispatch(setUserManagementFilters(newFilters));
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <ActionBar
        title="User management"
        componentType={"user_management"}
        searchPanelProps={{
          onSearchChange: handleSearchChange,
          onFiltersChange: handleFiltersChange,
          users: users,
          firmsList: firmsList,
        }}
        buttons={[
          {
            label: "Export report",
            style: "red-outline",

            onClick: () => {
              const event = new CustomEvent("trigger-pdf-export");
              document.dispatchEvent(event);
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
        }}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          {currentUsers.length > 0 ? (
            <div className="user-management-table-wrapper">
              <UserManagementTable
                tableData={currentUsers}
                onUpdateUser={handleUpdateUser}
              />
              {currentUsers.length >= 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={searchInFilteredUsers.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  itemsPerPageOptions={[8, 16, 24]}
                />
              )}
            </div>
          ) : (
            <p className="no-users-message">No users available to display</p>
          )}
        </>
      )}
    </>
  );
};

export default UserManagement;
