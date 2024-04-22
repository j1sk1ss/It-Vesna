// ForgotPasswordPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Импортируем файл стилей

const ForgotPasswordPage = () => {
  return (
    <div className="container">
      <div className="logo">
        <img src="logo.png" alt="Логотип" />
      </div>
      <h1>IT Весна</h1>
      <form>
        <div className="form-group">
          <input type="email" placeholder="Email" />
        </div>
        <button className='submit' type="submit">Восстановить</button>
      </form>
      <div className="register-forgot-password">
        <Link to="/">Войти</Link>
        <Link to="/register">Регистрация</Link>
      </div>
      <div className="osu">
        <img src="osu.png" alt="Логотип" />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
