import React, { useState } from 'react';
import './RequestPage.css';

const RequestPage = () => {
  return (
    <div>
      <div className="it-vesna">IT Весна
      </div>
      <div className="zayavka-container">
        <div className="left-container">
          <ZayavkaLeft />
        </div>
        <div className="right-container">
          <ZayavkaRight />
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
        <input type="email" className="input-email" placeholder="Почта" />
      </div>
      <div>
        <label htmlFor="nomination">Номинация:</label>
        <select id="nomination">
          <option value="nomination1">Номинация 1</option>
          <option value="nomination2">Номинация 2</option>
          <option value="nomination3">Номинация 3</option>
        </select>
      </div>
      <div>
        <input type="text" className="input-text" placeholder="Учреждение" />
      </div>
      <div>
        <label htmlFor="file-upload" style={{ display: fileAttached ? 'none' : 'block' }}>
          Прикрепить согласие
        </label>
        <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
        {fileAttached && <div>{fileName}</div>}
      </div>
    </div>
  );
};

  const ZayavkaRight = () => {
    return (
        <div>
        <h2> </h2>
        <textarea className="input-field" placeholder="Описание заявки"></textarea>
        <div>
          <input type="text" placeholder="Ссылка" />
        </div>
      </div>
    );
  };

  export default RequestPage;