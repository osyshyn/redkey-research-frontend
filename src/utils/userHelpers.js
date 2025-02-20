import {
  USER_TYPES,
  FOLDER_STATUSES,
  REPORT_TYPES,
  USER_THEME,
} from "../constants/constants";

export const getUserTypeName = (typeValue) => {
  const typeName = Object.keys(USER_TYPES)
    .find((key) => USER_TYPES[key] === typeValue)
    ?.toLowerCase();

  return typeName
    ? typeName.charAt(0).toUpperCase() + typeName.slice(1)
    : "Unknown";
};

export const getStatusName = (statusValue) => {
  return (
    Object.keys(FOLDER_STATUSES)
      .find((key) => FOLDER_STATUSES[key] === statusValue)
      ?.toLowerCase() || "unknown"
  );
};

export const getReportTypeName = (typeValue) => {
  const typeKey = Object.keys(REPORT_TYPES).find(
    (key) => REPORT_TYPES[key] === typeValue
  );

  if (!typeKey) return "Unknown";

  return typeKey
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getThemeName = (themeValue) => {
  const themeNames = {
    [USER_THEME.LIGHT]: "light",
    [USER_THEME.DARK]: "dark",
  };

  return themeNames[themeValue] || "light";
};

export const getThemeValue = (themeName) => {
  const themeValues = {
    light: USER_THEME.LIGHT,
    dark: USER_THEME.DARK,
  };

  return themeValues[themeName] || USER_THEME.LIGHT;
};
