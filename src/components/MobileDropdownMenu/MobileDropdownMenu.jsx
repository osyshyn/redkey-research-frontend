import { useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import closeIcon from "../../assets/icons/close-icon.svg";
import SettingsIcon from "../../assets/icons/settings-icon.svg?react";
import PhoneIcon from "../../assets/icons/phone-icon.svg?react";
import LogOutIcon from "../../assets/icons/log-out-icon.svg?react";
import AntrimResearchIcon from "../../assets/icons/antrim-research-icon.svg?react";
import DefaultResearchIcon from "../../assets/icons/default-research-icon.svg?react";
import LafitteResearchIcon from "../../assets/icons/lafitte-research-icon.svg?react";
import PrytaniaResearchIcon from "../../assets/icons/prytania-research-icon.svg?react";
import UsersIcon from "../../assets/icons/users-icon.svg?react";

import "./styles.scss";

const MobileDropdownMenu = ({
  isOpen,
  onClose,
  onProfileClick,
  onContactUsClick,
  onLogoutClick,
  onUserManagementClick,
  currentUser,
  researchOptions,
}) => {
  const iconMap = {
    Antrim: AntrimResearchIcon,
    Lafitte: LafitteResearchIcon,
    Prytania: PrytaniaResearchIcon,
  };

  const currentFirm = useSelector((state) => state.firm.currentFirm);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  console.log("researchOptions", researchOptions);

  return ReactDOM.createPortal(
    <div className="mobile-modal-overlay" onClick={onClose}>
      <div className="mobile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mobile-modal-close-button" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        <div className="mobile-menu-options-list">
          <div className="mobile-menu-header">
            <span>Teams</span>
          </div>
          <div className="mobile-research-options-list">
            {researchOptions.map((researchOption) => {
              const optionName = researchOption.optionName;
              const optionHandler = researchOption.onOptionClick;
              const OptionIcon = iconMap[optionName] || DefaultResearchIcon;

              return (
                <div
                  key={optionName}
                  className={`mobile-menu-option-item ${
                    currentFirm.name === optionName ? "chosen-option" : ""
                  }`}
                  onClick={optionHandler}
                >
                  <OptionIcon
                    className={`mobile-dropdown-menu-icon ${
                      currentFirm.name === optionName
                        ? "chosen-option-icon"
                        : ""
                    }`}
                  />
                  {optionName.charAt(0).toUpperCase() + optionName.slice(1)}
                </div>
              );
            })}
          </div>
          {currentUser?.role === 3 && (
            <>
              <div className="mobile-menu-header">
                <span>User managemenet</span>
              </div>
              <div
                className="mobile-menu-option-item"
                onClick={onUserManagementClick}
              >
                <UsersIcon
                  className="mobile-dropdown-menu-icon"
                  alt="Report Icon"
                />
                <span>Report</span>
              </div>
            </>
          )}
          <div className="mobile-menu-header">
            <span>Settings</span>
            <ThemeToggle />
          </div>
          <div className="mobile-menu-option-item" onClick={onProfileClick}>
            <SettingsIcon
              className="mobile-dropdown-menu-icon"
              alt="Profile Icon"
            />
            <span>Profile</span>
          </div>
          {currentUser?.role === 1 && (
            <div className="mobile-menu-option-item" onClick={onContactUsClick}>
              <PhoneIcon
                className="mobile-dropdown-menu-icon"
                alt="Contact us Icon"
              />
              <span>Contact us</span>
            </div>
          )}

          <div className="mobile-menu-option-item" onClick={onLogoutClick}>
            <LogOutIcon
              className="mobile-dropdown-menu-icon"
              alt="Log Out Icon"
            />
            <span>Log Out</span>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default MobileDropdownMenu;

{
  /* 
      { isMenuOpen && currentUserDevice === "mobile" && ( 
        <MobileModalWrapper
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        >
          <div className="mobile-options-list">
            {mobileMoreiconData.options?.map((option) => (
              <div
                key={option.optionName}
                className="mobile-option-item"
                onClick={option.onOptionClick}
              >
                {option.icon}
                <span>{option.optionName}</span>
              </div>
            ))}
          </div>
        </MobileModalWrapper>
      )} */
}
