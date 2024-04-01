CREATE TABLE Requests {
    UID SERIAL PRIMARY KEY,
    User_UID INT UNIQUE,
    Name VARCHAR(255) NOT NULL,
    RequestPath VARCHAR(255) NOT NULL
}

CREATE TABLE Archive {
    RequestId INT,
    FOREIGN KEY (RequestId) REFERENCES Requests (UID)
}

CREATE TABLE Approved {
    RequestId INT,
    FOREIGN KEY (RequestId) REFERENCES Requests (UID)
}