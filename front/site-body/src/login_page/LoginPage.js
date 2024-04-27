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
        console.error('ОШибка:', response.statusText);
      }
    } catch (error) {
      console.error('ошбк:', error);
    }
  };
  return (
    <div className="container">
      <div className="logo">
        <img src="logo.png" alt="Логотип" />
      </div>
      <h1>IT Весна</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="email" id="email" name="email" required placeholder="Email" onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" required placeholder="Пароль" onChange={handleInputChange} />
        </div>
          <button type="submit" className="login-button">Войти</button>
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
