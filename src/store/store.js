import { configureStore } from "@reduxjs/toolkit";
import researchReducer from "./slices/researchSlice";
import authReducer from "./slices/authSlice";
import uploadReducer from "./slices/uploadSlice";

export const store = configureStore({
  reducer: {
    research: researchReducer,
    auth: authReducer,
    upload: uploadReducer,
  },
});
