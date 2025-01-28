import React, { useState } from "react";
import eyeIcon from "../../assets/icons/eye-icon.svg";
import eyeClosedIcon from "../../assets/icons/eye-closed-icon.svg";

import "./styles.scss";

const CustomInput = ({ label, placeholder, onChange, value, type = "text", ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const isPasswordType = type === "password";

  return (
    <div className="custom-input">
      {label && <label className="custom-input-label">{label}</label>}
      <div className="custom-input-wrapper">
        <input
          className={`custom-input-field ${isPasswordType ? "custom-input-password" : ""}`}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          type={isPasswordType && isPasswordVisible ? "text" : type}
          {...props}
        />
        {isPasswordType && (
          <img
            src={isPasswordVisible ? eyeClosedIcon : eyeIcon}
            alt={isPasswordVisible ? "Hide password" : "Show password"}
            className="custom-input-icon"
            onClick={togglePasswordVisibility}
          />
        )}
      </div>
    </div>
  );
};

export default CustomInput;
