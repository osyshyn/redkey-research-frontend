import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/slices/authSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import logoBig from "../../assets/images/logo-big.png";

import "./styles.scss";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    password1: "",
    password2: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const { status, error } = useSelector(selectAuth);

  const handlePasswordChange = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value,
    });
    setPasswordError("");
  };

  const handleSave = () => {
    if (passwords.password1 === "") {
      setPasswordError("New Password field cannot be empty.");
      return;
    }
    if (passwords.password2 === "") {
      setPasswordError("Confirm Password field cannot be empty.");
      return;
    }
    if (passwords.password1 !== passwords.password2) {
      setPasswordError("Passwords do not match!");
      return;
    }

    if (passwords.password1.length < 6) {
      setPasswordError("Password must be at least 6 characters long!");
      return;
    }

    // Here will be password update
    console.log("Password saved:", passwords.password1);
  };

  return (
    <div className="reset-password-page">
      <img className="logo-big" src={logoBig} alt="Logo" />
      <h1 className="title">Reset Password</h1>
      <div className="form">
        <CustomInput
          label="New Password"
          placeholder="Enter your password"
          type="password"
          name="password1"
          value={passwords.password1}
          onChange={handlePasswordChange}
        />

        <CustomInput
          label="Re-enter password"
          placeholder="Enter your password"
          type="password"
          name="password2"
          value={passwords.password2}
          onChange={handlePasswordChange}
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
