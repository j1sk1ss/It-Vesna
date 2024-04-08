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

  return (
    <RequestContext.Provider value={{ requests, setRequests, deleteRequest }}>
      {children}
    </RequestContext.Provider>
  );
};
export const useRequestContext = () => useContext(RequestContext);