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

import "./styles.scss";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuData = [
    {
      optionName: "BK Partners",
      icon: <DefaultResearchIcon className="mobile-home-menu-icon" />,
      onOptionClick: () => {
        window.open("https://bkresearch.com/", "_blank", "noopener noreferrer");
      },
    },
    {
      optionName: "Email: info@redkeyresearch.com",
      icon: <MailIcon className="mobile-home-menu-icon" />,
    },
    {
      optionName: "Phone: 646-631-0560",
      icon: <PhoneIcon className="mobile-home-menu-icon" />,
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

      <div className="teams-info-wrapper">
        <div>
          <p className="teams-info-main-title">The redkey research teams</p>
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
        <div className={`burger-menu ${isMenuOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
            ✖
          </button>
          <a
            href="https://bkresearch.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            BK Partners
          </a>
          <div className="contact-info">
            <p>Email: info@redkeyresearch.com</p>
            <p>Phone: 646-631-0560</p>
          </div>
        </div>
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
