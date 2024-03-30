// RegisterPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Импортируем файл стилей

const RegisterPage = () => {
  return (
    <div className="container">
      <div className="logo">
        <img src="logo.png" alt="Логотип" />
      </div>
      <h1>IT Весна</h1> {/* Измененный заголовок */}
      <form>
        <div className="form-group">
          <input type="text" placeholder="ФИО" />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Пароль" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Подтвердите пароль" />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <div className="register-forgot-password">
        <Link to="/">Войти</Link> {/* Измененный текст ссылки */}
        <Link to="/forgot-password">Забыли пароль?</Link>
      </div>
      <div className="osu">
        <img src="osu.png" alt="Логотип" />
      </div>
    </div>
  );
};

export default RegisterPage;
