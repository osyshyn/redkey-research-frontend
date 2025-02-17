import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import dropdownChevronIconRed from "../../assets/icons/dropdown-chevron-icon-red.svg";
import dropdownChevronIcon from "../../assets/icons/dropdown-chevron-icon.svg";
import logoHeader from "../../assets/images/logo-header.png";

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

  const { user } = useSelector((state) => state.auth);
  console.log("getProfile", user);
  const firmsList = useSelector((state) => state.firm.firms);

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

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

  const handleResearchOptionClick = (firmOption) => {
    dispatch(setCurrentFirm(firmOption));
    dispatch(clearUserManagementFilters());
    setIsResearchDropdownOpen(false);
    navigate("/admin/portal");
  };

  const handleResearchClick = (e) => {
    e.stopPropagation();
    if (!isResearchDropdownOpen) {
      const rect = researchButtonRef.current.getBoundingClientRect();
      setResearchDropdownPosition({ top: rect.bottom, left: rect.left });
    }
    setIsResearchDropdownOpen((prev) => !prev);
  };

  const researchDropdownOptions = firmsList.map((firmOption) => ({
    optionName: firmOption.name,
    onOptionClick: () => handleResearchOptionClick(firmOption),
  }));

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoHeader} alt="Logo" className="logo" />
      </div>

      {user?.role === 3 && (
        <nav className="nav-links">
          <span
            className={`nav-link ${
              location.pathname === "/admin/portal" ? "active" : ""
            }`}
            onClick={handleResearchClick}
            ref={researchButtonRef}
          >
            Research files
            <img
              src={
                location.pathname === "/admin/portal"
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
              options={researchDropdownOptions}
            />
          )}

          <span
            className={`nav-link ${
              location.pathname === "/admin/user-management" ? "active" : ""
            }`}
            onClick={() => {
              dispatch(clearResearchFilters());
              navigate("/admin/user-management");
            }}
          >
            User management
          </span>
        </nav>
      )}

      <div className="menu-icon" onClick={toggleMenu} ref={menuIconRef}></div>

      {isMenuOpen && (
        <DropdownMenu
          isOpen={isMenuOpen}
          ref={menuRef}
          onProfileClick={handleProfileClick}
          onContactUsClick={handleContactUsClick}
          onLogoutClick={handleLogoutClick}
          currentUser={user}
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
