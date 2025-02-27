import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  loginUser,
  selectAuth,
} from "../../store/slices/authSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import logoBig from "../../assets/images/logo-big.png";
import logoLightBig from "../../assets/images/logo-light-big.png";

import "./styles.scss";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const currentTheme = document.body.getAttribute("data-theme-mode");
  console.log("ccc", currentTheme);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector(selectAuth);

  // useEffect(() => {
  //   if (status === "succeeded") {
  //     navigate("/admin/portal");
  //   }
  // }, [status, navigate]);

  useEffect(() => {
    if (status === "succeeded") {
      dispatch(getProfile());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "succeeded" && user) {
      console.log('UUUUUU', user);
      
      if (user.role === 1 || user.role === 2) {
        navigate("/admin/portal");
      } else if (user.role === 3) {
        navigate("/user/portal");
      } 
    }
  }, [status, user, navigate]);

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      await dispatch(getProfile()).unwrap();
      // navigate("/admin/portal");
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
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login-continue-button-wrapper">
          <CustomButton
            label="Continue"
            style="red-shadow"
            onClick={handleLogin}
            disabled={status === "loading"}
          />
        </div>
        {error && <p className="error-text">Error: {error}</p>}
      </div>
      <div className="login-footer">
        <p className="help-text">
          Having trouble logging in?{" "}
          <Link className="text-red" to="/forgot-password">
            {" "}
            Click here
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
