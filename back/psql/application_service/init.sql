CREATE TABLE Applications {
    UID SERIAL PRIMARY KEY,
    User_UID INT UNIQUE,
    Name VARCHAR(255) NOT NULL,
    ApplicationPath VARCHAR(255) NOT NULL
};

CREATE TABLE Archive {
    ApplicationId INT,
    FOREIGN KEY (ApplicationId) REFERENCES Applications (UID)
};

CREATE TABLE Approved {
    ApplicationId INT,
    FOREIGN KEY (ApplicationId) REFERENCES Applications (UID)
};