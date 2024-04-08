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
import RequestDetailPage from './admin_page/RequestDetailPage';
import { RequestProvider } from './admin_page/RequestContext';



const App = () => {
  return (
    <div>
    <RequestProvider>    
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-panel" element={<AdminPanelPage />} />
        <Route path="/main-admin-page" element={<MainAdminPage />} />
        <Route path="/main-user-page" element={<MainUserPage />} />
        <Route path="/request-page" element={ <RequestPage/> } />
        <Route path="/request/:id" element={ <RequestDetailPage/> } />
      </Routes>
    </RequestProvider> 
      
    </div>
  );
};

export default App;