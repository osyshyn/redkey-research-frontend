export const USER_TYPES = {
  CLIENT: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export const FOLDER_STATUSES = {
  ACTIVE: 1,
  CLOSED: 2,
  REJECTED: 3,
  WATCHLIST: 4,
};

export const REPORT_TYPES = {
  INITIATION: 1,
  WATCH_LIST: 2,
  UPDATE: 3,
  WATCH_LIST_WEEKLY: 4,
  REJECT: 5,
};

export const USER_THEME = {
  DARK: 1,
  LIGHT: 2,
};

export const userTypeOptions = [
  { value: USER_TYPES.CLIENT, label: "Client" },
  { value: USER_TYPES.ADMIN, label: "Admin" },
  { value: USER_TYPES.SUPER_ADMIN, label: "Super admin" },
];

export const statusOptions = [
  { value: FOLDER_STATUSES.ACTIVE, label: "active" },
  { value: FOLDER_STATUSES.CLOSED, label: "closed" },
  { value: FOLDER_STATUSES.REJECTED, label: "rejected" },
  { value: FOLDER_STATUSES.WATCHLIST, label: "watchlist" },
];

export const reportTypeOptions = [
  { value: REPORT_TYPES.INITIATION, label: "Initiation" },
  { value: REPORT_TYPES.WATCH_LIST, label: "Watch List" },
  { value: REPORT_TYPES.UPDATE, label: "Update" },
  { value: REPORT_TYPES.WATCH_LIST_WEEKLY, label: "Watch List Weekly" },
  { value: REPORT_TYPES.REJECT, label: "Reject" },
];




export const dropdownFolderOptions = [
  {
    icon: "company-filter", 
    label: "Companies",
    value: "companies",
  },
  {
    icon: "status-filter", 
    label: "Status",
    value: "status",
  },
  {
    icon: "calendar-filter", 
    label: "Initiation date",
    value: "initiation_date",
  },
];

export const dropdownUserManagementOptions = [
  {
    icon: "registered-by", 
    label: "Registered by",
    value: "registered_by",
  },
  {
    icon: "status-filter", 
    label: "Accesses",
    value: "accesses",
  },
];
