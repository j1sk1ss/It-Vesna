// LoginPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="container">
      <div className="logo">
        <img src="logo.png" alt="Логотип" />
      </div>
      <h1>IT Весна</h1>
      <form action="/login" method="post">
        <div className="form-group">
          <input type="email" id="email" name="email" required placeholder="Email" />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" required placeholder="Пароль" />
        </div>
        <button type="submit">Войти</button>
      </form>
      <div className="register-forgot-password">
        <Link to="/register">Регистрация</Link>
        <Link to="/forgot-password">Восстановить пароль</Link>
      </div>
      <div className="osu">
        <img src="osu.png" alt="Логотип" />
      </div>
    </div>
  );
};

export default LoginPage;