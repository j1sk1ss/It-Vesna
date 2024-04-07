import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainAdminPage.css';

const MainAdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('Главная');
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState({ 'Главная': [], 'Участие': [], 'План мероприятий': [], 'Положения конкурса': [], 'Состав жюри': [], 'Технические требования': [] });
  const [tabHeight, setTabHeight] = useState(0);
  const [showActions, setShowActions] = useState(false);

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
      setPostText(''); // Очищаем состояние поля ввода
      // Очищаем содержимое поля ввода с помощью установки пустого innerHTML
      document.querySelector('.post-input').innerHTML = '';
    }
  };

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const deletePost = (index) => {
    const updatedPosts = [...posts[selectedTab]];
    updatedPosts.splice(index, 1);
    setPosts({ ...posts, [selectedTab]: updatedPosts });
  };
  
  const pinPost = (index) => {
    const updatedPosts = [...posts[selectedTab]];
    const pinnedPost = updatedPosts.splice(index, 1)[0]; // Удаляем пост из текущей позиции и сохраняем его
    const pinnedIndex = updatedPosts.findIndex(post => post.pinned); // Ищем индекс закрепленного поста
    updatedPosts.splice(pinnedIndex !== -1 ? pinnedIndex : 0, 0, pinnedPost); // Вставляем закрепленный пост в начало или на место существующего закрепленного поста
    setPosts({ ...posts, [selectedTab]: updatedPosts });
  };
  
  const editPost = (index) => {
    const updatedPosts = [...posts[selectedTab]];
    const editedPost = updatedPosts[index]; // Получаем выбранный пост
    setPostText(editedPost); // Устанавливаем текст выбранного поста в поле ввода
    setShowActions(false); // Закрываем окно действий после выбора редактирования
    // Удаляем отредактированный пост из списка
    updatedPosts.splice(index, 1);
    setPosts({ ...posts, [selectedTab]: updatedPosts });
  };
  
  const renderTabContent = () => {
    return (
      <div className="posts-container">
        {posts[selectedTab].map((post, index) => (
          <div key={index} className="post">
            {post}
            <button onClick={toggleActions}>Действия</button>
            {showActions && (
              <div className="actions-popup">
                <button onClick={() => deletePost(index)}>Удалить</button>
                <button onClick={() => pinPost(index)}>Закрепить</button>
                <button onClick={() => editPost(index)}>Редактировать</button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="admin-panel-page-container">
      <div className="admin-panel-page">
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
              </div>
            </div>
          </div>
        </div>
        
        <div className="post-input-container">
          <div
            className="post-input"
            contentEditable="true"
            placeholder="Что опубликовать?"
            onInput={(e) => setPostText(e.target.innerText)}
            style={{ width: '99%', minHeight: '100px', outline: 'none', border: '1px solid #ccc', padding: '10px', fontSize: '18px', resize: 'none' }}
          />
          <button className="publish-button" onClick={handlePublish}>Опубликовать</button>
        </div>
        
        <div className="tab-content" style={{ marginTop: `${tabHeight}px` }}>
          {renderTabContent()}
        </div>
        
        <Link to="/admin-panel" className="admin-panel-button">Перейти на страницу администратора</Link>
      </div>
    </div>
  );
};

export default MainAdminPage;
