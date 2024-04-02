import React, { useState } from 'react';
import './AdminPanelPage.css';

const AdminPanelPage = () => {
  const [selectedTab, setSelectedTab] = useState('Заявки');
  const [moderatorEmail, setModeratorEmail] = useState('');
  const [moderatorName, setModeratorName] = useState('');
  const [subTab, setSubTab] = useState('На рассмотрении');
  const [moderators, setModerators] = useState([]);
  const [isModeratorsTabSelected, setIsModeratorsTabSelected] = useState(false);
  const [nominationName, setNominationName] = useState('');
  const [nominations, setNominations] = useState(['Номинация 1', 'Номинация 2', 'Номинация 3']); // Список номинаций

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    setSubTab('На рассмотрении');
    setIsModeratorsTabSelected(tabName === 'Модераторы');
  };

  const handleCreateModerator = () => {
    const newModerator = { email: moderatorEmail, name: moderatorName };
    setModerators([...moderators, newModerator]);
    setModeratorEmail('');
    setModeratorName('');
  };

  const handleDeleteModerator = (index) => {
    const updatedModerators = [...moderators];
    updatedModerators.splice(index, 1);
    setModerators(updatedModerators);
  };

  const handleAddNomination = () => {
    if (nominationName.trim() !== '') {
      setNominations([...nominations, nominationName]); // Добавляем новую номинацию в список
      setNominationName(''); // Сбрасываем значение поля ввода
    }
  };

  const handleDeleteNomination = (index) => {
    const updatedNominations = [...nominations];
    updatedNominations.splice(index, 1);
    setNominations(updatedNominations);
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
            <div>
              {isModeratorsTabSelected && (
                <div className="input-container">
                  <input type="text" placeholder="Почта" value={moderatorEmail} onChange={(e) => setModeratorEmail(e.target.value)} />
                  <input type="text" placeholder="Имя" value={moderatorName} onChange={(e) => setModeratorName(e.target.value)} /> 
                  <button className="button-create" onClick={handleCreateModerator}>Создать</button>
                </div>
              )}
              <div>
                {moderators.map((moderator, index) => (
                  <div key={index}>
                    <div className="moderator-container">
                      <div>{moderator.name}</div>
                      <div>{moderator.email}</div>
                      <button className="button-delete" onClick={() => handleDeleteModerator(index)}>Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedTab === 'Номинации' && (
            <div>
              <div className="input-container">
                <input type="text" placeholder="Новая номинация" value={nominationName} onChange={(e) => setNominationName(e.target.value)} />
                <button className="button-create" onClick={handleAddNomination}>Добавить</button>
              </div>
              <div>
                {nominations.map((nomination, index) => (
                  <div key={index}>
                    <div className="nomination-container">
                      <div>{nomination}</div>
                      <button className="button-delete" onClick={() => handleDeleteNomination(index)}>Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
