/* This is how the DB should probably be structured, run these sql statements to do it (i really hope mssql isn't weird and lets this happen)
(i added comments but ofc don't worry about them when running) */

CREATE TABLE user(
    id INT NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    pfp VARCHAR(65535) NOT NULL, /* store in data:image format, might need to make larger */
    status ENUM('Offline', 'Online', 'Do Not Disturb') NOT NULL
);

/* for now just one chat, but later important. only needs an id and name but is referenced a lot */
CREATE TABLE chat(
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

/* warning: character limit of 255, should add something along the lines of that */
CREATE TABLE msg(
    id INT NOT NULL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    sender INT NOT NULL FOREIGN KEY REFERENCES user(id),
    chat INT NOT NULL FOREIGN KEY REFERENCES chat(id), /* links message to chat */
    timestamp TIMESTAMP
);

/* links chat to user (which users can see which chats, can go both ways) */
CREATE TABLE chat_user(
    chat_id INT NOT NULL FOREIGN KEY REFERENCES chat(id),
    user_id INT NOT NULL FOREIGN KEY REFERENCES user(id)
);

/* links users to each other (friends) */
CREATE TABLE friends(
    user1 INT NOT NULL FOREIGN KEY REFERENCES user(id),
    user2 INT NOT NULL FOREIGN KEY REFERENCES user(id)
);

CREATE TABLE friend_req(
    sender INT NOT NULL FOREIGN KEY REFERENCES user(id),
    reciever INT NOT NULL FOREIGN KEY REFERENCES user(id)
);

/* auth */
CREATE TABLE token(
    user INT NOT NULL FOREIGN KEY REFERENCES user(id),
    token VARCHAR(255) NOT NULL,
    expire DATETIME NOT NULL
);

/* run this periodically (about every hour or so) to remove inactive tokens */
DELETE FROM token WHERE expire < GETDATE();