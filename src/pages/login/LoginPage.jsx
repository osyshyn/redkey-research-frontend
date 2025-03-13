import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  loginUser,
  selectAuth,
  clearAuthError,
} from "../../store/slices/authSlice";
import { setCurrentFirm } from "../../store/slices/firmSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import logoBig from "../../assets/images/logo-big.png";
import logoLightBig from "../../assets/images/logo-light-big.png";

import "./styles.scss";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const currentTheme = document.body.getAttribute("data-theme-mode");

  const userResetPassword = localStorage.getItem("reset_password");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      dispatch(getProfile());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "succeeded" && user) {
      console.log("UUUUUU", user, userResetPassword);

      if (user.role !== 3 && userResetPassword === "true") {
        navigate("/set-your-password");
      } else if (user.role === 3) {
        navigate("/admin/portal");
        dispatch(setCurrentFirm({ name: "All" }));
      } else if (user.role === 2 && userResetPassword === "false") {
        navigate("/admin/portal");
        dispatch(setCurrentFirm({ name: "All" }));
      } else if (user.role === 1 && userResetPassword === "false") {
        const activeAccess = user.access.find(
          (access) => access.value === true
        );
        if (activeAccess) {
          dispatch(setCurrentFirm(activeAccess.firm));
        }

        navigate("/user/portal");
      }
    }
  }, [status, user, navigate, userResetPassword]);

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      await dispatch(getProfile()).unwrap();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page">
      <img
        className="logo-big"
        src={
          currentTheme === "dark" || currentTheme === null
            ? logoBig
            : logoLightBig
        }
        alt="Logo"
      />
      <h1 className="title">Log in to your account</h1>
      <div className="form">
        <CustomInput
          label="Email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error ? true : false}
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ? true : false}
        />
        {error && <p className="error-text">Error: {error}</p>}
        <div className="login-continue-button-wrapper">
          <CustomButton
            label="Continue"
            style="red-shadow"
            onClick={handleLogin}
            disabled={status === "loading"}
          />
        </div>
      </div>
      <div className="login-footer">
        <p className="help-text">
          Having trouble logging in?{" "}
          <Link className="text-red" to="/forgot-password">
            Click here{" "}
          </Link>{" "}
          to set up a new password
        </p>
        <p className="support-text">
          If you need help <span className="text-red">contact support.</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
