import React, { useState } from 'react';
import './RequestPage.css'; 

const RequestPage = () => {
  
    const [fileNames, setFileNames] = useState({
        soglasie1: '',
        soglasie2: ''
    });

    const [link, setLink] = useState('');
    const [links, setLinks] = useState([]);

    const handleFileChange = (event) => {
        const fieldName = event.target.name;
        const fileName = event.target.files[0].name;
        setFileNames((prevState) => ({
            ...prevState,
            [fieldName]: fileName
        }));
    };

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handleLinkSubmit = () => {
        if (link.trim() !== '') {
            setLinks((prevLinks) => [...prevLinks, link]);
            setLink('');
        }
    };

    return (
        <div className="app">
            <header>
                <h1>Создание заявки</h1>
            </header>
            <div className="container1">
                <form1>
                    <aside>
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
                            <label htmlFor="nomination">Номинация:</label>
                            <select id="nomination">
                                <option value="nominatsiya1">Номинация из БД (1)</option>
                                <option value="nominatsiya2">Номинация из БД (2)</option>
                                <option value="nominatsiya3">Номинация из БД (3)</option>
                            </select>
                        </div>
                        <div>
                            <input type="text" placeholder="Введите уч. учреждение" />
                        </div>
                        <div className="file-input-container">
                            <input type="file" id="soglasie1" name="soglasie1" onChange={handleFileChange} className="file-input" />
                            <label htmlFor="soglasie1" className="file-label">
                                {fileNames.soglasie1 ? fileNames.soglasie1 : 'Загрузить'}
                            </label>
                            {fileNames.soglasie1 ? <div className="green-box"></div> : <div className="red-box"></div>}
                        </div>
                        <a href="/path/to/soglasie" className="link">Пример согласия</a>
                        <div className="file-input-container">
                            <input type="file" id="soglasie2" name="soglasie2" onChange={handleFileChange} className="file-input" />
                            <label htmlFor="soglasie2" className="file-label">
                                {fileNames.soglasie2 ? fileNames.soglasie2 : 'Загрузить'}
                            </label>
                            {fileNames.soglasie2 ? <div className="green-box"></div> : <div className="red-box"></div>}
                        </div>
                        <a href="/path/to/soglasie" className="link">Пример согласия</a>
                    </aside>
                </form1>
                <form2>
                    <div className="right-content">
                        <div>
                            <textarea placeholder="Введите описание проекта"></textarea>
                        </div>
                        <div>
                            <input type="text" placeholder="Ссылка на ресурс" value={link} onChange={handleLinkChange} />
                            <button type="button" onClick={handleLinkSubmit}>Добавить ссылки</button>
                        </div>
                        <div>
                            {links.map((link, index) => (
                                <p key={index}>Ссылка {index + 1}: {link}</p>
                            ))}
                        </div>
                    </div>
                    </form2>
                
            </div>
            <footer>
                <button type="submit">Отправить заявку</button>
            </footer>
        </div>
    );
};

export default RequestPage;
