import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import CustomModal from "../CustomModal/CustomModal";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButton/CustomButton";
import { changeUserPassword } from "../../store/slices/userManagementSlice";

import "./styles.scss";

const ChangeUserPasswordModal = ({
  isOpen = false,
  onClose = () => {},
  userData,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const modalRoot = document.getElementById("modal-root");

  const dispatch = useDispatch();

  const handleSavePassword = () => {
    const passwordData = {
      user_id: userData.id,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    dispatch(changeUserPassword(passwordData))
      .unwrap()
      .then(() => {
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
      })
      .catch((error) => {
        setPasswordError(error);
      });
  };

  return (
    <>
      {modalRoot &&
        ReactDOM.createPortal(
          <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            modalTitle={"Change user password"}
          >
            <CustomInput
              label="New Password"
              placeholder="Enter new password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <CustomInput
              label="Re-enter Password"
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <p className="password-error-message">{passwordError}</p>
            )}
            <div className="modal-actions-button">
              <CustomButton
                label="Save New Password"
                style="red-shadow"
                onClick={handleSavePassword}
              />
            </div>
          </CustomModal>,
          modalRoot
        )}
    </>
  );
};

export default ChangeUserPasswordModal;
