import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuth,
  changeFirstOrResetPassword,
  clearAuthError,
} from "../../store/slices/authSlice";
import { setCurrentFirm } from "../../store/slices/firmSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import logoBig from "../../assets/images/logo-big.png";
import logoLightBig from "../../assets/images/logo-light-big.png";

import "./styles.scss";

const ChangePasswordFirst = () => {
  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const { user, status, error } = useSelector(selectAuth);

  // const userResetPassword = localStorage.getItem("reset_password");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentTheme = document.body.getAttribute("data-theme-mode");

  console.log("changePassUser", user);

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
      user_id: user.id,
      reset_password: false,
    };

    if (user.role === 1 || user.role === 2) {
      dispatch(changeFirstOrResetPassword(passwordData))
        .unwrap()
        .then(() => {
          setPasswords("");
          setPasswordError("");
          if (user.role === 2) {
            const activeAccess = user.access.find(
              (access) => access.value === true
            );
            if (activeAccess) {
              dispatch(setCurrentFirm(activeAccess.firm));
            }
            navigate("/admin/portal");
          } else if (user.role === 1) {
            const activeAccess = user.access.find(
              (access) => access.value === true
            );
            if (activeAccess) {
              dispatch(setCurrentFirm(activeAccess.firm));
            }
            navigate("/user/portal");
          }
        })
        .catch((error) => {
          setPasswordError(error);
        });
    }
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
      <h1 className="title">Create your own password</h1>
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
        {passwordError && <p className="error-text">Error: {passwordError}</p>}
        <div className="reset-password-save-button-wrapper">
          <CustomButton
            label="Save new password"
            style="red-shadow"
            onClick={handleSave}
            disabled={status === "loading"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordFirst;
