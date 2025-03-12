import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  getFirms,
  createFirm,
  deleteFirm,
  updateFirm,
  setCurrentFirm,
} from "../../store/slices/firmSlice";

import CustomButton from "../CustomButton/CustomButton";
import CustomModal from "../CustomModal/CustomModal";
import CustomInput from "../CustomInput/CustomInput";
import DeleteModal from "../DeleteModal/DeleteModal";

import "./styles.scss";

const FirmsModal = ({ isOpen = false, onClose = () => {} }) => {
  const modalRoot = document.getElementById("modal-root");
  const dispatch = useDispatch();
  const firmsList = useSelector((state) => state.firm.firms);
  const currentFirmState = useSelector((state) => state.firm.currentFirm);

  const [isCreateFirmModalOpen, setIsCreateFirmModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [firmItemToDelete, setFirmItemToDelete] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFirmItem, setCurrentFirmItem] = useState(null);
  const [firmName, setFirmName] = useState("");

  useEffect(() => {
    if (isOpen) {
      dispatch(getFirms());
    }
  }, [dispatch, isOpen]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setFirmName("");
    setIsCreateFirmModalOpen(true);
  };

  const handleOpenEditModal = (firm) => {
    setIsEditMode(true);
    setCurrentFirmItem(firm);
    setFirmName(firm.name);
    setIsCreateFirmModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateFirmModalOpen(false);
    setIsEditMode(false);
    setCurrentFirmItem(null);
    setFirmName("");
  };

  const handleSaveFirm = () => {
    if (isEditMode) {
      dispatch(updateFirm({ id: currentFirmItem.id, name: firmName }));
    } else {
      dispatch(createFirm(firmName));
    }
    handleCloseCreateModal();
  };

  const handleDeleteFirm = () => {
    console.log("currentFirmState", currentFirmState, [firmItemToDelete.id]);

    dispatch(deleteFirm([firmItemToDelete.id]));
    setIsDeleteModalOpen(false);
    if (currentFirmState.id === firmItemToDelete.id) {
      dispatch(setCurrentFirm({ name: "All" }));
    }
  };

  return (
    <>
      {modalRoot &&
        ReactDOM.createPortal(
          <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            modalTitle="Firms Management"
            style={{ visibility: isCreateFirmModalOpen ? "hidden" : "visible" }}
          >
            <div className="firms-table-container">
              <table className="firms-table">
                <tbody>
                  {firmsList.map((item) => (
                    <tr key={item.id}>
                      <td className="firms-table-item-title">{item.name}</td>
                      <td className="firms-table-data-item">
                        <div className="actions-column">
                          <div
                            className="firms-action-btn"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            Edit
                          </div>
                          <div
                            className="firms-action-btn"
                            onClick={() => {
                              setFirmItemToDelete(item);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CustomButton
              label="+ Add New Firm"
              style="red-shadow"
              onClick={handleOpenCreateModal}
            />
          </CustomModal>,
          modalRoot
        )}

      {modalRoot &&
        ReactDOM.createPortal(
          <CustomModal
            isOpen={isCreateFirmModalOpen}
            onClose={handleCloseCreateModal}
            modalTitle={isEditMode ? "Edit Firm" : "Create New Firm"}
          >
            <CustomInput
              label="Firm Name"
              placeholder="Enter firm name"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
            />
            <div className="modal-actions-button">
              <CustomButton
                label={isEditMode ? "Save Changes" : "Create"}
                style="red-shadow"
                onClick={handleSaveFirm}
              />
            </div>
          </CustomModal>,
          modalRoot
        )}

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          itemToDelete={firmItemToDelete?.name}
          deleteButtonTitle="Delete Firm"
          onDelete={handleDeleteFirm}
        />
      )}
    </>
  );
};

export default FirmsModal;
