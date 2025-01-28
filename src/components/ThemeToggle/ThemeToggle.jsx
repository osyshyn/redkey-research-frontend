import React, { useState } from "react";
import lightModeSunIcon from "../../assets/icons/light-mode-sun-icon.svg";
import darkModeMoonIcon from "../../assets/icons/dark-mode-moon-icon.svg";

import "./styles.scss";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div
      className={`theme-toggle ${isDarkMode ? "dark" : "light"}`}
      onClick={toggleTheme}
    >
      <div className="toggle-circle">
        {isDarkMode ? (
          <img src={darkModeMoonIcon} alt="Dark Mode" className="dark-icon" />
        ) : (
          <img src={lightModeSunIcon} alt="Light Mode" className="light-icon" />
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
