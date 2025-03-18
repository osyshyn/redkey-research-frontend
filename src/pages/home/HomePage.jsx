import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDeviceType from "../../hooks/useDeviceType";

import MobileModalWrapper from "../../components/MobileModalWrapper/MobileModalWrapper";

import burgerMenuIcon from "../../assets/homepage-icons/burger-menu.svg";
import keyGraphicIcon from "../../assets/homepage-icons/KeyGraphic.svg";
import mainDoorGraphicIcon from "../../assets/homepage-icons/MainDoorGraphic.svg";
import redkeyLogoIcon from "../../assets/homepage-icons/Redkey_Logo.svg";
import teamAntrimIcon from "../../assets/homepage-icons/Team_Antrim.svg";
import teamLafitteIcon from "../../assets/homepage-icons/Team_Lafitte.svg";
import teamPrytaniaIcon from "../../assets/homepage-icons/Team_Prytania.svg";
import teamPacificIcon from "../../assets/homepage-icons/Teams_Pacific.svg";

import DefaultResearchIcon from "../../assets/icons/default-research-icon.svg?react";
import MailIcon from "../../assets/icons/mail-icon.svg?react";
import PhoneIcon from "../../assets/icons/phone-icon.svg?react";
import AntrimResearchIcon from "../../assets/icons/antrim-research-icon.svg?react";
import LafitteResearchIcon from "../../assets/icons/lafitte-research-icon.svg?react";
import PrytaniaResearchIcon from "../../assets/icons/prytania-research-icon.svg?react";

import "./styles.scss";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuData = [
    {
      optionName: "Pacific Square Research",
      icon: <DefaultResearchIcon className="mobile-home-menu-icon" />,
    },
    {
      optionName: "Lafitte Research",
      icon: <LafitteResearchIcon className="mobile-home-menu-icon" />,
    },
    {
      optionName: "Prytania Research",
      icon: <PrytaniaResearchIcon className="mobile-home-menu-icon" />,
    },
    {
      optionName: "Antrim Research",
      icon: <AntrimResearchIcon className="mobile-home-menu-icon" />,
    },
  ];

  const navigate = useNavigate();
  const currentUserDevice = useDeviceType();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRequestAccessClick = () => {
    window.location.href =
      "mailto:info@redkeyresearch.com?subject=Research%20Inquiry&body=I'd%20like%20to%20be%20contacted%20about%20Redkey's%20research%20services.";
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className="home-page-header">
        <img
          src={burgerMenuIcon}
          className="burger-menu-icon"
          onClick={toggleMenu}
        />
        <img src={redkeyLogoIcon} className="redkey-logo-icon" />
      </div>
      <div className="home-page-container">
        <img src={mainDoorGraphicIcon} className="main-door-home-icon" />
      </div>

      <div className="home-login-button-wrapper">
        <img src={keyGraphicIcon} className="key-graphic-icon" />
        <p
          className="request-access-login-button"
          onClick={handleRequestAccessClick}
        >
          Request access
        </p>
        <hr className="horizontal-line-login-button" />
        <p className="request-access-login-button" onClick={handleLoginClick}>
          Login
        </p>
      </div>

      <div
        className={
          currentUserDevice === "desktop"
            ? "teams-info-wrapper"
            : "teams-info-wrapper-mobile"
        }
      >
        <div className="teams-container">
          <p className="teams-info-main-title">The redkey research teams</p>
          <div className="contact-info">
            <p>Email: info@redkeyresearch.com</p>
            <p>Phone: 646-631-0560</p>
          </div>
          <div className="teams-items-wrapper">
            <div className="team-item-container">
              <img src={teamPacificIcon} className="team-icon" />
              <p className="team-item-title">Pacific Square Research</p>
              <p className="team-item-description">
                Experts in forensic and fundamental analysis, uncovering
                companies with overstretretched business models and financial
                discrepancies.
              </p>
            </div>
            <div className="team-item-container">
              <img src={teamLafitteIcon} className="team-icon" />
              <p className="team-item-title">Lafitte Research</p>
              <p className="team-item-description">
                Focused on software sector short research, providing
                high-conviction ideas through proprietary data gathering.
              </p>
            </div>
            <div className="team-item-container">
              <img src={teamPrytaniaIcon} className="team-icon" />
              <p className="team-item-title">Prytania Research</p>
              <p className="team-item-description">
                Generating actionable short ideas in non-therapeutic healthcare
                through deep industry diligence.
              </p>
            </div>
            <div className="team-item-container">
              <img src={teamAntrimIcon} className="team-icon" />
              <p className="team-item-title">Antrim Research</p>
              <p className="team-item-description">
                Specializing in sourcing short ideas across cyclicals, offering
                insight into emerging market shifts.
              </p>
            </div>
          </div>
          <footer className="footer-home-page">© 2025 Redkey Research</footer>
        </div>
      </div>

      {currentUserDevice === "desktop" ? (
        isMenuOpen && (
          <div className="main-dropdown-menu">
            <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
              ✖
            </button>
            <div className="home-menu-item">
              <DefaultResearchIcon
                className="mobile-home-menu-icon"
                alt="Profile Icon"
              />
              <span>Pacific Square Research</span>
            </div>
            <div className="home-menu-item">
              <LafitteResearchIcon
                className="mobile-home-menu-icon"
                alt="Profile Icon"
              />
              <span>Lafitte Research</span>
            </div>
            <div className="home-menu-item">
              <PrytaniaResearchIcon
                className="mobile-home-menu-icon"
                alt="Profile Icon"
              />
              <span>Prytania Research</span>
            </div>
            <div className="home-menu-item">
              <AntrimResearchIcon
                className="mobile-home-menu-icon"
                alt="Profile Icon"
              />
              <span>Antrim Research</span>
            </div>
          </div>
        )
      ) : (
        <MobileModalWrapper
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        >
          <div className="mobile-options-list">
            {mobileMenuData.map((option) => (
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
      )}
    </>
  );
};

export default HomePage;
