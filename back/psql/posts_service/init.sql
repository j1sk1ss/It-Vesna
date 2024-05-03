CREATE TABLE Post {
    UID SERIAL PRIMARY KEY,
    Author_UID INT,
    PostPath VARCHAR(255) NOT NULL,
    Pinned INT,
    Category VARCHAR(255) NOT NULL,
};