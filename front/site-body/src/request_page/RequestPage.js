import React, { useRef, useEffect, useState  } from 'react';
import './RequestPage.css';

const RequestPage = () => {
 
  return (
    <div>
            <div className='header-container'>
            <div className='transparent-bar'>
            <div className="it-vesn">IT Весна</div>
            <div className='it-vesn1'>Создание заявки</div>
            </div>
            </div>
    <div className='back-container'>
      <div className="zayavka-container">
        <div className="left-container">
          <ZayavkaLeft />
        </div>
        <div className="right-container">
          <ZayavkaRight />
        </div>
        <button className="submit-button">Подать заявку</button> {/* Кнопка "Подать заявку" */}
      </div>
    </div>
    </div>
  );
};

const ZayavkaLeft = () => {
  const [fileAttached, setFileAttached] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileAttached(true);
      setFileName(file.name);
    } else {
      setFileAttached(false);
      setFileName('');
    }
  };

  return (
    <div className="left-content" style={{ height: '100%' }}>
      <h2></h2>
      <div>
        <input type="text" className="input-text" placeholder="Авторы" />
      </div>
      <div>
        <input type="text" className="input-text" placeholder="Возраст" />
      </div>
      <div>
        <input type="email" className="input-text" placeholder="Почта" />
      </div>
      <div>
        <input type="text" className="input-text" placeholder="Учреждение" />
      </div>
      <div>
        <select id="nomination" className="input-text" style={{ width: '90%', height: '3.55vw'}}>
          <option className='opt' value="nomination1">Номинация 1</option>
          <option className='opt' value="nomination2">Номинация 2</option>
          <option className='opt' value="nomination3">Номинация 3</option>
        </select>
      </div>
      <div className='main-file'>
      <div className='file-text' >Ссылка на согласие</div>
      <div className='file-container'>
        
        <label htmlFor="file-upload" className="input-text1" style={{ display: 'flex'}}>
          Прикрепить согласие
        </label>
        <input  type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
      <div className='rg-box'
          style={{
            background: fileAttached
              ? 'linear-gradient(45deg, darkgreen, green)' 
              : 'linear-gradient(45deg, darkred, red)', 
          }}
        />
        </div>
        </div>
    </div>
  );
};

  const ZayavkaRight = () => {
    const [links, setLinks] = useState([]);
    const [postText, setPostText] = useState('');
    const [linkName, setLinkName] = useState('');
    const [tabHeight, setTabHeight] = useState(0);
    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
     const inputRef = useRef(null); 
  const hiddenRef = useRef(null);
  const adjustHeight = () => {
    if (inputRef.current && hiddenRef.current) {
      const newHeight = hiddenRef.current.clientHeight;
      inputRef.current.style.height = `auto`; 
    }
  };
  useEffect(() => {
    adjustHeight(); // Корректируем высоту при загрузке
  }, []);
    const handleAddLink = () => {
      if (linkName.trim() !== '') {
        setLinks([...links, linkName]); 
        setLinkName(''); 
      }
    };
    const handleDeleteLink = (index) => {
      const updatedLinks = [...links];
      updatedLinks.splice(index, 1);
      setLinks(updatedLinks);
    };
    return (
        <div className='right-container'>
        <div
        className="descriprion-input"
        contentEditable="true"
        ref={inputRef}
      
        onInput={(e) => {
          setPostText(e.target.innerText);
          adjustHeight(); // Корректируем высоту при изменении текста
        }}
        onFocus={() => setIsPlaceholderVisible(false)}
        onBlur={() => {
          if (!postText.trim()) {
            setIsPlaceholderVisible(true);
          }
        }}
      >
        {isPlaceholderVisible && <div className="placeholder">Описание</div>}
      </div>
        <div className='link-container'>
          <input className="input-text" type="text" placeholder="Ссылка" value={linkName} onChange={(e) => setLinkName(e.target.value)} style={{ width: '20vw', height: '2vw'}}/>
          <button className='add-link' onClick={handleAddLink}></button>
        </div>
        <div className="links">
        {links.map((link,index) => (
                          <div key={index} className="link">
                              <div className="link-text">
                                  <div><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></div>
                              </div>
                              <div className="request-buttons"> 
                                  <button className="delete-button" onClick={() => handleDeleteLink(index)}></button>                             
                              </div>
                          </div>
                      ))}
        </div>
      </div>
    );
  };

  export default RequestPage;