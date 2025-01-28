import React from "react";

import "./styles.scss";

const CustomButton = ({ label, onClick, style, disabled }) => {
  return (
    <div
      className={`custom-button ${style} ${disabled ? "disabled" : ""}`}
      onClick={!disabled ? onClick : undefined}
    >
      {label}
    </div>
  );
};

export default CustomButton;
