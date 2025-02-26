import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainUserPage.css';

const MainUserPage = () => {
  const [selectedTab, setSelectedTab] = useState('Главная');
  const [posts] = useState({'Участие': [], 'План мероприятий': [], 'Положения конкурса': [], 'Состав жюри': [], 'Технические требования': [] });
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
            <div className="tab-container">
            <Link to="/main-user-page" className="logo-button" onClick={() => window.location.href = "/main-user-page"}>
              <div className="logo-container"> 
                <img src="logo.png" alt="Логотип" className="logo-button" />
                <h1>IT Весна</h1>
              </div>
            </Link>
              <div className="left-tab-container">
                {Object.keys(posts).map(tabName => (
                  <div key={tabName} className={`tab ${selectedTab === tabName ? 'active' : ''}`} onClick={() => handleTabClick(tabName)}>{tabName}</div>
                ))}
             </div>
            <div className="right-tab-container">
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
