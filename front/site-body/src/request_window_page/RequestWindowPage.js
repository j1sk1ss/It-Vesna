import React, { useState } from 'react';
import './RequestWindowPage.css'; 
const RequestWindowPage = () => {
    const [requests, setRequests] = useState([
        { id: 1, title: "Zayavka 1", author: "Egor", date: "01.04.2024", email: "egor@example.com", nomination: "Best Idea", description: "Description of Zayavka 1", consentLink1: "http://example1.com", consentLink2: "http://example2.com", attachedLinks: ["http://attachedlink1.com", "http://attachedlink2.com"] },
        { id: 2, title: "Zayavka 2", author: "Pasha", date: "02.04.2024", email: "pasha@example.com", nomination: "Best Design", description: "Description of Zayavka 2", consentLink1: "http://example3.com", consentLink2: "http://example4.com", attachedLinks: ["http://attachedlink3.com", "http://attachedlink4.com"] },
        
    ]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showActions, setShowActions] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const openModal = (request) => {
        setSelectedRequest(request);
        document.body.style.overflow = 'hidden'; 
        document.body.style.paddingRight = '15px'; 
        document.body.style.position = 'relative'; 
    };

    const closeModal = () => {
        setSelectedRequest(null);
        document.body.style.overflow = ''; 
        document.body.style.paddingRight = ''; 
        document.body.style.position = '';
    };

    const handleDeleteRequest = (id) => {
        const updatedRequests = requests.filter(request => request.id !== id);
        setRequests(updatedRequests);
        closeModal(); 
    };
    const copyToClipboard = (data) => {
        navigator.clipboard.writeText(data);
    };
    const toggleActions = () => {
        setShowActions(!showActions);
    };
    

    return (
        <div className="RequestWindowPage">
            <div className="requests">
                {requests.map(request => (
                    <div key={request.id} className="request">
                        <div className="request-info">
                            <h2>{request.author}</h2>
                            <p>{request.title}</p>
                        </div>
                        <div className="request-buttons">
                            <button className="button" onClick={() => openModal(request)}>Podrobnee</button>
                            <button className="button" onClick={() => handleDeleteRequest(request.id)}>Udalit'</button>
                            <button className="button">Prinyat'</button>
                            <button className="button">Dobavit' v arkhiv</button>
                        </div>
                    </div>
                ))}
            </div>
            {selectedRequest && (
                <div className={`modal-overlay modal-fadeIn`} onClick={closeModal}>
                    <div className={`modal modal-slideIn`} onClick={(e) => e.stopPropagation()}>
                    <div className="modal">
                        <p>FIO {selectedRequest.date}</p>
                        <p>{selectedRequest.author} <button className="button" onClick={() => copyToClipboard(selectedRequest.author)}>Copy</button></p>
                        <p>Pochta </p>
                        <p><form>{selectedRequest.email} <button className="button" onClick={() => copyToClipboard(selectedRequest.email)}>Copy</button></form></p>
                        <p>nominacia </p>
                        <p><form>{selectedRequest.nomination}</form></p>
                        <p>nazvanie</p>
                        <p><form>{selectedRequest.title}</form></p>
                        <p>Opisanie</p>
                        <p><form>{selectedRequest.description}</form></p>
                        <p><a href={selectedRequest.consentLink1} target="_blank" rel="noopener noreferrer">Soglasie 1</a>  <a href={selectedRequest.consentLink2} target="_blank" rel="noopener noreferrer">Soglasie 2</a></p>
                        <p>sylki</p>
                        <ul>
                            {selectedRequest.attachedLinks.map((link, index) => (
                                <li key={index}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a> <button className="button" onClick={() => copyToClipboard(link)}>Copy</button></li>
                            ))}
                            </ul>
                            <div
                                className={`action-buttons ${isHovering ? "action-buttons-hovered" : ""}`}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <div className="action-buttons-trigger1">
                                    <span>--</span>
                                </div>
                                {isHovering && (
                                    <div className="action-buttons-dropdown">
                                        <button className="button" onClick={() => handleDeleteRequest(selectedRequest.id)}>Udalit'</button>
                                        <button className="button">Prinyat'</button>
                                        <button className="button">Dobavit' v arkhiv</button>
                                    </div>
                                )}
                            </div>
                        <button onClick={closeModal}>Zakryt'</button>
                      </div>
                        </div>
                </div>
            )}
        </div>
    );
}

export default RequestWindowPage;
