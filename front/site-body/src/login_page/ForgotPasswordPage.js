import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleSendCode = (e) => {
    e.preventDefault();
    // Логика отправки кода
    setShowCodeInput(true);
  };

  const handleConfirmCode = (e) => {
    e.preventDefault();
    // Логика подтверждения кода
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <div className="form-header">
          <img src="logo.png" alt="Логотип" className="logo" />
          <h1>IT Весна</h1>
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {showCodeInput && (
          <>
            <div className="form-group">
              <input
                type="text"
                placeholder="Введите полученный код"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button" onClick={handleConfirmCode}>
              Подтвердить код
            </button>
          </>
        )}
        {!showCodeInput && (
          <button type="submit" className="login-button" onClick={handleSendCode}>
            Отправить код
          </button>
        )}
        <div className="form-footer">
          <Link to="/" className="forgot-password">Войти</Link>
          <Link to="/register" className="register-link">Нет аккаунта? Регистрация</Link>
        </div>
        <div className="osu-logo">
          <img src="osu.png" alt="Логотип ОГУ" />
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;