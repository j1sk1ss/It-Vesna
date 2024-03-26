import React from 'react';
import './App.css'; // Импортируем файл стилей

function App() {
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
        <a href="/register">Регистрация</a>
        <a href="/forgot-password">Восстановить пароль</a>
      </div>
      <div className="osu">
        <img src="osu.png" alt="Логотип" />
      </div>
    </div>
  );
}

export default App;
