import React, { useState } from 'react';
import './AdminPanelPage.css';

const AdminPanelPage = () => {
  const [selectedTab, setSelectedTab] = useState('Заявки');
  const [moderatorEmail, setModeratorEmail] = useState('');
  const [moderatorName, setModeratorName] = useState('');
  const [subTab, setSubTab] = useState('На рассмотрении');

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    setSubTab('На рассмотрении'); // Сброс подвкладки при переключении вкладки
  };

  const handleCreateModerator = () => {
    console.log('Создание модератора:', moderatorEmail, moderatorName);
  };

  return (
    <div className="admin-panel-page-container">
      <div className="admin-panel-page">
        <div className="transparent-bar">
          <div className="it-vesna">IT Весна</div>
        </div>
        
        <div className="tab-container">
          <div className="left-tab-container">
            <div className={`tab ${selectedTab === 'Заявки' ? 'active' : ''}`} onClick={() => handleTabClick('Заявки')}>Заявки</div>
            <div className={`tab ${selectedTab === 'Модераторы' ? 'active' : ''}`} onClick={() => handleTabClick('Модераторы')}>Модераторы</div>
            <div className={`tab ${selectedTab === 'Номинации' ? 'active' : ''}`} onClick={() => handleTabClick('Номинации')}>Номинации</div>
          </div>
          <div className="right-tab-container">
            {selectedTab === 'Заявки' && (
              <>
                <div className={`tab ${subTab === 'На рассмотрении' ? 'active' : ''}`} onClick={() => setSubTab('На рассмотрении')}>На рассмотрении</div>
                <div className={`tab ${subTab === 'Принятые' ? 'active' : ''}`} onClick={() => setSubTab('Принятые')}>Принятые</div>
                <div className={`tab ${subTab === 'Архив' ? 'active' : ''}`} onClick={() => setSubTab('Архив')}>Архив</div>
              </>
            )}
          </div>
        </div>
        
        <div className="tab-content">
          {selectedTab === 'Заявки' && (
            <div>
              {subTab === 'На рассмотрении' && <div>Содержимое подвкладки "На рассмотрении"</div>}
              {subTab === 'Принятые' && <div>Содержимое подвкладки "Принятые"</div>}
              {subTab === 'Архив' && <div>Содержимое подвкладки "Архив"</div>}
            </div>
          )}
          {selectedTab === 'Модераторы' && (
            <div className="input-container">
              <input type="text" placeholder="Почта" value={moderatorEmail} onChange={(e) => setModeratorEmail(e.target.value)} />
              <input type="text" placeholder="Имя" value={moderatorName} onChange={(e) => setModeratorName(e.target.value)} /> 
              <button className="button-create" onClick={handleCreateModerator}>Создать</button>
            </div>
          )}
          {selectedTab === 'Номинации' && <div>Содержимое вкладки "Номинации"</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
