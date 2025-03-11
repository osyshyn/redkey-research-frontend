import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectAuth,
  changePassword,
  clearAuthError,
} from "../../store/slices/authSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import logoBig from "../../assets/images/logo-big.png";
import logoLightBig from "../../assets/images/logo-light-big.png";

import "./styles.scss";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const { status, error } = useSelector(selectAuth);

  const currentTheme = document.body.getAttribute("data-theme-mode");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handlePasswordChange = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value,
    });
    setPasswordError("");
  };

  const handleSave = () => {
    if (passwords.new_password === "") {
      setPasswordError("New Password field cannot be empty.");
      return;
    }
    if (passwords.confirm_password === "") {
      setPasswordError("Confirm Password field cannot be empty.");
      return;
    }
    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordError("Passwords do not match!");
      return;
    }

    if (passwords.new_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long!");
      return;
    }

    console.log("Password saved:", passwords.new_password);

    const passwordData = {
      new_password: passwords.new_password,
      confirm_password: passwords.confirm_password,
    };

    dispatch(changePassword(passwordData))
      .unwrap()
      .then(() => {
        setPasswords("");
        setPasswordError("");
      })
      .catch((error) => {
        setPasswordError(error);
      });
  };

  return (
    <div className="reset-password-page">
      <img
        className="logo-big"
        src={
          currentTheme === "dark" || currentTheme === null
            ? logoBig
            : logoLightBig
        }
        alt="Logo"
      />
      <h1 className="title">Reset Password</h1>
      <div className="form">
        <CustomInput
          label="New Password"
          placeholder="Enter your password"
          type="password"
          name="new_password"
          value={passwords.new_password}
          onChange={handlePasswordChange}
          error={passwordError ? true : false}
        />

        <CustomInput
          label="Re-enter password"
          placeholder="Enter your password"
          type="password"
          name="confirm_password"
          value={passwords.confirm_password}
          onChange={handlePasswordChange}
          error={passwordError ? true : false}
        />
        {passwordError && <p className="error-text">{passwordError}</p>}
        <div className="reset-password-save-button-wrapper">
          <CustomButton
            label="Save"
            style="red-shadow"
            onClick={handleSave}
            disabled={status === "loading"}
          />
        </div>
        {error && <p className="error-text">Error: {error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
