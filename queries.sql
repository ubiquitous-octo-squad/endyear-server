/* This is how the DB should probably be structured, run these sql statements to do it (i really hope mssql isn't weird and lets this happen)
(i added comments but ofc don't worry about them when running) */

CREATE TABLE person(
    id INT NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
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
    sender INT NOT NULL FOREIGN KEY REFERENCES person(id),
    chat INT NOT NULL FOREIGN KEY REFERENCES chat(id), /* links message to chat */
    timestamp TIMESTAMP
);

/* links chat to person (which persons can see which chats, can go both ways) */
CREATE TABLE chat_person(
    chat_id INT NOT NULL FOREIGN KEY REFERENCES chat(id),
    person_id INT NOT NULL FOREIGN KEY REFERENCES person(id)
);

/* links persons to each other (friends) */
CREATE TABLE friends(
    person1 INT NOT NULL FOREIGN KEY REFERENCES person(id),
    person2 INT NOT NULL FOREIGN KEY REFERENCES person(id)
);

CREATE TABLE friend_req(
    sender INT NOT NULL FOREIGN KEY REFERENCES person(id),
    reciever INT NOT NULL FOREIGN KEY REFERENCES person(id)
);

/* auth */
CREATE TABLE token(
    person INT NOT NULL FOREIGN KEY REFERENCES person(id),
    token VARCHAR(255) NOT NULL,
    expire DATETIME NOT NULL
);

/* run this periodically (about every hour or so) to remove inactive tokens */
DELETE FROM token WHERE expire < GETDATE();


/* token validation check, will (hopefully) return nothing when token is expired */
SELECT id FROM token
JOIN person ON token.person = person.id
WHERE token = @tokenString AND expire < GETDATE();
-- tokenString can be edited (https://stackoverflow.com/questions/36840439/node-mssql-how-to-use-the-built-in-sql-injection-protection)

/* get users in chat */

SELECT person_id FROM chat_person
WHERE chat_id = @chatId
-- chatId can be edited (see above stackoverflow link)