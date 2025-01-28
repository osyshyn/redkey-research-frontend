import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectAuth } from "../../store/slices/authSlice";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import logoBig from "../../assets/images/logo-big.png";

import "./styles.scss";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { status, error } = useSelector(selectAuth);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-page">
      <img className="logo-big" src={logoBig} alt="Logo" />
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
