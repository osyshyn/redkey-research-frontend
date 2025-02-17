import React, { useState } from "react";
import ReactDOM from "react-dom";

import CustomModal from "../CustomModal/CustomModal";

import phoneIcon from "../../assets/icons/phone-icon.svg";
import addressIcon from "../../assets/icons/address-icon.svg";

import "./styles.scss";

const ContactUsModal = ({ isOpen = false, onClose = () => {} }) => {
  const modalRoot = document.getElementById("modal-root");
  const phoneNumber = "646-631-0560";
  const [copySuccess, setCopySuccess] = useState("Copy");

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
            modalTitle={"Any questions? Contact us."}
          >
            <p className="contact-us-under-title-info">
              Our team of specialists is available during business hours.
            </p>

            <div className="contact-us-phone-wrapper">
              <div className="contact-us-info">
                <p className="contact-us-paragraph-title">
                  <img
                    className="contact-us-icon"
                    src={phoneIcon}
                    alt="phone icon"
                  />
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
                <img
                  className="contact-us-icon"
                  src={addressIcon}
                  alt="address icon"
                />
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
