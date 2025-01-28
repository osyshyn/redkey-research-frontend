import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/slices/authSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import forgotPasswordNotificationIcon from "../../assets/icons/forgot-password-notification-icon.svg";
import logoBig from "../../assets/images/logo-big.png";

import "./styles.scss";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const { status, error } = useSelector(selectAuth);

  const handleSendEmail = () => {
    setNotificationVisible(true);
  };

  return (
    <div className="forgot-password-page">
      <img className="logo-big" src={logoBig} alt="Logo" />
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
        />

        <div className="send-email-button-wrapper">
          <CustomButton
            label="Send email"
            style="red-shadow"
            onClick={handleSendEmail}
            disabled={status === "loading"}
          />
        </div>
        {error && <p className="error-text">Error: {error}</p>}
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
            <span className="text-red">contact support</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
