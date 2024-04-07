import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Импортируем компонент Link
import './MainUserPage.css';

const MainUserPage = () => {
  const [selectedTab, setSelectedTab] = useState('Главная');
  const [posts] = useState({ 'Главная': [], 'Участие': [], 'План мероприятий': [], 'Положения конкурса': [], 'Состав жюри': [], 'Технические требования': [] });
  const [tabHeight, setTabHeight] = useState(0);

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
        <div className="header-container">
          <div className="header-wrapper">
            <div className="transparent-bar">
              <div className="it-vesna">IT Весна</div>
            </div>
          
            <div className="tab-container">
              <div className="left-tab-container">
                {Object.keys(posts).map(tabName => (
                  <div key={tabName} className={`tab ${selectedTab === tabName ? 'active' : ''}`} onClick={() => handleTabClick(tabName)}>{tabName}</div>
                ))}
                <Link to="/request-page" className="request-button">Подать заявку</Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="tab-content" style={{ marginTop: `${tabHeight}px` }}>
          {/* Здесь выводится контент вкладок */}
        </div>
        
        {/* Добавляем ссылку для перехода на страницу администратора */}
        <Link to="/main-admin-page" className="admin-button">Перейти в режим модератора</Link>
      </div>
    </div>
  );
};

export default MainUserPage;
