import React, { useState } from 'react';
import './RequestPage.css'; // ���������� ���� ������

const RequestPage = () => {

    const [fileNames, setFileNames] = useState({
        first_agreement: '',
        second_agreement: ''
    });

    const [link, setLink] = useState(''); // ��������� ��� �������� ��������� ������
    const [links, setLinks] = useState([]); // ��������� ��� �������� ���� ������

    const handleFileChange = (event) => {
        const fieldName = event.target.name;
        const fileName = event.target.files[0].name;
        setFileNames((prevState) => ({
            ...prevState,
            [fieldName]: fileName
        }));
    };

    const handleLinkChange = (event) => {
        setLink(event.target.value); // ��������� ��������� ��� ��������� ���� �����
    };

    const handleLinkSubmit = () => {
        if (link.trim() !== '') {
            setLinks((prevLinks) => [...prevLinks, link]); // ��������� ����� ������ � ������ ���� ������
            setLink(''); // ������� ���� �����
        }
    };

    const handleLinkDelete = (index) => {
        setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
    };

    return (
        <div className="RequestPage">
            <header>
                <h1>Заявка</h1>
            </header>
            <div className="main_container">
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
                                <option value="first_nomination">Номинация из БД (1)</option>
                            </select>
                        </div>
                        <div>
                            <input type="text" placeholder="Учебное учреждение" />
                        </div>
                        <div className="file-input-container">
                            <input type="file" id="first_agreement" name="first_agreement" onChange={handleFileChange} className="file-input" />
                            <label htmlFor="first_agreement" className="file-label">
                                {fileNames.first_agreement ? fileNames.first_agreement : 'Загрузить'}
                            </label>
                            {fileNames.first_agreement ? <div className="green-box"></div> : <div className="red-box"></div>}
                        </div>
                        <a href="/path/to/soglasie" className="link">Пример согласия</a>
                        <div className="file-input-container">
                            <input type="file" id="second_agreement" name="second_agreement" onChange={handleFileChange} className="file-input" />
                            <label htmlFor="second_agreement" className="file-label">
                                {fileNames.second_agreement ? fileNames.second_agreement : 'Загрузить'}
                            </label>
                            {fileNames.second_agreement ? <div className="green-box"></div> : <div className="red-box"></div>}
                        </div>
                        <a href="/path/to/soglasie" className="link">Пример согласия</a>
                    </aside>
                </form1>
                <form2>
                    <div className="right-content">
                        <div>
                            <textarea placeholder="Vvedite opisanie"></textarea>
                        </div>
                        <div>
                            <input type="text" placeholder="Ссылка" value={link} onChange={handleLinkChange} />
                            <button type="button" onClick={handleLinkSubmit}>Новая ссылка</button>
                        </div>
                        <div className="links-container">
                            {links.map((link, index) => (
                                <div key={index} className="link-item">
                                    <p>link {index + 1}: {link}</p>
                                    <button onClick={() => handleLinkDelete(index)}>Удалить</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </form2>

            </div>
            <footer>
                <button type="submit">Отправить</button>
            </footer>
        </div>
    );
};

export default RequestPage;
