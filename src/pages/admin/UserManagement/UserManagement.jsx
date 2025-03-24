import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserManagementFilters } from "../../../store/slices/filterSlice";
import {
  getUsers,
  updateUser,
} from "../../../store/slices/userManagementSlice";
import { createNewUser } from "../../../store/slices/userManagementSlice";
import { clearUserManagementFilters } from "../../../store/slices/filterSlice";

import useDeviceType from "../../../hooks/useDeviceType";

import Header from "../../../components/Header/Header";
import UserManagementTable from "../../../components/UserManagementTable/UserManagementTable";
import Pagination from "../../../components/Pagination/Pagination";
import ActionBar from "../../../components/ActionBar/ActionBar";
import Loader from "../../../components/Loader/Loader";
import MobileModalWrapper from "../../../components/MobileModalWrapper/MobileModalWrapper";

import MobileActionAddIcon from "../../../assets/icons/mobile-action-add-button.svg?react";
import PlusIcon from "../../../assets/icons/plus-icon.svg?react";
import FileUploadIcon from "../../../assets/icons/file-upload-icon.svg?react";
import forgotPasswordNotificationIcon from "../../../assets/icons/red-done-circle-icon.svg";
import logoBig from "../../../assets/images/logo-big.png";
import logoLightBig from "../../../assets/images/logo-light-big.png";

import "./styles.scss";

const UserManagement = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const [isCreateNewUserModalOpen, setIsCreateNewUserModalOpen] =
    useState(false);

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mobileActionAddData, setMobileActionAddData] = useState({
    options: [],
  });
  const dispatch = useDispatch();
  const currentUserDevice = useDeviceType();

  const { users, loading, error } = useSelector(
    (state) => state.userManagement
  );

  const firmsList = useSelector((state) => state.firm.firms);
  const { userManagementFilters } = useSelector((state) => state.filters);
  const { user } = useSelector((state) => state.auth);
  const currentTheme = document.body.getAttribute("data-theme-mode");

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
    ? filteredUsers.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const normalizedSearch = searchValue.toLowerCase();

        return (
          [fullName, user.first_name, user.last_name, user.email, user.company]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(normalizedSearch)) ||
          fullName.startsWith(normalizedSearch) ||
          fullName.includes(normalizedSearch)
        );
      })
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

  const handleOpenMobileModal = () => {
    // e.stopPropagation();

    setMobileActionAddData({
      options: [
        {
          optionName: "Create new user",
          icon: <PlusIcon className="mobile-dropdown-menu-icon" />,
          onOptionClick: () => {
            setIsCreateNewUserModalOpen(true);
          },
        },
        {
          optionName: "Export report",
          icon: <FileUploadIcon className="mobile-dropdown-menu-icon" />,
          onOptionClick: () => {
            const event = new CustomEvent("trigger-pdf-export");
            document.dispatchEvent(event);
          },
        },
      ],
    });

    setIsMobileModalOpen(true);
  };

  if (user?.role === 1) {
    return (
      <div className="user-management-error-container">
        <img
          className="logo-big"
          src={
            currentTheme === "dark" || currentTheme === null
              ? logoBig
              : logoLightBig
          }
          alt="Logo"
        />
        <div className="notification">
          <img
            className="notification-icon"
            src={forgotPasswordNotificationIcon}
            alt="Notification Icon"
          />
          <p className="notification-text">
            Unfortunately, you do not have the necessary permissions to access
            this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header componentType={"user_management"} />
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
        mobileButton={{
          label: <MobileActionAddIcon className="action-bar-plus-icon" />,
          style: "red-shadow",
          onClick: handleOpenMobileModal,
        }}
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
            <>
              <div className="user-management-table-wrapper">
                <UserManagementTable
                  tableData={currentUsers}
                  onUpdateUser={handleUpdateUser}
                />
                {currentUsers.length >= 1 &&
                  currentUserDevice === "desktop" && (
                    <Pagination
                      currentPage={currentPage}
                      totalItems={searchInFilteredUsers.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                      onItemsPerPageChange={handleItemsPerPageChange}
                      itemsPerPageOptions={[25, 50, 100]}
                    />
                  )}
              </div>
              {currentUsers.length >= 1 && currentUserDevice === "mobile" && (
                <div className="pagination-user-management-container">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={searchInFilteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    itemsPerPageOptions={[25, 50, 100]}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="no-users-message">No users available to display</p>
          )}
        </>
      )}

      {currentUserDevice === "mobile" && (
        <MobileModalWrapper
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        >
          <div className="mobile-options-list">
            {mobileActionAddData.options?.map((option) => (
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
    </>
  );
};

export default UserManagement;
