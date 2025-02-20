import React, { forwardRef } from "react";

import ThemeToggle from "../ThemeToggle/ThemeToggle";

import settingsIcon from "../../assets/icons/settings-icon.svg";
import phoneIcon from "../../assets/icons/phone-icon.svg";
import logOutIcon from "../../assets/icons/log-out-icon.svg";

import "./styles.scss";

const DropdownMenu = forwardRef(
  (
    { isOpen, onProfileClick, onContactUsClick, onLogoutClick, currentUser },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <div className="dropdown-menu" ref={ref}>
        <div className="menu-header">
          <span>Settings</span>
          <ThemeToggle />
        </div>
        <div className="menu-item" onClick={onProfileClick}>
          <img
            src={settingsIcon}
            alt="Profile Icon"
            className="dropdown-menu-icon"
          />
          <span>Profile</span>
        </div>
        {currentUser?.role === 3 && (
          <div className="menu-item" onClick={onContactUsClick}>
            <img
              src={phoneIcon}
              alt="Contact us Icon"
              className="dropdown-menu-icon"
            />
            <span>Contact us</span>
          </div>
        )}
        <hr className="menu-divider" />
        <div className="menu-item" onClick={onLogoutClick}>
          <img
            src={logOutIcon}
            alt="Log Out Icon"
            className="dropdown-menu-icon"
          />
          <span>Log Out</span>
        </div>
      </div>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

export default DropdownMenu;
