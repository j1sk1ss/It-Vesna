import React, { useState } from 'react';
import './AdminPanelPage.css';
import { useRequestContext } from './RequestContext';
import { Link } from 'react-router-dom';

const AdminPanelPage = () => {
  const [selectedTab, setSelectedTab] = useState('Заявки');
  const [moderatorEmail, setModeratorEmail] = useState('');
  const [moderatorName, setModeratorName] = useState('');
  const [subTab, setSubTab] = useState('На рассмотрении');
  const [moderators, setModerators] = useState([]);
  const [isModeratorsTabSelected, setIsModeratorsTabSelected] = useState(false);
  const [nominationName, setNominationName] = useState('');
  const [nominations, setNominations] = useState(['Номинация 1', 'Номинация 2', 'Номинация 3']);
  const { requests } = useRequestContext();
  const { setRequests } = useRequestContext();
  const { archRequests, setArch, archive, approve, setApprove, approveRequests, archiveNoApprove} = useRequestContext();

  const handleDeleteRequest = (id) => {
    const updatedRequests = requests.filter(request => request.id !== id);
    setRequests(updatedRequests);
  };
  const handleDeleteArchRequest = (id) => {
    const updatedRequests = archRequests.filter(request => request.id !== id);
    setArch(updatedRequests);
  };
  const handleDeleteApproveRequest = (id) => {
    const updatedRequests = approveRequests.filter(request => request.id !== id);
    setApprove(updatedRequests);
  };

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
    <div className="adminp-panel-page-container">
      <div className="adminp-panel-page">
        <div className="header-container">
          <div className="header-wrapper">
            <div className="transparent-bar">
              <div className="it-vesna">IT Весна</div>
            </div>
            <div className="tabp-container">
              <div className="adminp-left-tab-container">
                <div className={`tab ${selectedTab === 'Заявки' ? 'active' : ''}`} onClick={() => handleTabClick('Заявки')}>Заявки</div>
                <div className={`tab ${selectedTab === 'Модераторы' ? 'active' : ''}`} onClick={() => handleTabClick('Модераторы')}>Модераторы</div>
                <div className={`tab ${selectedTab === 'Номинации' ? 'active' : ''}`} onClick={() => handleTabClick('Номинации')}>Номинации</div>
              </div>
              <div className="adminp-right-tab-container">
                {selectedTab === 'Заявки' && (
                  <>
                    <div className={`tab ${subTab === 'На рассмотрении' ? 'active' : ''}`} onClick={() => setSubTab('На рассмотрении')}>На рассмотрении</div>
                    <div className={`tab ${subTab === 'Принятые' ? 'active' : ''}`} onClick={() => setSubTab('Принятые')}>Принятые</div>
                    <div className={`tab ${subTab === 'Архив' ? 'active' : ''}`} onClick={() => setSubTab('Архив')}>Архив</div>
                  </>
                )}
                
              </div>
              <div className="moder-create-container">
                {selectedTab === 'Модераторы' && (
                  <>
                     <div className="adminp-input-container">
                  <input className='email-holder' type="text" placeholder="Почта" value={moderatorEmail} onChange={(e) => setModeratorEmail(e.target.value)} />
                  <input className='name-holder' type="text" placeholder="Имя" value={moderatorName} onChange={(e) => setModeratorName(e.target.value)} /> 
                  <button className="adminp-button-create" onClick={handleCreateModerator}>Создать</button>
                </div>
                  </>
                )}
                
              </div>
            </div>
          </div>
        </div>
        
        <div className="adminp-tab-content">
          {selectedTab === 'Заявки' && (
            <div>
              {subTab === 'На рассмотрении' && 
              <div>
                <div className="RequestWindowPage">
                  <div className="requests1">
                      {requests.map(request => (
                          <div key={request.id} className="request1">
                              <div className="request-info">
                                  <div>{request.author}</div>
                                  <div>{request.title}</div>
                              </div>
                              <div className="request-buttons">
                                  <Link to={`/request/${request.id}`} className="more-button"></Link> 
                                  <button className="delete-button" onClick={() => handleDeleteRequest(request.id)}></button>
                                  <button className="accept-button" onClick={() => approve(request.id)}></button>
                                  <button className="archive-button" onClick={() => archive(request.id)}></button>
                              </div>
                          </div>
                      ))}
                  </div>
                </div>
              </div>}
              {subTab === 'Принятые' && <div>
              <div className="RequestWindowPage">
                  <div className="requests1">
                      {approveRequests.map(request => (
                          <div key={request.id} className="request1">
                              <div className="request-info">
                                  <div>{request.author}</div>
                                  <div>{request.title}</div>
                              </div>
                              <div className="request-buttons">
                                  <Link to={`/approve-request/${request.id}`} className="more-button"></Link> 
                                  <button className="delete-button" onClick={() => handleDeleteApproveRequest(request.id)}></button>
                                 
                              </div>
                          </div>
                      ))}
                  </div>
                </div>
              </div>}
              {subTab === 'Архив' && <div>
              <div className="RequestWindowPage">
                  <div className="requests1">
                      {archRequests.map(request => (
                          <div key={request.id} className="request1">
                              <div className="request-info">
                                  <div>{request.author}</div>
                                  <div>{request.title}</div>
                              </div>
                              <div className="request-buttons">
                                  <Link to={`/archive-request/${request.id}`} className="more-button"></Link> 
                                  <button className="delete-button" onClick={() => handleDeleteArchRequest(request.id)}></button>                             
                              </div>
                          </div>
                      ))}
                  </div>
                </div>
                </div>}
            </div>
          )}
          {selectedTab === 'Модераторы' && (
            <div>
            <div className="RequestWindowPage">
                  <div className="requests1">
                      {moderators.map((moderator,index) => (
                          <div key={index} className="request1">
                              <div className="request-info">
                                  <div>{moderator.name}</div>
                                  <div>{moderator.email}</div>
                              </div>
                              <div className="request-buttons"> 
                                  <button className="delete-button" onClick={() => handleDeleteModerator(index)}></button>                             
                              </div>
                          </div>
                      ))}
                  </div>
                </div>
            </div>
          )}
          {selectedTab === 'Номинации' && (
            <div>
              <div className="adminp-input-container">
                <input type="text" placeholder="Новая номинация" value={nominationName} onChange={(e) => setNominationName(e.target.value)} />
                <button className="adminp-button-create" onClick={handleAddNomination}>Добавить</button>
              </div>
              <div>
                {nominations.map((nomination, index) => (
                  <div key={index}>
                    <div className="adminp-nomination-container">
                      <div>{nomination}</div>
                      <button className="adminp-button-delete" onClick={() => handleDeleteNomination(index)}>Удалить</button>
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
