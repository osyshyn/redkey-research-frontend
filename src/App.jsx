import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPortal from "./pages/admin/AdminPortal/AdminPortal";
import UserManagement from "./pages/admin/UserManagement/UserManagement";
import LoginPage from "./pages/login/LoginPage";
import ForgotPasswordPage from "./pages/passwordRecovery/ForgotPasswordPage";
import ResetPassword from "./pages/passwordRecovery/ResetPassword";
import { Provider } from "react-redux";
import { store } from "./store/store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/admin/portal" element={<AdminPortal />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
