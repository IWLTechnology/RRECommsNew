      if (Array.prototype.equals)
        console.warn("Overriding existing Array.prototype.equals. May have major repercussions.");
      Array.prototype.equals = function(array) {
        if (!array)
          return false;
        if (array === this)
          return true;
        if (this.length != array.length)
          return false;

        for (var i = 0, l = this.length; i < l; i++) {
          if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
              return false;
          } else if (this[i] != array[i]) {
            return false;
          }
        }
        return true;
      }
      Object.defineProperty(Array.prototype, "equals", {
        enumerable: false
      });

      var settingsData = {
        delNMW: "Off",
        forcePreview: "On"
      }
      var soundSettings = {
        muteAll: "Off",
        new: "On",
        delete: "On",
        post: "On"
      }
      
      var l1;
      var l2;
      var chats = "";
      var ids = "";
      var myKey;
      var allowedToPost = "YES";
      var myData = {};
      var serverKey;
      var socket;
      var myClientKey;

function homePage(n){
  switch(n){
    case 'chat':
      changePage('chatHome');
      initChat();
      break;
    case 'online':
      break;
    case 'games':
      break;
  }
}

function changePage(p){
  document.getElementById("pageToReplace").innerHTML = pages[p];
}

      function initLogin() {
        socket = io();
        myKey = new NodeRSA({
          b: 2048
        });
        myClientKey = myKey.exportKey('public');
        serverKey = new NodeRSA(document.getElementById('serverPubKey').value);
        document.getElementById('serverPubKey').value = "";
        socket.on("messageChange", (data) => {
          getMessages();
        });
        socket.on("serverSend", (data) => {
          document.getElementById('modal-loading').style.display = "none";
          try{
          var decrypted = JSON.parse(myKey.decrypt(data, 'utf8'));
          switch (decrypted.wyd) {
            case "login":
              if (decrypted.success) {
                myData.token = decrypted.token;
                myData.profileImages = decrypted.profileImages;
                myData.userNames = decrypted.userNames;
                myData.name = decrypted.name;  
                changePage(decrypted.page);
                setTitle('Home');
                document.getElementsByTagName('head')[0].innerHTML = defaultHead + `<link rel="stylesheet" href="chat.css">`;
                document.getElementById("enabled").style.display = "block";
                document.getElementById("loading").style.display = "none";
                document.getElementById("hi-name").innerHTML = myData.name;
                document.getElementById("hi-greeting").innerHTML = 'Welcome';
                document.getElementById("home-unread").innerHTML = 'EXAMPLE';
                document.getElementById("home-online-count").innerHTML = 'EXAMPLE';
                document.getElementById("home-online-users").innerHTML = 'EXAMPLE';
                document.getElementById("home-games-count").innerHTML = 'EXAMPLE';
                document.getElementById("home-games-users").innerHTML = 'EXAMPLE';
              } else {
                document.getElementById("error").innerHTML = decrypted.error;
              }
              break;
            case "get":
              if (decrypted.success) {
                if (chats == "") {
                  ids = decrypted.ids.slice();
                  chats = decrypted.chats.slice();
                  splitMessages();
                } else {
                  var oldChats = chats.slice();
                  var oldIds = ids.slice();
                  if (!decrypted.chats.equals(oldChats)) {
                    ids = decrypted.ids.slice();
                    chats = decrypted.chats.slice();
                    if (chats.length > oldChats.length) {
                      if (soundSettings.new == "On") {
                        message(
                          "You got a new message!",
                          "Open RREComms to see more."
                        );
                        createjs.Sound.play("newMessage");
                      }
                    } else {
                      message(
                        "Someone deleted a message.",
                        "Open RREComms to see more."
                      );
                    }
                    splitMessages();
                  }
                }
              } else {
                document.body.innerHTML = "FATAL ERROR. GET MESSAGES FAILED. PLEASE RELOAD THE PAGE. IF THIS ERROR PERSISTS, PLEASE CONTACT THE SITE OWNER.";
              }
              break;
            case "delete":
              if (decrypted.success) {

              } else {
                document.body.innerHTML = "FATAL ERROR. DELETE FAILED. PLEASE RELOAD THE PAGE. IF THIS ERROR PERSISTS, PLEASE CONTACT THE SITE OWNER.";
              }
              break;
            case "post":
              if (decrypted.success) {

              } else {
                document.body.innerHTML = "FATAL ERROR. POST FAILED. PLEASE RELOAD THE PAGE. IF THIS ERROR PERSISTS, PLEASE CONTACT THE SITE OWNER.";
              }
              break;
          }
          }
          catch{
            document.body.innerHTML = "FATAL ERROR. DECRYPTION FAILED. PLEASE RELOAD THE PAGE. IF THIS ERORR PERSISTS, PLEASE CONTACT THE SITE OWNER."
          }
        });
        document.getElementById('enabled').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
      }

      function sendData(data) {
        data.clientKey = myClientKey;
        data.token = myData.token;
        socket.emit("clientSend", serverKey.encrypt(data));
      }

      function loginBtn() {
        var mySendData = {};
        mySendData.l1 = document.getElementById("l1").value;
        mySendData.l2 = document.getElementById("l2").value;
        mySendData.mode = "login";
        mySendData.clientKey = myClientKey;
        document.getElementById('modal-loading').style.display = "block";
        socket.emit("clientSend", serverKey.encrypt(mySendData));
      }

      function sendBtn() {
        if (
          document.getElementById("post").value != "" &&
          document.getElementById("post").value != undefined &&
          document.getElementById("post").value != "NaN" &&
          document.getElementById("post").value != "undefined"
        ) {
          if (allowedToPost == "YES") {
            document.getElementById("postbtn").innerHTML = "Post in 5s...";
            allowedToPost = "NO";
            sendMessage(document.getElementById("post").value);
            document.getElementById("post").value = "";
            setTimeout(function() {
              document.getElementById("postbtn").innerHTML = "Post";
              allowedToPost = "YES";
            }, 5000);
          }
        }
      }

      function getMessages() {
        sendData({
          mode: "get"
        });
      }

      function deleteMessage(id) {
        sendData({
          mode: "delete",
          id: id
        })
        if (soundSettings.delete == "On") {
          createjs.Sound.play("delete");
        }
      }

      function sendMessage(message) {
        message =
          message +
          `<input type="text" value="${myData.name}" class="messagePostedBy" style="display: none;">`;
        sendData({
          mode: "post",
          post: message
        })
        if (soundSettings.post == "On") {
          createjs.Sound.play("post");
        }
      }

      function checkAuthor(id) {
        var x = document.getElementById("chat" + id);
        var y = x.innerHTML.split('<input type="text" value="');
        var author = y[1].split('" class="messagePostedBy"')[0];
        if (author == myData.name) {
          var st = document.getElementById("chat" + id).style;
          st.width = "65vw";
          st.float = "right";
          st.backgroundColor = "#2471A3";
          st.zIndex = "300";
          document.getElementById("chat" + id).getElementsByClassName("delete")[0].setAttribute("onclick", "deleteMessage(" + id + ")");
        } else {
          var st = document.getElementById("chat" + id).style;
          st.width = "65vw";
          st.backgroundColor = "#9B59B6";
          st.float = "left";
          st.zIndex = "300";
          if (settingsData.delNMW == "On") {
            document
              .getElementById("chat" + id)
              .getElementsByClassName("delete")[0].style.display = "none";
          }
        }
        if (author == 'Server' || author == 'server') {
          x.getElementsByClassName("postAvatar")[0].src = 'https://cdn.glitch.global/aac3c734-7514-4e68-898a-66574e5cc449/server.png?v=1731040568309';
        } else {
          x.getElementsByClassName("postAvatar")[0].src = myData.profileImages[myData.userNames.indexOf(author)];
        }
        x.getElementsByClassName(
          "senderHeader"
        )[0].innerHTML = `&nbsp; (${author}) sent:`;
        x.getElementsByClassName("dateStamp")[0].innerHTML = getPostedDate(id);
      }

      function updateDates() {
        var x;
        for (var i = 0; i < ids.length; i++) {
          x = document.getElementById("chat" + ids[i]);
          x.getElementsByClassName("dateStamp")[0].innerHTML = getPostedDate(
            ids[i]
          );
        }
      }

      function getPostedDate(id) {
        var x = document.getElementById("chat" + id);
        var y = x.innerHTML.split('<p class="timePosted">');
        var time = y[1].split("</p>")[0];
        var compare = [];
        compare.push(processDateString(time));
        var d = new Date();
        d = d.toLocaleString("en-US", {
          timeZone: "Australia/Perth"
        });
        compare.push(processDateString(d));
        if (compare[0][3] > 12) {
          if (compare[1][3] == 0) compare[1][3] = 24;
        }
        var output = "";
        if (compare[0][2] == compare[1][2]) {
          if (compare[0][1] == compare[1][1]) {
            if (compare[0][0] == compare[1][0]) {
              if (compare[0][3] == compare[1][3]) {
                if (compare[0][4] == compare[1][4]) {
                  output = "Posted less that a minute ago.";
                } else {
                  output =
                    "Posted about " +
                    (compare[1][4] - compare[0][4]) +
                    " minute(s) ago.";
                }
              } else {
                output =
                  "Posted about " + (compare[1][3] - compare[0][3]) + " hour(s) ago.";
              }
            } else {
              output =
                "Posted about " + (compare[1][0] - compare[0][0]) + " day(s) ago.";
            }
          } else {
            output =
              "Posted about " + (compare[1][1] - compare[0][1]) + " month(s) ago.";
          }
        } else {
          output = "Posted in " + compare[0][2] + ".";
        }
        return output;
      }

      function processDateString(time) {
        var temp = [];
        var result = [];
        temp.push(time.split(","));
        temp.push(temp[0][0].split("/"));
        result.push(parseInt(temp[1][1]));
        result.push(parseInt(temp[1][0]));
        result.push(parseInt(temp[1][2]));
        temp.push(temp[0][1].split(" "));
        temp.push(temp[2][1].split(":"));
        result.push(parseInt(temp[3][0]));
        result.push(parseInt(temp[3][1]));
        result.push(parseInt(temp[3][2]));
        if (temp[2][2] == "PM") {
          if (result[3] != "12") {
            result[3] = result[3] + 12;
          }
        } else {
          if (result[3] == "12" || result[3] == 12) result[3] = 0;
        }
        return result;
      }

      function splitMessages() {
        document.getElementById("messages").innerHTML = "";

        for (var i = 0; i < chats.length; i++) {
          var chat = chats[i];
          var id = ids[i];
          document.getElementById(
            "messages"
          ).innerHTML += `<div id="chat${id}" class="chat w3-bar"><div style="" class="w3-bar w3-left"><h1><img src="" style="" class="postAvatar w3-bar-item"><span class="senderHeader w3-bar-item"></span></h1></div><br><br><br><br><br><br><span class="w3-center">${chat}</span><span></span><a class="delete w3-white w3-btn w3-round-large w3-border w3-border-white w3-ripple w3-center w3-bar-item" style="float: right; text-align: center; height: 100%!important;" onclick=""><img src="https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/d72fddeb-0fd7-4086-8662-7ed798fde0e5.png?v=1711432237520" style="width: 20px!important; height: 20px!important; text-align: right; float; right;"></a><p class="dateStamp"></p></div><br/><br/><br/><br/><br/>`;
        }
        for (var i = 0; i < ids.length; i++) {
          checkAuthor(ids[i]);
        }
      }

      function logout() {
        window.location.assign("/");
      }

      function processKeyPress(ev) {
        if (ev.key == "Enter") {
          ev.preventDefault();
          sendBtn();
        }
      }

      function setTitle(t) {
        document.title = `${t} | RREComms`;
      }

      function initChat() {
        document.getElementsByTagName('head')[0].innerHTML = defaultHead + `<link rel="stylesheet" href="chat.css">`;
        setTimeout(function() {
          document.getElementById('msbtm').scrollIntoView();
        }, 1000);
        setInterval(function() {
          updateDates();
        }, 10000);
        message(
          "RREComms is active!",
          "RREComms is active! You will now get an alert when you get a new message."
        );

        document.getElementById("enabled").style.display = "block";
        document.getElementById("loading").style.display = "none";
        getMessages();
        if (!createjs.Sound.initializeDefaultPlugins()) {
          document.body.innerHTML = "FATAL ERROR - Error Loading SoundJS";
        } else {
          createjs.Sound.alternateExtensions = ["mp3", "ogg"];
          createjs.Sound.registerSounds(
            [{
                id: "newMessage",
                src: "messageIn.ogg"
              },
              {
                id: "post",
                src: "messageOut.ogg"
              },
              {
                id: "delete",
                src: "messageError.ogg"
              },
            ],
            "//cdn.glitch.global/7fa50741-117a-440b-9131-6b9e1e32b36c/"
          );
        }
        setTitle('Chat');
      }

      /*function downloadFile(content, fileName, fileType) {
        var file = new File(["\ufeff" + content], fileName, {
          type: fileType
        });
        var url = window.URL.createObjectURL(file);
        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);
      }

      function exportChats() {
        var date = new Date();
        downloadFile(
          chats,
          "RREComms_Exported_Chats_" +
          date.getDate() +
          "." +
          date.getMonth() +
          "." +
          date.getFullYear() +
          "_" +
          date.getHours() +
          "." +
          date.getMinutes() +
          ".iwltechdata",
          "text/encrypted:charset=UTF-8"
        );
      }*/

      function message(title, message) {
        if (!window.Notification) {} else {
          if (Notification.permission === "granted") {
            var notify = new Notification(title, {
              body: message,
              icon: "https://cdn.glitch.global/aac3c734-7514-4e68-898a-66574e5cc449/logofav1-3.png?v=1731038687620",
            });
          } else {
            Notification.requestPermission()
              .then(function(p) {
                if (p === "granted") {
                  var notify = new Notification(title, {
                    body: message,
                    icon: "https://cdn.glitch.global/aac3c734-7514-4e68-898a-66574e5cc449/logofav1-3.png?v=1731038687620",
                  });
                } else {}
              })
              .catch(function(err) {
                console.error(err);
              });
          }
        }
      }

      function openMedia(n) {
        switch(n){
          case 0:
            $("#image-div").dialog({
		          dialogClass: "no-close",
		          closeOnEscape: false,
		          modal: true,
		          height: "auto",
		          width: "auto",
	          });
            break;
          case 1:
            $("#video-div").dialog({
		          dialogClass: "no-close",
		          closeOnEscape: false,
		          modal: true,
		          height: "auto",
		          width: "auto",
	          });
            break;
          case 2:
            $("#audio-div").dialog({
		          dialogClass: "no-close",
		          closeOnEscape: false,
		          modal: true,
		          height: "auto",
		          width: "auto",
	          });
            break;
          case 3:
            $("#link-div").dialog({
		          dialogClass: "no-close",
		          closeOnEscape: false,
		          modal: true,
		          height: "auto",
		          width: "auto",
	          });
            break;
        }
      }

function closeimage(n){
  if(n == 0){
  }else{
    var source = document.getElementById("image-input").value;
    if (source != null) {
          if (source.search("data:") == -1) {
            document.getElementById("post").value += `<img src="${source}" width="100%" height="auto">`;
          } else {
            alert(
              "You cannot use images without a url; they cannot contain data: in it."
            );
          }
        }
  }
  $("#image-div").dialog("close");
}

function closevideo(n){
  if(n == 0){
  }else{
    var source = document.getElementById("video-input").value;
    if (source != null) {
          if (source.search("youtube.com") == -1) {
            document.getElementById(
              "post"
            ).value += `<video width="100%" height="auto" controls>
      <source src="${source}" type="video/mp4">
      <source src="${source}" type="video/ogg">
      <source src="${source}" type="video/webm">
      <source src="${source}" type="video/mov">
      Your browser does not support the video tag.
      </video>`;
          } else {
            source = source.split("/watch?v=")[1];
            document.getElementById(
              "post"
            ).value += `<iframe width="100%" height="auto" src="https://www.youtube.com/embed/${source}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
          }
        }
  }
  $("#video-div").dialog("close");
}

function closeaudio(n){
  if(n == 0){
  }else{
    var source = document.getElementById("audio-input").value;
    if (source != null) {
          document.getElementById(
            "post"
          ).value += `<audio width="100%" height="auto" controls>
      <source src="${source}" type="audio/ogg">
      <source src="${source}" type="audio/mpeg">
      The audio tag is not supported.
      </audio>`;
        }
  }
  $("#audio-div").dialog("close");
}

function closelink(n){
  if(n == 0){
  }else{
    var source = document.getElementById("link-input-1").value;
    var txt = document.getElementById("link-input-2").value;
    if (source != null) {
          if (txt != "") {
            document.getElementById(
              "post"
            ).value += `<a href="${source}" target="_blank">${txt}</a>`;
          } else {
            document.getElementById(
              "post"
            ).value += `<a href="${source}" target="_blank">${source}</a>`;
          }
        }
  }
  $("#link-div").dialog("close");
}

      function settings(input) {
        switch (input) {
          case 0:
            document.getElementById("enabled").style.display = "none";
            document.getElementById("settings").style.display = "block";
            break;
          case 1:
            document.getElementById("enabled").style.display = "block";
            document.getElementById("settings").style.display = "none";
            document.getElementById("muteAllSound").innerHTML = soundSettings.muteAll;
            document.getElementById("postSound").innerHTML = soundSettings.post;
            document.getElementById("deleteSound").innerHTML = soundSettings.delete;
            document.getElementById("newSound").innerHTML = soundSettings.new;
            document.getElementById("delNoMatterWhat").innerHTML = settingsData.delNMW;
            document.getElementById("forcePreview").innerHTML = settingsData.forcePreview;
            break;
          case 2:
            soundSettings.muteAll = document.getElementById("muteAllSound").innerHTML;
            soundSettings.post = document.getElementById("postSound").innerHTML;
            soundSettings.delete = document.getElementById("deleteSound").innerHTML;
            soundSettings.new = document.getElementById("newSound").innerHTML;
            settingsData.delNMW = document.getElementById("delNoMatterWhat").innerHTML;
            settingsData.forcePreview = document.getElementById("forcePreview").innerHTML;
            document.getElementById("enabled").style.display = "block";
            document.getElementById("settings").style.display = "none";
            splitMessages();
            break;
        }
      }

      function switchSettings(input) {
        var x;
        switch (input) {
          case 0:
            x = document.getElementById("muteAllSound");
            if (soundSettings.muteAll == false) {
              x.innerHTML = "On";
              document.getElementById("postSound").innerHTML = "Off";
              document.getElementById("deleteSound").innerHTML = "Off";
              document.getElementById("newSound").innerHTML = "Off";
            } else {
              x.innerHTML = "Off";
              document.getElementById("postSound").innerHTML = "On";
              document.getElementById("deleteSound").innerHTML = "On";
              document.getElementById("newSound").innerHTML = "On";
            }
            break;
          case 1:
            x = document.getElementById("postSound");
            if (x.innerHTML = "Off") {
              x.innerHTML = "On";
              document.getElementById("muteAllSound").innerHTML = "Off";
            } else {
              x.innerHTML = "Off";
            }
            break;
          case 2:
            x = document.getElementById("deleteSound");
            if (x.innerHTML = "Off") {
              x.innerHTML = "On";
              document.getElementById("muteAllSound").innerHTML = "Off";
            } else {
              x.innerHTML = "Off";
            }
            break;
          case 3:
            x = document.getElementById("newSound");
            if (x.innerHTML = "Off") {
              x.innerHTML = "On";
              document.getElementById("muteAllSound").innerHTML = "Off";
            } else {
              x.innerHTML = "Off";
            }
            break;
          case 4:
            var x = document.getElementById("delNoMatterWhat");
            if (x.innerHTML = "Off") {
              x.innerHTML = "On";
            } else {
              x.innerHTML = "Off";
            }
            break;
          case 5:
            var x = document.getElementById("forcePreview");
            if (x.innerHTML = "Off") {
              x.innerHTML = "On";
            } else {
              x.innerHTML = "Off";
            }
            break;
        }
      }