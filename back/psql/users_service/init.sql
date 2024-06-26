CREATE TABLE Users (
    UID SERIAL PRIMARY KEY,
    Surname VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    FathersName VARCHAR(255),
    Mail VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Admins (
    User_UID INT,
    FOREIGN KEY (User_UID) REFERENCES Users (UID)
);

CREATE TABLE Moderators (
    User_UID INT,
    FOREIGN KEY (User_UID) REFERENCES Users (UID)
);

CREATE TABLE Passwords (
    User_UID INT,
    PasswordHash VARCHAR(255) NOT NULL,
    PasswordSalt VARCHAR(255) NOT NULL,
    FOREIGN KEY (User_UID) REFERENCES Users (UID)
);

CREATE TABLE Notificated (
    User_UID INT,
    NotificationType INT,
    FOREIGN KEY (User_UID) REFERENCES Users (UID)
);