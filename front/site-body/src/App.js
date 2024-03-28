// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import RegisterPage from './RegisterPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default App;