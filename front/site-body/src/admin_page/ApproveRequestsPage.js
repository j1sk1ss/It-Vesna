import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import './RequestWindowPage.css'; 
import { useRequestContext } from './RequestContext';

const ApproveRequestsPage = ({ handleDeleteRequest }) => {
    const { id } = useParams(); 
    const { approveRequests, deleteApproveRequest, setArch, archiveNoApprove } = useRequestContext();
    const navigate = useNavigate();
    const selectedRequest = approveRequests.find(request => request.id === parseInt(id)); 
    const copyToClipboard = (data) => {
        navigator.clipboard.writeText(data);
    };
    const [isHovered, setIsHovered] = useState(false);
    const handleDelete = () => {
        deleteApproveRequest(selectedRequest.id);
        navigate('/admin-panel'); 
      };
      const archive =()=> {
        archiveNoApprove(selectedRequest.id);
    };
    const toggleHover = () => {
        setIsHovered(!isHovered);
    };
    if (!selectedRequest) return <div>Request not found</div>;
    return (
        <div className='MainContainer'>
            <div className='header-container'>
            <div className='transparent-bar'>
            <div className="it-vesn">IT Весна</div>
            </div>
            </div>
        <div className="RequestDetailsPage">

                <div className='modal'>
                    <div className='basic-stroke'>
                        <div>ФИО</div>
                        <div>{selectedRequest.date}</div>
                    </div>
                    <div className='stroke'>
                        <div>{selectedRequest.author}</div>
                        <div className='stroke-button'><button className="button copy-button" onClick={() => copyToClipboard(selectedRequest.author)}></button></div>
                    </div>
                    <div className='basic-stroke'>Почта </div>
                    <div className='stroke'>{selectedRequest.email} <button className="button copy-button" onClick={() => copyToClipboard(selectedRequest.email)}></button></div>
                    <div className='basic-stroke'>Номинация </div>
                    <div className='stroke-nonborder'>{selectedRequest.nomination}</div>
                    <div className='basic-stroke'>Название</div>
                    <div className='stroke-nonborder'>{selectedRequest.title}</div>
                    <div className='basic-stroke'>Описание</div>
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
                <div
                    className="invisible-container"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    >
                <div className='hovering-buttons2'
                    style={{ transform: isHovered ? 'translateX(15%)' : 'translateX(100%)' }}            >
                    <button
                        className="hovering-button"

                    >
                        ⬅
                    </button>
                    <div
                        className="additional-buttons"
                        style={{ transform: isHovered ? 'translateX(0)' : 'translateX(100%)' }}
                    >
                        <button onClick={handleDelete} className="additional-button2"></button>
                    </div>
                </div>
        </div>
        </div>
        </div>
    );
}

export default ApproveRequestsPage;