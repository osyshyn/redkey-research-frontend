  import { USER_TYPES } from "../constants/constants";
  import { FOLDER_STATUSES } from "../constants/constants";
  
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