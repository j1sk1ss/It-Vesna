import React, { useState, useEffect } from 'react';
import './MainAdminPage.css';

const MainAdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('Главная');
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState({ 'Главная': [], 'Участие': [], 'План мероприятий': [], 'Положения конкурса': [], 'Состав жюри': [], 'Технические требования': [] });
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

  const handlePublish = () => {
    if (postText.trim() !== '') {
      setPosts({
        ...posts,
        [selectedTab]: [postText, ...posts[selectedTab]]
      });
      setPostText('');
    }
  };

  const renderTabContent = () => {
    return (
      <div>
        <h2>{selectedTab}</h2>
        <div className="posts-container">
          {posts[selectedTab].map((post, index) => (
            <div key={index} className="post">{post}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-panel-page-container">
      <div className="admin-panel-page">
        <div className="transparent-bar">
          <div className="it-vesna">IT Весна</div>
        </div>
        
        <div className="tab-container">
          <div className="left-tab-container">
            {Object.keys(posts).map(tabName => (
              <div key={tabName} className={`tab ${selectedTab === tabName ? 'active' : ''}`} onClick={() => handleTabClick(tabName)}>{tabName}</div>
            ))}
          </div>
          <div className="button-container">
            <button className="publish-button" onClick={handlePublish}>Опубликовать</button>
          </div>
        </div>
        
        <div className="post-input-container" style={{ marginTop: '20px' }}>
          <textarea
            className="post-input"
            placeholder="Напишите свой пост..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>

        <div className="tab-content" style={{ marginTop: `${tabHeight}px` }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MainAdminPage;
