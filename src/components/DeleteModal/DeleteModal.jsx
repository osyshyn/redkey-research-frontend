import React from "react";
import closeIcon from "../../assets/icons/close-icon.svg";
import deleteDangerIcon from "../../assets/icons/delete-danger-icon.svg";

import "./styles.scss";

const DeleteModal = ({
  isOpen,
  onClose,
  itemToDelete,
  deleteButtonTitle,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="delete-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-close" onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </div>

        <div className="delete-modal-info">
          <img
            className="delete-modal-danger-icon"
            src={deleteDangerIcon}
            alt="delete danger"
          />
          <p className="delete-modal-title">Are you sure you want to delete?</p>
          <p className="delete-modal-description">
            The action of deleting {itemToDelete} is <br /> irreversible. Click
            the button below to delete.
          </p>
        </div>
        <div className="delete-modal-actions">
          <button className="delete-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="delete-modal-delete"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            {deleteButtonTitle}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
