import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainAdminPage.css';

const MainAdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('Главная');
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState({ 'Главная': [], 'Участие': [], 'План мероприятий': [], 'Положения конкурса': [], 'Состав жюри': [], 'Технические требования': [] });
  const [tabHeight, setTabHeight] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);

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
        [selectedTab]: [{ text: postText, author: 'Модератор', date: new Date().toLocaleDateString(), pinned: false }, ...posts[selectedTab]]
      });
      setPostText('');
      setIsPlaceholderVisible(true); // После публикации снова показываем плейсхолдер
      document.querySelector('.post-input').innerHTML = '';
    }
  };

  const toggleActions = (index, event) => {
    setShowActions(!showActions);
    setSelectedPostIndex(index);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const deletePost = () => {
    const updatedPosts = [...posts[selectedTab]];
    updatedPosts.splice(selectedPostIndex, 1);
    setPosts({ ...posts, [selectedTab]: updatedPosts });
    setShowActions(false);
  };

  const pinPost = () => {
    const updatedPosts = [...posts[selectedTab]];
    const pinnedPost = updatedPosts.splice(selectedPostIndex, 1)[0];
    const pinnedIndex = updatedPosts.findIndex(post => post.pinned);
    updatedPosts.splice(pinnedIndex !== -1 ? pinnedIndex : 0, 0, { ...pinnedPost, pinned: true });
    setPosts({ ...posts, [selectedTab]: updatedPosts });
    setShowActions(false);
  };

  const editPost = () => {
    const updatedPosts = [...posts[selectedTab]];
    const editedPost = updatedPosts[selectedPostIndex];
    setPostText(editedPost.text);
    setShowActions(false);
    updatedPosts.splice(selectedPostIndex, 1);
    setPosts({ ...posts, [selectedTab]: updatedPosts });
  };

  const renderTabContent = () => {
    return (
      <div className="posts-container">
        {posts[selectedTab].map((post, index) => (
          <div key={index} className={`post ${post.pinned ? 'pinned' : ''}`}>
            <div className="post-info">
              <div className="post-meta">
                <div className="author">{post.author}</div>
                <div className="date">{post.date}</div>
                {post.pinned && <div className="pinned-label">Закреплено</div>}
              </div>
              <img
                src="/more.png"
                className="more-button"
                onMouseDown={(event) => toggleActions(index, event)} 
              />
              {showActions && selectedPostIndex === index && (
                <div className="actions-popup" style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}>
                  <button onClick={deletePost}>Удалить</button>
                  <button onClick={pinPost}>Закрепить</button>
                  <button onClick={editPost}>Редактировать</button>
                </div>
              )}
            </div>
            <div className="post-text">{post.text}</div>
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
            onInput={(e) => setPostText(e.target.innerText)}
            onFocus={() => setIsPlaceholderVisible(false)} // При фокусировке скрываем плейсхолдер
            onBlur={() => {
              if (!postText.trim()) {
                setIsPlaceholderVisible(true); // При потере фокуса показываем плейсхолдер, если текстовое поле пустое
              }
            }}
            style={{
              width: '99%',
              outline: 'none',
              border: '1px solid #ccc',
              padding: '10px',
              fontSize: '18px',
              resize: 'none',
            }}
          >
            {isPlaceholderVisible && <div className="placeholder">Что опубликовать?</div>}
          </div>
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
