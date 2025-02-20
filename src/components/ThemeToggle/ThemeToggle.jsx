import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../store/slices/authSlice";
import { USER_THEME } from "../../constants/constants";
import { getThemeName, getThemeValue } from "../../utils/userHelpers";
import lightModeSunIcon from "../../assets/icons/light-mode-sun-icon.svg";
import darkModeMoonIcon from "../../assets/icons/dark-mode-moon-icon.svg";
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

  const toggleTheme = () => {
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
          <img src={darkModeMoonIcon} alt="Dark Mode" className="dark-icon" />
        ) : (
          <img src={lightModeSunIcon} alt="Light Mode" className="light-icon" />
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
