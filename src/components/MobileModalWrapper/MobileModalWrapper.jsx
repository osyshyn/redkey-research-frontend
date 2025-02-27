import { useEffect } from "react";
import ReactDOM from "react-dom";
import closeIcon from "../../assets/icons/close-icon.svg";

import "./styles.scss";

const MobileModalWrapper = ({ isOpen, onClose, children }) => {
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

  return ReactDOM.createPortal(
    <div className="mobile-modal-overlay" onClick={onClose}>
      <div className="mobile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mobile-modal-close-button" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default MobileModalWrapper;
