import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика регистрации
  };

  const openPrivacyPolicy = () => {
    // Логика открытия политики конфиденциальности
    alert('Политика конфиденциальности');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <img src="logo.png" alt="Логотип" className="logo" />
          <h1>IT Весна</h1>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="fullName"
            placeholder="ФИО"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Повторите пароль"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Зарегистрироваться
        </button>
        <div className="checkbox-group">
          <input
            type="checkbox"
            name="agreed"
            checked={formData.agreed}
            onChange={handleInputChange}
            required
            className="custom-checkbox"
          />
          <label>
            Я согласен с{' '}
            <span className="privacy-policy-link" onClick={openPrivacyPolicy}>
              политикой конфиденциальности
            </span>
          </label>
        </div>
        <div className="form-footer">
          <Link to="/" className="forgot-password">Войти</Link>
          <Link to="/forgot-password" className="register-link">Забыли пароль?</Link>
        </div>
        <div className="osu-logo">
          <img src="osu.png" alt="Логотип ОГУ" />
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;