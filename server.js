const images = ['https:/, /cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/robot-icon-1024x819-ni01znnq.png?v=1715834187097','https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/fedora.png?v=1714808035931','https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/bear.png?v=1714807921101'];

const express = require('express');
const http = require('http');
const socket = require('socket.io');
const hbs = require('hbs');
const join = require('join');
const seo = require("./seo.json");
const db = require("./src/sqlite.js");
const path = require('path');

const os = require('os');
const fs = require('fs');

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


app.get("/", async (req, res) => {
  let params = req.query.raw ? {} : { seo: seo };
  
  res.render('index', params);
});
app.get("/PWA", async (req, res) => {
  let params = req.query.raw ? {} : { seo: seo };

  res.render('index', params);
});

io.on('connection', async (socket) => {
	socket.on('disconnect', () => {
		console.log('a user diconnected');
	});
	socket.on('play', async () => {
		db.increaseCounter();
		var counter = await db.getCounter();
		if (counter) {
			counter = counter.map((Counter) => Counter.counter);
		}
		io.emit('counterUpdate', {newValue: counter});
	});
	socket.on('requestHighscores', async () => {
		var highscores = await db.getHighscores();
		socket.emit('highscoresReturn', highscores);
	});
	socket.on('checkHighscores', async () => {
		var highscores = await db.getHighscores();
		socket.emit('checkHighscoresReturn', highscores);
	});
	socket.on('newHighscore', async (data) => {
		 db.addHighscore({ time: data.time, name: data.name, correct: data.correct, nofq: data.nofq});
	});
});

app.post('/', async (req, res) => {
  let params = req.query.raw ? {} : { seo: seo };
  const status = 200;
  var view = '/src/pages/index.hbs';
    
    if(req.body.mode == "post"){
      if(req.body.un == process.env.run && req.body.pw == process.env.rpw && req.body.pin == process.env.rpin){
        view = '/src/pages/post.hbs';
    var txt = req.body.post;
        var time = new Date();
        time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
        txt = txt + `<p class="timePosted">${time}</p>`;
	  txt = txt.replace(/\n/g, "<br />");
    txt = txt.replace(/;/g, ",");
    txt = txt.replace(/\'/g, "\"");
    await db.addMessage(txt);
      }else if(req.body.un == process.env.pun && req.body.pw == process.env.ppw && req.body.pin == process.env.ppin){
        view = '/src/pages/post.hbs';
    var txt = req.body.post;
    var time = new Date();
    time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
    txt = txt + `<p class="timePosted">${time}</p>`;
	  txt = txt.replace(/\n/g, "<br />");
    txt = txt.replace(/;/g, ",");
    txt = txt.replace(/\'/g, "\"");
    await db.addMessage(txt);
      }else if(req.body.un == process.env.eun && req.body.pw == process.env.epw && req.body.pin == process.env.epin){
        view = '/src/pages/post.hbs';
    var txt = req.body.post;
    var time = new Date();
    time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
    txt = txt + `<p class="timePosted">${time}</p>`;
	  txt = txt.replace(/\n/g, "<br />");
    txt = txt.replace(/;/g, ",");
    txt = txt.replace(/\'/g, "\"");
    await db.addMessage(txt);
      }else{
        //login incorrect
        params.error = "ERROR 403. ACCESS DENIED"
      }
    }else if(req.body.mode == "delete"){
      if(req.body.un == process.env.run && req.body.pw == process.env.rpw && req.body.pin == process.env.rpin){
        view = '/src/pages/del.hbs';
        db.delMessage(req.body.id);
      }else if(req.body.un == process.env.pun && req.body.pw == process.env.ppw && req.body.pin == process.env.ppin){
        view = '/src/pages/del.hbs';
         db.delMessage(req.body.id);       
      }else if(req.body.un == process.env.eun && req.body.pw == process.env.epw && req.body.pin == process.env.epin){
        view = '/src/pages/del.hbs';
         db.delMessage(req.body.id);       
      }else{
        params.error = "ERROR 403. ACCESS DENIED."
      }
    }else if(req.body.mode == "get"){
      if(req.body.un == process.env.run && req.body.pw == process.env.rpw && req.body.pin == process.env.rpin){
        params.error = "";
      view = '/src/pages/get.hbs';
        params.un = process.env.run;
        params.pw = process.env.rpw;
        params.pin = process.env.rpin;
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
          
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        }
      }else if(req.body.un == process.env.pun && req.body.pw == process.env.ppw && req.body.pin == process.env.ppin){
        params.un = process.env.pun;
        params.pw = process.env.ppw;
        params.pin = process.env.ppin;
       params.error = "";
      view = '/src/pages/get.hbs';
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
          
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        } 
      }else if(req.body.un == process.env.eun && req.body.pw == process.env.epw && req.body.pin == process.env.epin){
        params.un = process.env.eun;
        params.pw = process.env.epw;
        params.pin = process.env.epin;
       params.error = "";
      view = '/src/pages/get.hbs';
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
          
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        } 
      }else{
        params.error = "ERROR 403. ACCESS DENIED."
      }
      
    }else if(req.body.mode == "login"){
      //Login
      if(req.body.un == process.env.run && req.body.pw == process.env.rpw && req.body.pin == process.env.rpin){
        //R login
        params.eimage = eimage;
        params.rimage = rimage;
        params.simage = simage;
        params.pimage = pimage;
        params.un = process.env.run;
        params.pw = process.env.rpw;
        params.pin = process.env.rpin;
        view = '/src/pages/ch.hbs';
        params.name = 'RW';
        params.error = "";
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
          
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        }
      }else if(req.body.un == process.env.pun && req.body.pw == process.env.ppw && req.body.pin == process.env.ppin){ //L login
        params.eimage = eimage;
        params.rimage = rimage;
        params.simage = simage;
        params.pimage = pimage;
        params.un = process.env.pun;
        params.pw = process.env.ppw;
        params.pin = process.env.ppin;
        view = '/src/pages/ch.hbs';
        params.name = 'RP';
        params.error = "";
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
        
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        }
      }else if(req.body.un == process.env.eun && req.body.pw == process.env.epw && req.body.pin == process.env.epin){ //L login
        params.eimage = eimage;
        params.rimage = rimage;
        params.simage = simage;
        params.pimage = pimage;
        params.un = process.env.eun;
        params.pw = process.env.epw;
        params.pin = process.env.epin;
        view = '/src/pages/ch.hbs';
        params.name = 'E';
        params.error = "";
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
        
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        }
      }else{
        //Login fail
        params.error = 'INCORRECT LOGIN DETAILS';
      }
      
    }else if(req.body.mode == 'importChats'){

    }else{
      //checks fail
      params.error = 'ERROR 403. ACCESS DENIED.';
    }
  res.render('index', params);
})

server.listen(3000, () => {
	console.log('Server active.')
});