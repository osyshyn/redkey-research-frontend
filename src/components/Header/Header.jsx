import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useDeviceType from "../../hooks/useDeviceType";
import { logoutUser, getProfile } from "../../store/slices/authSlice";
import {
  clearResearchFilters,
  clearUserManagementFilters,
} from "../../store/slices/filterSlice";
import { setCurrentFirm } from "../../store/slices/firmSlice";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import ProfileSettingsModal from "../ProfileSettingsModal/ProfileSettingsModal";
import ContactUsModal from "../ContactUsModal/ContactUsModal";
import ResearchFilesDropdown from "../ResearchFilesDropdown/ResearchFilesDropdown";
import MobileDropdownMenu from "../MobileDropdownMenu/MobileDropdownMenu";

import { getThemeName } from "../../utils/userHelpers";

import dropdownChevronIconRed from "../../assets/icons/dropdown-chevron-icon-red.svg";
import dropdownChevronIcon from "../../assets/icons/dropdown-chevron-icon.svg";
import logoDarkHeader from "../../assets/images/logo-header.png";
import logoLightHeader from "../../assets/images/logo-light-big.png";

import "./styles.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);

  const [isResearchDropdownOpen, setIsResearchDropdownOpen] = useState(false);
  const [researchDropdownPosition, setResearchDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  const menuRef = useRef(null);
  const menuIconRef = useRef(null);
  const researchButtonRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUserDevice = useDeviceType();

  const currentTheme = document.body.getAttribute("data-theme-mode");

  const { user } = useSelector((state) => state.auth);

  const firmsList = useSelector((state) => state.firm.firms);
  console.log("getProfile", user, firmsList);

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }

    if (location.pathname === "/admin/portal" && firmsList.length > 0) {
      const currentFirm = { name: "All" };
      if (currentFirm) {
        dispatch(setCurrentFirm(currentFirm));
      }
    } else if (location.pathname === "/user/portal" && firmsList.length > 0) {
      const currentFirm = user?.access[0].firm;
      if (currentFirm) {
        dispatch(setCurrentFirm(currentFirm));
      }
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");

    let themeToApply = savedTheme
      ? getThemeName(savedTheme)
      : user?.theme
      ? getThemeName(user.theme)
      : null;

    if (themeToApply) {
      document.body.setAttribute("data-theme-mode", themeToApply.toLowerCase());
    }

    if (user?.theme) {
      localStorage.setItem("selectedTheme", user?.theme);
    }
  }, [user?.theme]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeAllMenus = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      menuIconRef.current &&
      !menuIconRef.current.contains(e.target)
    ) {
      setIsMenuOpen(false);
    }
    if (
      researchButtonRef.current &&
      !researchButtonRef.current.contains(e.target)
    ) {
      setIsResearchDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeAllMenus);
    return () => {
      document.removeEventListener("click", closeAllMenus);
    };
  }, []);

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleContactUsClick = () => {
    setIsContactUsModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleAdminResearchOptionClick = (firmOption) => {
    // localStorage.setItem("currentFirm", JSON.stringify(firmOption));
    dispatch(setCurrentFirm(firmOption));
    dispatch(clearUserManagementFilters());
    setIsResearchDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/admin/portal");
  };

  const handleUserResearchOptionClick = (firmOption) => {
    // localStorage.setItem("currentFirm", JSON.stringify(firmOption));
    dispatch(setCurrentFirm(firmOption));
    dispatch(clearUserManagementFilters());
    setIsResearchDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/user/portal");
  };

  const handleResearchClick = (e) => {
    e.stopPropagation();
    if (!isResearchDropdownOpen) {
      const rect = researchButtonRef.current.getBoundingClientRect();
      setResearchDropdownPosition({ top: rect.bottom, left: rect.left });
    }
    setIsResearchDropdownOpen((prev) => !prev);
  };

  const handleNavigateToUserManagement = () => {
    dispatch(clearResearchFilters());
    navigate("/admin/user-management");
  };

  const adminResearchDropdownOptions = [
    {
      optionName: "All",
      onOptionClick: () => handleAdminResearchOptionClick({ name: "All" }),
    },
    ...firmsList.map((firmOption) => ({
      optionName: firmOption.name,
      onOptionClick: () => handleAdminResearchOptionClick(firmOption),
    })),
  ];

  const userResearchDropdownOptions = firmsList.map((firmOption) => ({
    optionName: firmOption.name,
    onOptionClick: () => handleUserResearchOptionClick(firmOption),
  }));

  const rolesConfig = {
    1: { path: "/user/portal", options: userResearchDropdownOptions },
    2: { path: "/admin/portal", options: adminResearchDropdownOptions },
    3: {
      path: "/admin/portal",
      options: adminResearchDropdownOptions,
      userManagement: true,
    },
  };

  const roleData = rolesConfig[user?.role];

  return (
    <header className="header">
      <div className="logo-container">
        <img
          src={
            currentTheme === "dark" || currentTheme === null
              ? logoDarkHeader
              : logoLightHeader
          }
          alt="Logo"
          className="logo"
        />
      </div>

      {roleData && currentUserDevice === "desktop" && (
        <nav className="nav-links">
          <span
            className={`nav-link ${
              location.pathname === roleData.path ? "active" : ""
            }`}
            onClick={handleResearchClick}
            ref={researchButtonRef}
          >
            Research files
            <img
              src={
                location.pathname === roleData.path
                  ? dropdownChevronIconRed
                  : dropdownChevronIcon
              }
              alt="Dropdown Chevron"
              className="header-dropdown-icon"
            />
          </span>
          {isResearchDropdownOpen && (
            <ResearchFilesDropdown
              position={researchDropdownPosition}
              options={roleData.options}
            />
          )}
          {roleData.userManagement && (
            <span
              className={`nav-link ${
                location.pathname === "/admin/user-management" ? "active" : ""
              }`}
              onClick={handleNavigateToUserManagement}
            >
              User management
            </span>
          )}
        </nav>
      )}

      <div className="menu-icon" onClick={toggleMenu} ref={menuIconRef}></div>

      {isMenuOpen && currentUserDevice === "desktop" && (
        <DropdownMenu
          isOpen={isMenuOpen}
          ref={menuRef}
          onProfileClick={handleProfileClick}
          onContactUsClick={handleContactUsClick}
          onLogoutClick={handleLogoutClick}
          currentUser={user}
        />
      )}

      {isMenuOpen && currentUserDevice === "mobile" && (
        <MobileDropdownMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onProfileClick={handleProfileClick}
          onContactUsClick={handleContactUsClick}
          onLogoutClick={handleLogoutClick}
          onUserManagementClick={handleNavigateToUserManagement}
          currentUser={user}
          researchOptions={
            user?.role === 1
              ? userResearchDropdownOptions
              : adminResearchDropdownOptions
          }
        />
      )}

      {isProfileModalOpen && (
        <ProfileSettingsModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          initialProfile={{
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          }}
        />
      )}

      {isContactUsModalOpen && (
        <ContactUsModal
          isOpen={isContactUsModalOpen}
          onClose={() => setIsContactUsModalOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
