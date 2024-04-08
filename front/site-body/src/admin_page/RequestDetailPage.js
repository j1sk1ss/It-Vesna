import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import './RequestWindowPage.css'; 
import { useRequestContext } from './RequestContext';

const RequestDetailPage = ({ handleDeleteRequest }) => {
    const { id } = useParams(); 
    const { requests, deleteRequest } = useRequestContext();
    const navigate = useNavigate();
    const selectedRequest = requests.find(request => request.id === parseInt(id)); 
    const copyToClipboard = (data) => {
        navigator.clipboard.writeText(data);
    };
    const [isHovered, setIsHovered] = useState(false);
    const handleDelete = () => {
        deleteRequest(selectedRequest.id);
        navigate('/request-window-page'); 
      };
    const toggleHover = () => {
        setIsHovered(!isHovered);
    };
    if (!selectedRequest) return <div>Request not found</div>;
    return (
        <div className="RequestDetailsPage">
                <div className='modal'>
                    <div className='basic-stroke'>
                        <div>FIO</div>
                        <div>{selectedRequest.date}</div>
                    </div>
                    <div className='stroke'>
                        <div>{selectedRequest.author}</div>
                        <div className='stroke-button'><button className="button copy-button" onClick={() => copyToClipboard(selectedRequest.author)}></button></div>
                    </div>
                    <div className='basic-stroke'>Pochta </div>
                    <div className='stroke'>{selectedRequest.email} <button className="button copy-button" onClick={() => copyToClipboard(selectedRequest.email)}></button></div>
                    <div className='basic-stroke'>nominacia </div>
                    <div className='stroke-nonborder'>{selectedRequest.nomination}</div>
                    <div className='basic-stroke'>nazvanie</div>
                    <div className='stroke-nonborder'>{selectedRequest.title}</div>
                    <div className='basic-stroke'>Opisanie</div>
                    <div className='stroke-description'>{selectedRequest.description}</div>
                    <div className='att-ref'>
                        <div><a href={selectedRequest.consentLink1} target="_blank" rel="noopener noreferrer">Soglasie 1</a> </div>
                        <div><a href={selectedRequest.consentLink2} target="_blank" rel="noopener noreferrer">Soglasie 2</a> </div>
                    </div>
                    <ul>
                        {selectedRequest.attachedLinks.map((link, index) => (
                            <li key={index}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a> <button className="button copy-button" onClick={() => copyToClipboard(link)}></button></li>
                        ))}
                    </ul>
                </div>
                <div className='hovering-buttons'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ transform: isHovered ? 'translateX(0)' : 'translateX(100%)' }}            >
                    <button
                        className="hovering-button"

                    >
                        ⬅
                    </button>
                    <div
                        className="additional-buttons"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ transform: isHovered ? 'translateX(0)' : 'translateX(100%)' }}
                    >
                        <button className="additional-button1"></button>
                        <button onClick={handleDelete} className="additional-button2"></button>
                        <button className="additional-button3"></button>
                    </div>
                </div>
        </div>
    );
}

export default RequestDetailPage;