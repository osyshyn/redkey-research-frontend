import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import useDeviceType from "../../hooks/useDeviceType";
import CustomModal from "../CustomModal/CustomModal";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButton/CustomButton";
import { changePassword, changeProfile } from "../../store/slices/authSlice";

import "./styles.scss";

const ProfileSettingsModal = ({
  isOpen = false,
  onClose = () => {},
  initialProfile = { first_name: "", last_name: "", email: "" },
}) => {
  const [mode, setMode] = useState("profile");
  const [profileData, setProfileData] = useState(initialProfile);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileDataError, setProfileDataError] = useState("");

  const currentUserDevice = useDeviceType();

  const modalRoot = document.getElementById("modal-root");

  const dispatch = useDispatch();

  const handleSaveProfile = () => {
    dispatch(changeProfile(profileData))
      .unwrap()
      .then(() => {
        setProfileDataError("");
        onClose();
      })
      .catch((error) => {
        setProfileDataError(error);
      });
  };

  const handleSavePassword = () => {
    const passwordData = {
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    dispatch(changePassword(passwordData))
      .unwrap()
      .then(() => {
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setMode("profile");
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
            modalTitle={
              mode === "profile" ? "Profile Settings" : "Change Password"
            }
          >
            {mode === "profile" ? (
              // ======== PROFILE SETTINGS =========
              <>
                <div
                  className={`${
                    currentUserDevice === "desktop"
                      ? "profile-first-last-name"
                      : ""
                  }`}
                >
                  <CustomInput
                    label="Name"
                    placeholder="First name"
                    value={profileData.first_name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        first_name: e.target.value,
                      })
                    }
                  />
                  <CustomInput
                    label="Last Name"
                    placeholder="Last name"
                    value={profileData.last_name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        last_name: e.target.value,
                      })
                    }
                    // showLabel="input-hide-label"
                    showLabel={`${
                      currentUserDevice === "desktop" ? "input-hide-label" : ""
                    }`}
                  />
                </div>
                <CustomInput
                  label="Email"
                  placeholder="example@mail.com"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
                {profileDataError && (
                  <p className="profile-data-error-message">
                    {profileDataError}
                  </p>
                )}
                <p
                  className="change-password-link"
                  onClick={() => setMode("changePassword")}
                >
                  Change Password
                </p>

                <CustomButton
                  label="Save Changes"
                  style="red-shadow"
                  onClick={handleSaveProfile}
                />
              </>
            ) : (
              // ======== CHANGE PASSWORD =========
              <>
                <CustomInput
                  label="New Password"
                  placeholder="Enter new password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={passwordError ? true : false}
                />
                <CustomInput
                  label="Re-enter Password"
                  placeholder="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={passwordError ? true : false}
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
              </>
            )}
          </CustomModal>,
          modalRoot
        )}
    </>
  );
};

export default ProfileSettingsModal;
