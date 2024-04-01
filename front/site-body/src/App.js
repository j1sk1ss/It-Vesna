// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './login_page/LoginPage';
import ForgotPasswordPage from './login_page/ForgotPasswordPage';
import RegisterPage from './login_page/RegisterPage';
import AdminPanelPage from './admin_page/AdminPanelPage';
import MainAdminPage from './main_page/moder_view/MainAdminPage';
import MainUserPage from './main_page/user_view/MainUserPage';
import RequestPage from './request_page/RequestPage';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-panel" element={<AdminPanelPage />} />
        <Route path="/main-admin-page" element={<MainAdminPage />} />
        <Route path="/main-user-page" element={<MainUserPage />} />
        <Route path="/request-page" element={ <RequestPage/> } />
      </Routes>
    </div>
  );
};

export default App;