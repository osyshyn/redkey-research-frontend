import React from "react";
import closeIcon from "../../assets/icons/close-icon.svg";

import "./styles.scss";

const CustomModal = ({ isOpen, onClose, modalTitle, style = {}, children }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose} style={style}>
      <div
        className="custom-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-modal-close" onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </div>
        <p className="custom-modal-title">{modalTitle}</p>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
