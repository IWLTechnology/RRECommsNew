const fs = require("fs");
const dbFile = "./.data/choices.db";
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
        await db.run(
          "CREATE TABLE Chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat TEXT)"
        );
        var time = new Date();
        time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
        await db.run(
          `INSERT INTO Chats (chat) VALUES ('SYSTEM MESSAGE: DO NOT DELETE THIS MESSAGE! Welcome to RREComms! If you are seeing this message, it means that the server has been cleared.<input type="text" value="Server" class="messagePostedBy" style="display: none"><p class="timePosted">${time}</p>')
          `
        );
      } else {
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

module.exports = {
  

  
  getMessages: async () => {
    try {
      return await db.all("SELECT * from Chats");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  
  delMessage: async message => {
    try {
      await db.run(
          "DELETE FROM Chats WHERE id = " + message
        );
    } catch (dbError) {
      console.error(dbError);
    }
  },
  
  delAMessages: async message => {
    try {
      await db.run(
          "DROP TABLE Chats"
        );
      await db.run(
          "CREATE TABLE Chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat TEXT)"
        );
        var time = new Date();
        time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
        await db.run(
          `INSERT INTO Chats (chat) VALUES ('SYSTEM MESSAGE: DO NOT DELETE THIS MESSAGE! Welcome to RREComms! If you are seeing this message, it means that the server has been cleared.<input type="text" value="Server" class="messagePostedBy" style="display: none"><p class="timePosted">${time}</p>')
          `
        );
    } catch (dbError) {
      console.error(dbError);
    }
  },
  
  addMessage: async data => {
    try {
      return await db.all("INSERT INTO Chats (chat) VALUES (" + "'" + data + "'" + ")");
      
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
};
