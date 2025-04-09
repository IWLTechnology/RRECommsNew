const nOfUsers = 2;
const userNames = ["R", "L"]
const profileImages = ['https://cdn.glitch.global/aac3c734-7514-4e68-898a-66574e5cc449/fedora.png?v=1730765682901','https://cdn.glitch.global/aac3c734-7514-4e68-898a-66574e5cc449/bearScratch.png?v=1730765682663'];

const express = require('express');
const http = require('http');
const socket = require('socket.io');
const hbs = require('hbs');
const join = require('join');
const seo = require("./seo.json");
const db = require("./sqlite.js");
const path = require('path');

const os = require('os');
const fs = require('fs');

const NodeRSA = require('node-rsa');
console.log("Generating RSA Key @2048 bits");
const key = new NodeRSA({b: 2048});

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
var server = http.createServer(app);
var io = socket(server, {
	connectionStateRecovery: {}
});

app.get("/", async (req, res) => {
  let params = req.query.raw ? {} : { seo: seo };
  params.serverkey = key.exportKey('public');
  res.render('index', params);
});
io.on('connection', async (socket) => {
	socket.on('disconnect', () => {
		console.log('a user diconnected');
	});
	socket.on('clientSend', async (data) => {
    try{
    var decrypted = JSON.parse(key.decrypt(data, 'utf8')); 
    var clientEncryptionKey = new NodeRSA(decrypted.clientKey);
    if(decrypted.mode == "login"){
      var user = null;
      for(var i = 0; i < nOfUsers; i++){
        if(process["env"]["u" + i + "l1"] == decrypted.l1 && process["env"]["u" + i + "l2"]== decrypted.l2){
          user = i;
          break;
        }else{
          continue;
        }
      }
      if(user != null){
        var mySendData = {};
        mySendData.token = await db.createToken({l1: decrypted.l1, l2: decrypted.l2});
        mySendData.success = true;
        mySendData.profileImages = profileImages;
        mySendData.userNames = userNames;
        mySendData.name = userNames[user];
        mySendData.wyd = "login";
        mySendData.page = "loginPage";
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }else{
        var mySendData = {};
        mySendData.success = false;
        mySendData.error = "Incorrect login details. Please try again.";
        mySendData.wyd = "login";
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }
    }else if(decrypted.mode == "post"){
      var user = null;
      var dbIn = await db.readTokens();
      var tokens = dbIn.map((dbIn) => dbIn.token);
      var l1s = dbIn.map((dbIn) => dbIn.l1);
      var l2s = dbIn.map((dbIn) => dbIn.l2);
      var id =  tokens.indexOf(decrypted.token);
      for(var i = 0; i < nOfUsers; i++){        
        if(process["env"]["u" + i + "l1"] == l1s[id] && process["env"]["u" + i + "l2"]== l2s[id]){
          user = i;
          break;
        }else{
          continue;
        }
      }
      if(user != null){
        var mySendData = {};
        mySendData.success =  true;
        mySendData.wyd = "post";
        var txt = decrypted.post;
        var time = new Date();
        time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
        txt = txt + `<p class="timePosted">${time}</p>`;
	      txt = txt.replace(/\n/g, "<br />");
        txt = txt.replace(/\'/g, "\"");
        await db.addMessage(txt);
        io.emit("messageChange");
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }
    }else if(decrypted.mode == "delete"){
      var user = null;
      var dbIn = await db.readTokens();
      var tokens = dbIn.map((dbIn) => dbIn.token);
      var l1s = dbIn.map((dbIn) => dbIn.l1);
      var l2s = dbIn.map((dbIn) => dbIn.l2);
      var id =  tokens.indexOf(decrypted.token);
      for(var i = 0; i < nOfUsers; i++){
        if(process["env"]["u" + i + "l1"] == l1s[id] && process["env"]["u" + i + "l2"]== l2s[id]){
          user = i;
          break;
        }else{
          continue;
        }
      }
      if(user != null){
        var mySendData = {};
        mySendData.success = true;
        mySendData.wyd = "delete";
        db.delMessage(decrypted.id);
        io.emit("messageChange");
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }
    }else if(decrypted.mode == "get"){
      var user = null;
      var dbIn = await db.readTokens();
      var tokens = dbIn.map((dbIn) => dbIn.token);
      var l1s = dbIn.map((dbIn) => dbIn.l1);
      var l2s = dbIn.map((dbIn) => dbIn.l2);
      var id =  tokens.indexOf(decrypted.token);
      for(var i = 0; i < nOfUsers; i++){
        if(process["env"]["u" + i + "l1"] == l1s[id] && process["env"]["u" + i + "l2"]== l2s[id]){
          user = i;
          break;
        }else{
          continue;
        }
      }
      if(user != null){
        var mySendData = {};
        var dbIn = await db.getMessages();
        mySendData.wyd = "get";
        mySendData.success = true;
        mySendData.chats = dbIn.map((dbIn) => dbIn.chat);
        mySendData.ids = dbIn.map((dbIn) => dbIn.id);
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }
    }
    }
    catch{
      socket.emit("serverSend", 'FATAL DECRYPTION ERROR!!!!!');
    }
  	});
});

server.listen(3000, () => {
	console.log(`I'm active!`);
});