import React, { useState } from "react";
import ReactDOM from "react-dom";
import useDeviceType from "../../hooks/useDeviceType";
import CustomModal from "../CustomModal/CustomModal";

import PhoneIcon from "../../assets/icons/phone-icon.svg?react";
import AddressIcon from "../../assets/icons/address-icon.svg?react";

import "./styles.scss";

const ContactUsModal = ({ isOpen = false, onClose = () => {} }) => {
  const modalRoot = document.getElementById("modal-root");
  const phoneNumber = "646-631-0560";
  const [copySuccess, setCopySuccess] = useState("Copy");

  const currentUserDevice = useDeviceType();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess("Copy"), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess("Copy"), 2000);
    }
  };

  return (
    <>
      {modalRoot &&
        ReactDOM.createPortal(
          <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            modalTitle={
              currentUserDevice === "desktop"
                ? "Any questions? Contact us."
                : "Contact us"
            }
          >
            {currentUserDevice === "mobile" && <p className="mobile-contact-us-title-info">Any questions? Contact us.</p>}
            <p className="contact-us-under-title-info">
              Our team of specialists is available during business hours.
            </p>

            <div className="contact-us-phone-wrapper">
              <div className="contact-us-info">
                <p className="contact-us-paragraph-title">
                  <PhoneIcon className="contact-us-icon" alt="phone icon" />
                  Phone number
                </p>
                <p className="contact-us-paragraph-info">{phoneNumber}</p>
              </div>
              <div className="contact-us-copy" onClick={handleCopy}>
                {copySuccess && (
                  <span className="copy-success">{copySuccess}</span>
                )}
              </div>
            </div>

            <div className="contact-us-info">
              <p className="contact-us-paragraph-title">
                <AddressIcon className="contact-us-icon" alt="address icon" />
                Address
              </p>
              <p className="contact-us-paragraph-info">
                930 Tahoe Blvd, Ste 802, PMB 307 - Incline Village, NV 89451
              </p>
            </div>
          </CustomModal>,
          modalRoot
        )}
    </>
  );
};

export default ContactUsModal;
