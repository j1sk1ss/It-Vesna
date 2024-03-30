// AdminPanelPage.js

import React from 'react';
import './AdminPanelPage.css'; // Импорт файлов стилей

const AdminPanelPage = () => {
  return (
    <div className="admin-panel-page-container">
      <div className="admin-panel-page">
        {/* Прозрачная полоса с надписью IT Весна */}
        <div className="transparent-bar">
          <div className="it-vesna">IT Весна</div>
        </div>
        
        {/* Вкладки */}
        <div className="tab-container">
        <div className="left-tab-container">
          <div className="tab">Заявки</div>
          <div className="tab">Модераторы</div>
          <div className="tab">Номинации</div>
        </div>
        <div className="right-tab-container">
          <div className="tab">На рассмотрении</div>
          <div className="tab">Принятые</div>
          <div className="tab">Архив</div>
          </div>
        </div>
        
        {/* Контейнер с содержанием заявки и кнопками */}
        <div className="request-container">
          <div className="request">
            <div className="rectangle-1">
              <div className="text">Операционная система и ядро ОС</div>
              <div className="text">Коля</div></div>
            <div className="button">Подробнее </div>
            <div className="button save"><img src="ok.png" /></div>
            <div className="button otmena"><img src="otmena.png" /></div>
            <div className="button decline"><img src="arh.png" /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
