import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainUserPage.css'; // Переименовали файл стилей

const MainUserPage = () => {
  const [selectedTab, setSelectedTab] = useState('Главная');
  const [tabHeight, setTabHeight] = useState(0); // Переименовали состояние

  useEffect(() => {
    const tabElement = document.querySelector(`.tab.${selectedTab}`); // Изменили класс для выбора элемента
    if (tabElement) {
      setTabHeight(tabElement.clientHeight);
    }
  }, [selectedTab, setTabHeight]);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    <div className="main-user-page"> {/* Изменили класс контейнера */}
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
          
          <div className="user-tab-content">
            {/* Ваш контент вкладок */}
          </div>

          <Link to="/main-admin-page" className="admin-button">Перейти в режим модератора</Link>
          <Link to="/request-page" className="application-button">Подать заявку</Link>
        </div>
      </div>
    </div>
  );
};

export default MainUserPage;
