// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './login_page/LoginPage';
import ForgotPasswordPage from './login_page/ForgotPasswordPage';
import RegisterPage from './login_page/RegisterPage';
import AdminPanelPage from './admin_page/AdminPanelPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-panel" element={<AdminPanelPage />} />
      </Routes>
    </div>
  );
};

export default App;