import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectAuth,
  changeResetPassword,
  clearAuthError,
} from "../../store/slices/authSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import { checkForgotTokenAPI } from "../../api/authApi";
import forgotPasswordNotificationIcon from "../../assets/icons/red-done-circle-icon.svg";
import logoBig from "../../assets/images/logo-big.png";
import logoLightBig from "../../assets/images/logo-light-big.png";

import "./styles.scss";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isBackToLoginVisible, setIsBackToLoginVisible] = useState(false);
  const [tokenResponse, setTokenResponse] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(null);
  const { status, error } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const currentTheme = document.body.getAttribute("data-theme-mode");

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    dispatch(clearAuthError());

    if (token) {
      checkForgotTokenAPI(token)
        .then((response) => {
          setTokenResponse(response);
          setIsTokenValid(true);
        })
        .catch(() => setIsTokenValid(false));
    } else {
      setIsTokenValid(false);
    }
  }, [dispatch, token]);

  const handlePasswordChange = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value,
    });
    setPasswordError("");
  };

  const handleSave = () => {
    setNotificationVisible(false);
    setIsBackToLoginVisible(false);
    if (!isTokenValid) {
      setPasswordError("Invalid or expired token.");
      return;
    }

    if (!passwords.new_password) {
      setPasswordError("New Password field cannot be empty.");
      return;
    }
    if (!passwords.confirm_password) {
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

    const passwordData = {
      new_password: passwords.new_password,
      confirm_password: passwords.confirm_password,
      user_id: tokenResponse.id,
      reset_password: false,
    };
    dispatch(changeResetPassword(passwordData))
      .unwrap()
      .then(() => {
        dispatch(clearAuthError());
        setPasswords({ new_password: "", confirm_password: "" });
        setPasswordError("");
        setNotificationVisible(true);
        setIsBackToLoginVisible(true);
      })
      .catch((error) => {
        setPasswordError(error);
        setNotificationVisible(false);
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
      {isTokenValid === false ? (
        <>
          <p className="error-text">
            Invalid or expired token. Please request a new password reset.
          </p>
          <Link className="back-to-login-text-red" to="/login">
            Back to log in
          </Link>
        </>
      ) : (
        <div className="form">
          <CustomInput
            label="New Password"
            placeholder="Enter your password"
            type="password"
            name="new_password"
            value={passwords.new_password}
            onChange={handlePasswordChange}
            error={!!passwordError}
          />
          <CustomInput
            label="Re-enter password"
            placeholder="Enter your password"
            type="password"
            name="confirm_password"
            value={passwords.confirm_password}
            onChange={handlePasswordChange}
            error={!!passwordError}
          />
          {passwordError && (
            <p className="error-text">Error: {passwordError}</p>
          )}
          <div className="reset-password-save-button-wrapper">
            <CustomButton
              label="Save"
              style="red-shadow"
              onClick={handleSave}
              disabled={status === "loading" || isTokenValid === null}
            />
          </div>
        </div>
      )}

      {isNotificationVisible && (
        <div className="notification">
          <img
            className="notification-icon"
            src={forgotPasswordNotificationIcon}
            alt="Notification Icon"
          />
          <p className="notification-text">
            Your password changed successfully!
          </p>
        </div>
      )}
      {isBackToLoginVisible && (
        <Link className="back-to-login-text-red" to="/login">
          Back to log in
        </Link>
      )}
    </div>
  );
};

export default ResetPassword;
