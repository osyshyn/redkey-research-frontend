import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuth,
  forgotPasswordSendEmail,
  clearAuthError,
} from "../../store/slices/authSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import forgotPasswordNotificationIcon from "../../assets/icons/red-done-circle-icon.svg";
import logoBig from "../../assets/images/logo-big.png";
import logoLightBig from "../../assets/images/logo-light-big.png";

import "./styles.scss";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const currentTheme = document.body.getAttribute("data-theme-mode");

  const dispatch = useDispatch();

  const { status, error } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSendEmail = async () => {
    setNotificationVisible(false);
    try {
      await dispatch(forgotPasswordSendEmail(email)).unwrap();
      setNotificationVisible(true);
    } catch (err) {
      console.error("Failed to send email:", err);
      setNotificationVisible(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <img
        className="logo-big"
        src={
          currentTheme === "dark" || currentTheme === null
            ? logoBig
            : logoLightBig
        }
        alt="Logo"
      />
      <div className="forgot-password-title-wrapper">
        <h1 className="title">Forgot password?</h1>
        <p className="help-text">Enter email to reset password</p>
      </div>
      <div className="form">
        <CustomInput
          label="Email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error ? true : false}
        />
        {error && <p className="error-text">Error: {error}</p>}

        <div className="send-email-button-wrapper">
          <CustomButton
            label="Send email"
            style="red-shadow"
            onClick={handleSendEmail}
            disabled={status === "loading"}
          />
        </div>
      </div>
      <Link className="back-to-login-text-red" to="/login">
        Back to log in
      </Link>
      {isNotificationVisible && (
        <div className="notification">
          <img
            className="notification-icon"
            src={forgotPasswordNotificationIcon}
            alt="Notification Icon"
          />
          <p className="notification-text">
            Thanks! An email was sent to verify your account. If you don’t
            receive an email, please{" "}
            <a href="mailto:info@redkeyresearch.com" className="text-red">
              contact support
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
