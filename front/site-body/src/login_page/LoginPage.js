import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Импортируем стили из файла LoginPage.css

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      mail: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch('http://127.0.0.1:27000/back/login_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const userData = await response.json(); 
        const userStatus = userData.status; 
        const userRole = userData.role; 
        console.log('Статус:', userStatus);
        console.log('Роль:', userRole);
        navigate('/main-user-page')
      } else {
        console.error('Ошибка:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-header">
          <img src="logo.png" alt="Логотип" className="logo" />
          <h1>IT Весна</h1>
        </div>
        <div className="form-group">
          <input type="email" id="email" name="email" required placeholder="Email" onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" required placeholder="Пароль" onChange={handleInputChange} />
        </div>
        <button type="submit" className="login-button">Войти</button>
        <div className="form-footer">
          <Link to="/forgot-password" className="forgot-password">Забыли пароль?</Link>
          <Link to="/register" className="register-link">Нет аккаунта? Регистрация</Link>
        </div>
        <div className="osu-logo">
          <img src="osu.png" alt="Логотип ОГУ" />
        </div>
      </form>
    </div>
  );
};

export default LoginPage;