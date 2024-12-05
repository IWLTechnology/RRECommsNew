const fs = require("fs");
const dbFile = "./.data/data.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;
dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;
    try {
      if (!exists) {
        await db.run(`CREATE TABLE Chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat TEXT)`);
        var time = new Date();
        time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
        await db.run(`INSERT INTO Chats (chat) VALUES ('SYSTEM MESSAGE: DO NOT DELETE THIS MESSAGE! Welcome to RREComms! If you are seeing this message, it means that the server has been cleared.<input type="text" value="Server" class="messagePostedBy" style="display: none"><p class="timePosted">${time}</p>')`);
      } else {
      await db.run(`DROP TABLE Tokens`);
      await db.run(`CREATE TABLE Tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, l1 TEXT, l2 TEXT)`);
      }
    } catch (dbError) {
    }
  });

module.exports = {  
  getMessages: async () => {
    try {
      return await db.all(`SELECT * from Chats`);
    } catch (dbError) {
    }
  },
  delMessage: async message => {
    try {
      await db.run(`DELETE FROM Chats WHERE id = ${message}`);
    } catch (dbError) {
    }
  },
  delAMessages: async message => {
    try {
      await db.run(`DROP TABLE Chats`);
      await db.run(`CREATE TABLE Chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat TEXT)`);
        var time = new Date();
        time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
        await db.run(`INSERT INTO Chats (chat) VALUES ('SYSTEM MESSAGE: DO NOT DELETE THIS MESSAGE! Welcome to RREComms! If you are seeing this message, it means that the server has been cleared.<input type="text" value="Server" class="messagePostedBy" style="display: none"><p class="timePosted">${time}</p>')`);
    } catch (dbError) {
    }
  },
  addMessage: async data => {
    try {
      await db.run(`INSERT INTO Chats (chat) VALUES ('${data}')`);
    } catch (dbError) {
    }
  },
  createToken: async data => {
    try {
      var items = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','5','6','7','8','9','0'];
      var il = items.length;
      var maxToken = 1000;
      var myToken = "";
      for(var i = 0; i < maxToken; i++){
        myToken = myToken + items[Math.floor(Math.random() * il)];
      }
      await db.run(`INSERT INTO Tokens (token, l1, l2) VALUES ("${myToken}", "${data.l1}", "${data.l2}")`);
      return myToken;
    } catch (dbError) {
    }
  },
  readTokens: async data => {
    try {
      return await db.all(`SELECT * from Tokens`);
    } catch (dbError) {
    }
  },
  deleteToken: async data => {
    try {
      await db.run(`DELETE from Tokens where token = ${data.toDelete}`);
    } catch (dbError) {
    }
  },
  clearTokens: async data => {
    try {
      await db.run(`DROP TABLE Tokens`);
      await db.run(`CREATE TABLE Tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, l1 TEXT, l2 TEXT)`);
    } catch (dbError) {
    }
  },
};
