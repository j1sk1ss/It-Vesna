import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Импортируем компонент Link
import './MainUserPage.css';

const MainUserPage = () => {
  const [selectedTab, setSelectedTab] = useState('Главная');
  const [setTabHeight] = useState(0);

  useEffect(() => {
    const tabElement = document.querySelector(`.tab.${selectedTab}`);
    if (tabElement) {
      setTabHeight(tabElement.clientHeight);
    }
  }, [selectedTab]);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    <div className="user-page-container">
      <div className="user-page">
        <div className="transparent-bar">
          <div className="it-vesna">IT Весна</div>
        </div>
        
        <div className="tab-container">
          <div className="left-tab-container">
            <div className={`tab ${selectedTab === 'Главная' ? 'active' : ''}`} onClick={() => handleTabClick('Главная')}>Главная</div>
            <div className={`tab ${selectedTab === 'Участие' ? 'active' : ''}`} onClick={() => handleTabClick('Участие')}>Участие</div>
            <div className={`tab ${selectedTab === 'Новости' ? 'active' : ''}`} onClick={() => handleTabClick('Новости')}>Новости</div>
          </div>
        </div>
        
        <div className="tab-content">
          {/* Ваш контент вкладок */}
        </div>

        {/* Кнопка для перехода в режим администратора */}
        <Link to="/main-admin-page" className="admin-button">Перейти в режим модератора</Link>
        
        {/* Ссылка для перехода на страницу подачи заявки */}
        <Link to="/request-page" className="application-button">Подать заявку</Link>
      </div>
    </div>
  );
};

export default MainUserPage;
