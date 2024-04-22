// RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Импортируем файл стилей

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    surname: '',
    name: '',
    fathersName: '',
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
      surname: formData.surname,
      name: formData.name,
      father_name: formData.fathersName,
      mail: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch('http://127.0.0.1:27000/back/register_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const userData = await response.json(); 
        const userId = userData.ID; 
        console.log('ID пользователя:', userData);
        navigate('/')
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
          <input type="text" name="surname" placeholder="Фамилия" onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <input type="text" name="name" placeholder="Имя" onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <input type="text" name="fathersName" placeholder="Отчество" onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <input type="password" name="password" placeholder="Пароль" onChange={handleInputChange} />
        </div>
        <button className='submit' type="submit">Зарегистрироваться</button>
      </form>
      <div className="register-forgot-password">
        <Link to="/">Войти</Link>
        <Link to="/forgot-password">Забыли пароль?</Link>
      </div>
      <div className="osu">
        <img src="osu.png" alt="Логотип" />
      </div>
    </div>
  );
};

export default RegisterPage;
