import React, { forwardRef } from "react";

import ThemeToggle from "../ThemeToggle/ThemeToggle";

import SettingsIcon from "../../assets/icons/settings-icon.svg?react";
import PlusIcon from "../../assets/icons/plus-icon.svg?react";
import PhoneIcon from "../../assets/icons/phone-icon.svg?react";
import LogOutIcon from "../../assets/icons/log-out-icon.svg?react";

import "./styles.scss";

const DropdownMenu = forwardRef(
  (
    {
      isOpen,
      onProfileClick,
      onContactUsClick,
      onLogoutClick,
      currentUser,
      adminDesktopAddFirmProps,
      componentType,
    },
    ref
  ) => {
    const { setIsFirmsModalOpen } = adminDesktopAddFirmProps;
    if (!isOpen) return null;

    return (
      <div className="dropdown-menu" ref={ref}>
        <div className="menu-header">
          <span>Settings</span>
          <ThemeToggle />
        </div>
        <div className="menu-item" onClick={onProfileClick}>
          <SettingsIcon className="dropdown-menu-icon" alt="Profile Icon" />
          <span>Profile</span>
        </div>
        {currentUser?.role === 3 &&
          componentType === "admin_portal" && (
            <div
              className="menu-item"
              onClick={() => {
                setIsFirmsModalOpen(true);
              }}
            >
              <PlusIcon className="dropdown-menu-icon" alt="Add Icon" />
              <span>Add/remove research team</span>
            </div>
          )}
        {currentUser?.role === 1 && (
          <div className="menu-item" onClick={onContactUsClick}>
            <PhoneIcon className="dropdown-menu-icon" alt="Contact us Icon" />
            <span>Contact us</span>
          </div>
        )}
        <hr className="menu-divider" />
        <div className="menu-item" onClick={onLogoutClick}>
          <LogOutIcon alt="Log Out Icon" className="dropdown-menu-icon" />
          <span>Log Out</span>
        </div>
      </div>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

export default DropdownMenu;
