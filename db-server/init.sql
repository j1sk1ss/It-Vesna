CREATE TABLE Users (
    UID SERIAL PRIMARY KEY,
    Surname VARCHAR(255),
    Name VARCHAR(255),
    FathersName VARCHAR(255),
    Mail VARCHAR(255)
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
    PasswordHash VARCHAR(255),
    PasswordSalt VARCHAR(255),
    FOREIGN KEY (User_UID) REFERENCES Users (UID)
);

CREATE TABLE Nominations (
    UID SERIAL PRIMARY KEY,
    Name VARCHAR(255)
);
