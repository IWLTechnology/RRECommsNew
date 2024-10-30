const nOfUsers = 2;
const userNames = ["test1", "test2"]
const profileImages = ['https:/, /cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/robot-icon-1024x819-ni01znnq.png?v=1715834187097','https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/fedora.png?v=1714808035931','https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/bear.png?v=1714807921101'];

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
const key = new NodeRSA(process.env.priv_key);
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
var server = http.createServer(app);
var io = socket(server, {
	connectionStateRecovery: {}
});

function readFile(name){
  fs.readFile(name, 'utf8', (err, data) => {
    return data;
  });
}


app.get("/", async (req, res) => {
  let params = req.query.raw ? {} : { seo: seo };
  params.serverkey = process.env.pub_key;
  res.render('index', params);
});
io.on('connection', async (socket) => {
	socket.on('disconnect', () => {
		console.log('a user diconnected');
	});
	socket.on('clientSend', async (data) => {
		var decrypted = key.decrypt(data, 'utf8');
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
        mySendData.success = true;
        mySendData.profileImages = profileImages;
        mySendData.un = process["env"]["u" + i + "l1"];
        mySendData.pw = process["env"]["u" + i + "l2"];
        mySendData.name = userNames[user];
        mySendData.page = readFile("views/chat.html");
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }else{
        var mySendData = {};
        mySendData.success = false;
        mySendData.error = "Incorrect login details. Please try again.";
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }
    }else if(decrypted.mode == "post"){
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
        mySendData.success =  true;
        var txt = decrypted.post;
        var time = new Date();
        time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
        txt = txt + `<p class="timePosted">${time}</p>`;
	      txt = txt.replace(/\n/g, "<br />");
        txt = txt.replace(/\'/g, "\"");
        await db.addMessage(txt);
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }
    }else if(decrypted.mode == "delete"){
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
        mySendData.success = true;
        db.delMessage(decrypted.id);
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }
    }else if(decrypted.mode == "get"){
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
        var dbIn = await db.getMessages();
        mySendData.success = true;
        mySendData.chats = dbIn.map((dbIn) => dbIn.chat);
        mySendData.ids = dbIn.map((dbIn) => dbIn.id);
        socket.emit("serverSend", clientEncryptionKey.encrypt(mySendData, 'base64'));
      }
    }
  	});
});

server.listen(3000, () => {
	console.log('Server active.')
});