import React, { useState } from 'react';
import './RequestPage.css';

const RequestPage = () => {
  return (
    <div>
      <div className="it-vesna">IT Весна</div>
      <div className="zayavka-container">
        <div className="left-container">
          <ZayavkaLeft />
        </div>
        <div className="right-container">
          <ZayavkaRight />
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
    setFileName(file.name);
    setFileAttached(true);
  };

  return (
    <div className="left-content" style={{ height: '100%' }}>
      <h2>Левая часть</h2>
      <div>
        <input type="text" placeholder="Авторы" />
      </div>
      <div>
        <input type="text" placeholder="Возраст" />
      </div>
      <div>
        <input type="email" placeholder="Почта" />
      </div>
      <div>
        <label htmlFor="file-upload" style={{ display: fileAttached ? 'none' : 'block' }}>Прикрепить согласие</label>
        <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
        {fileAttached && <div>{fileName}</div>}
      </div>
    </div>
  );
};

const ZayavkaRight = () => {
  return (
    <div className="right-content" style={{ height: '100%', width: '300px', overflowY: 'auto' }}>
      <h2>Правая часть</h2>
      <textarea style={{ width: '100%', height: '80%' }} />
      <div>
        <input type="text" placeholder="Ссылка" style={{ width: '100%' }} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <button>Подать</button>
      </div>
    </div>
  );
};

export default RequestPage;
