import React, { createContext, useContext, useState } from 'react';

const RequestContext = createContext();


export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([
    { id: 1, title: "Заявка 1", author: "Егор", date: "01.04.2024", email: "egor@example.com", nomination: "Номинация 1", description: "Описание 2", consentLink1: "http://example1.com", consentLink2: "http://example2.com", attachedLinks: ["http://attachedlink1.com", "http://attachedlink2.com"] },
       { id: 2, title: "Заявка 2", author: "Паша", date: "02.04.2024", email: "pasha@example.com", nomination: "Номинация 2", description: "Описание 1", consentLink1: "http://example3.com", consentLink2: "http://example4.com", attachedLinks: ["http://attachedlink3.com", "http://attachedlink4.com"] },
  ]);
  const deleteRequest = (id) => {
    setRequests(requests.filter(request => request.id !== id));
  };
  const [archRequests, setArch]=useState([]);
  const [approveRequests, setApprove]=useState([]);
  const archive = (id) => {
    const selectedRequest = requests.find(request => request.id === id);
    setArch(prevArchRequests => [...prevArchRequests, selectedRequest]);
    setApprove(prevApproveRequests => [...prevApproveRequests, selectedRequest])
    setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
};
const archiveNoApprove = (id) => {
  const selectedRequest = archRequests.find(request => request.id === id);
  setArch(prevArchRequests => [...prevArchRequests, selectedRequest]);
};
const deleteArchRequest = (id) => {
  setArch(archRequests.filter(request => request.id !== id));
};
const deleteApproveRequest = (id) => {
  setApprove(approveRequests.filter(request => request.id !== id));
}

  const approve = (id) => {
    const selectedRequest = requests.find(request => request.id === id);
    setApprove(prevApproveRequests => [...prevApproveRequests, selectedRequest])
    setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
};
  return (
    <RequestContext.Provider value={{ requests, setRequests, deleteRequest, archRequests, setArch, archive, deleteArchRequest, approveRequests, setApprove, approve, deleteApproveRequest, archiveNoApprove }}>
      {children}
    </RequestContext.Provider>
  );
};
export const useRequestContext = () => useContext(RequestContext);