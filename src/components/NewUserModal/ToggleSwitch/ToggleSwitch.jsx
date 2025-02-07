import React from "react";
import "./styles.scss";

const ToggleSwitch = ({ value, onToggle }) => {
  return (
    <div className={`switch-rectangle ${value ? "active" : ""}`} onClick={onToggle}>
      {/* <div className="rectangle"> */}
      <div className="ellipse" style={{ left: value ? "13px" : "2px" }}></div>
      {/* </div> */}
    </div>
  );
};

export default ToggleSwitch;
