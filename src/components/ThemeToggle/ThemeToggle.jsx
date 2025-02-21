import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../store/slices/authSlice";
import { USER_THEME } from "../../constants/constants";
import { getThemeName, getThemeValue } from "../../utils/userHelpers";
import DarkModeMoonIcon from "../../assets/icons/dark-mode-moon-icon.svg?react";
import LightModeSunIcon from "../../assets/icons/light-mode-sun-icon.svg?react";

import "./styles.scss";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const initialTheme = user?.theme
    ? getThemeName(user.theme)
    : getThemeName(USER_THEME.LIGHT);

  const [localTheme, setLocalTheme] = useState(initialTheme);

  useEffect(() => {
    if (user?.theme) {
      const themeName = getThemeName(user.theme);
      setLocalTheme(themeName);
      document.body.setAttribute("data-theme-mode", themeName.toLowerCase());
    }
  }, [user?.theme]);

  const toggleTheme = (event) => {
    event.stopPropagation();
    const newThemeName =
      localTheme === getThemeName(USER_THEME.DARK)
        ? getThemeName(USER_THEME.LIGHT)
        : getThemeName(USER_THEME.DARK);

    setLocalTheme(newThemeName);
    dispatch(changeTheme(getThemeValue(newThemeName)));
    document.body.setAttribute("data-theme-mode", newThemeName.toLowerCase());
  };

  return (
    <div
      className={`theme-toggle ${
        localTheme === getThemeName(USER_THEME.DARK) ? "dark" : "light"
      }`}
      onClick={toggleTheme}
    >
      <div className="toggle-circle">
        {localTheme === getThemeName(USER_THEME.DARK) ? (
          <DarkModeMoonIcon
            className="theme-toggle-icon"
            onClick={toggleTheme}
            alt="Dark Mode"
          />
        ) : (
          <LightModeSunIcon
            className="theme-toggle-icon"
            onClick={toggleTheme}
            alt="Light Mode"
          />
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
