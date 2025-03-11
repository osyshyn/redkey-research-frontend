import React, {useEffect} from "react";
import useDeviceType from "../../hooks/useDeviceType";
import closeIcon from "../../assets/icons/close-icon.svg";
import backMobileIcon from "../../assets/icons/back-mobile-icon.svg";

import "./styles.scss";

const CustomModal = ({ isOpen, onClose, modalTitle, style = {}, children }) => {
  const currentUserDevice = useDeviceType();

  // for scroll purposes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed"; 
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
    }
  
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
    };
  }, [isOpen]);
  

  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose} style={style}>
    {currentUserDevice === "mobile" && (
          <>
            <div className="mobile-custom-modal-header">
              <img
                src={backMobileIcon}
                alt="Back"
                className="back-arrow"
                onClick={onClose}
              />
              <h1 className="mobile-custom-modal-title">{modalTitle}</h1>
            </div>
          </>
        )}
      <div
        className="custom-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {currentUserDevice === "desktop" && (
          <>
            <div className="custom-modal-close" onClick={onClose}>
              <img src={closeIcon} alt="close" />
            </div>
            <p className="custom-modal-title">{modalTitle}</p>
          </>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
