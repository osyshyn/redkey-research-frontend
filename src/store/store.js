import { configureStore } from "@reduxjs/toolkit";
import researchReducer from "./slices/researchSlice";
import authReducer from "./slices/authSlice";
import uploadReducer from "./slices/uploadSlice";
import filterReducer from "./slices/filterSlice";
import userManagementReducer from "./slices/userManagementSlice";

export const store = configureStore({
  reducer: {
    research: researchReducer,
    auth: authReducer,
    upload: uploadReducer,
    filters: filterReducer,
    userManagement: userManagementReducer,
  },
});
