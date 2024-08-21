function send() {
  if (
    document.getElementById("post").value != "" &&
    document.getElementById("post").value != undefined &&
    document.getElementById("post").value != "NaN" &&
    document.getElementById("post").value != "undefined"
  ) {
    if (document.getElementById("allowedToPost").innerHTML == "YES") {
      document.getElementById("postbtn").innerHTML = "Post in 5s...";
      document.getElementById("allowedToPost").innerHTML = "NO";
      sendMessage(document.getElementById("post").value);
      document.getElementById("post").value = "";
      setTimeout(function () {
        document.getElementById("postbtn").innerHTML = "Post";
        document.getElementById("allowedToPost").innerHTML = "YES";
      }, 5000);
    }
  }
}

function getMessages() {
  var oldChats = document.getElementById("chats").value;
  var oldIds = document.getElementById("ids").value;
  var logins = ["", "", ""];
  logins[0] = document.getElementById("un").value;
  logins[1] = document.getElementById("pw").value;
  logins[2] = document.getElementById("pin").value;
  submitData("/", "1", [
    ["un", logins[0]],
    ["pw", logins[1]],
    ["pin", logins[2]],
    ["mode", "get"],
  ]);
  document
    .getElementById("iframes")
    .children[0].addEventListener("load", function () {
      if (
        document
          .getElementById("iframes")
          .children[0].contentWindow.document.getElementById("chats").value !=
        oldChats
      ) {
        document.getElementById("ids").value = document
          .getElementById("iframes")
          .children[0].contentWindow.document.getElementById("ids").value;
        document.getElementById("chats").value = document
          .getElementById("iframes")
          .children[0].contentWindow.document.getElementById("chats").value;
        document.getElementById("iframes").innerHTML = "";
        splitMessages();
        if (document.getElementById("newSound2").innerHTML == "On") {
          message(
            "You got a new message!",
            "Click or here open RREComms to see more."
          );
          createjs.Sound.play("messageIn");
        }
      } else {
        document.getElementById("iframes").innerHTML = "";
      }
    });
}

function deleteMessage(id) {
  var logins = ["", "", ""];
  logins[0] = document.getElementById("un").value;
  logins[1] = document.getElementById("pw").value;
  logins[2] = document.getElementById("pin").value;
  submitData("/", "1", [
    ["un", logins[0]],
    ["pw", logins[1]],
    ["pin", logins[2]],
    ["mode", "delete"],
    ["id", id],
  ]);
  document
    .getElementById("iframes")
    .children[0].addEventListener("load", function () {
      document.getElementById("iframes").innerHTML = "";
      getMessages();
      if (document.getElementById("deleteSound2").innerHTML == "On") {
        createjs.Sound.play("messageError");
      }
    });
}

function sendMessage(message) {
  var name = document.getElementById("name").value;
  //var time = new Date();
  //time = time.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
  message =
    message +
    `<input type="text" value="${name}" class="messagePostedBy" style="display: none;">`;
  //message = message + `<p class="timePosted">${time}</p>`;
  var logins = ["", "", ""];
  logins[0] = document.getElementById("un").value;
  logins[1] = document.getElementById("pw").value;
  logins[2] = document.getElementById("pin").value;
  submitData("/", "1", [
    ["un", logins[0]],
    ["pw", logins[1]],
    ["pin", logins[2]],
    ["mode", "post"],
    ["post", message],
  ]);
  document
    .getElementById("iframes")
    .children[0].addEventListener("load", function () {
      document.getElementById("iframes").innerHTML = "";
      getMessages();
      if (document.getElementById("postSound2").innerHTML == "On") {
        createjs.Sound.play("messageOut");
      }
    });
}
function checkAuthor(id) {
  var x = document.getElementById("chat" + id);
  var y = x.innerHTML.split('<input type="text" value="');
  var author = y[1].split('" class="messagePostedBy"')[0];
  if (author == document.getElementById("name").value) {
    var st = document.getElementById("chat" + id).style;
    st.width = "65%";
    st.float = "right";
    st.backgroundColor = "#2471A3";
    st.zIndex = "300";
    document.getElementById("chat" + id).getElementsByClassName("delete")[0].setAttribute("onclick", "deleteMessage(" + id + ")");
  } else {
    var st = document.getElementById("chat" + id).style;
    st.width = "65%";
    st.backgroundColor = "#9B59B6";
    st.float = "left";
    st.zIndex = "300";
    if (document.getElementById("delNoMatterWhat2").innerHTML == "Off") {
      document
        .getElementById("chat" + id)
        .getElementsByClassName("delete")[0].style.display = "none";
    }
  }
  if (author == "RW") {
    x.getElementsByClassName("postAvatar")[0].src =
      document.getElementById("rimage").value;
  } else if (author == "RP") {
    x.getElementsByClassName("postAvatar")[0].src =
      document.getElementById("pimage").value;
  } else if (author == "E") {
    x.getElementsByClassName("postAvatar")[0].src =
      document.getElementById("eimage").value;
  } else {
    x.getElementsByClassName("postAvatar")[0].src =
      document.getElementById("simage").value;
  }
  x.getElementsByClassName(
    "senderHeader"
  )[0].innerHTML = `&nbsp; (${author}) sent:`;
  x.getElementsByClassName("dateStamp")[0].innerHTML = getPostedDate(id);
}
function updateDates() {
  var idSplit = document.getElementById("ids").value.split(";");
  var x;
  for (var i = 0; i < idSplit.length; i++) {
    x = document.getElementById("chat" + idSplit[i]);
    x.getElementsByClassName("dateStamp")[0].innerHTML = getPostedDate(
      idSplit[i]
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
  d = d.toLocaleString("en-US", { timeZone: "Australia/Perth" });
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
  var chats = document.getElementById("chats").value;
  var ids = document.getElementById("ids").value;
  chats = chats.split(";");
  ids = ids.split(";");
  var chats2 = [];
  var ids2 = [];
  for (var i = chats.length - 1; i > -1; i--) {
    chats2.push(chats[i]);
  } //chats now in sendChats, separated by &

  for (var i = ids.length - 1; i > -1; i--) {
    ids2.push(ids[i]);
  } //ids now in sendIds, separated by &

  for (var i = 0; i < chats2.length; i++) {
    var chat = chats2[i];
    var id = ids2[i];
    document.getElementById(
      "messages"
    ).innerHTML += `<div id="chat${id}" class="chat w3-bar"><div style="" class="w3-bar w3-left"><h1><img src="" style="" class="postAvatar w3-bar-item"><span class="senderHeader w3-bar-item"></span></h1></div><br><br><br><br><br><br><span class="w3-center">${chat}</span><span></span><a class="delete w3-white w3-btn w3-round-large w3-border w3-border-white w3-ripple w3-center w3-bar-item" style="float: right; text-align: center; height: 100%!important;" onclick=""><img src="https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/d72fddeb-0fd7-4086-8662-7ed798fde0e5.png?v=1711432237520" style="width: 20px!important; height: 20px!important; text-align: right; float; right;"></a><p class="dateStamp"></p></div><br/><br/><br/><br/><br/>`;
  }
  var id = document.getElementById("ids").value.split(";");
  for (var i = 0; i < id.length; i++) {
    checkAuthor(id[i]);
  }
}

function logout() {
  window.location.assign("/");
}

function processKeyPress(ev) {
  if (ev.key == "Enter") {
    ev.preventDefault();
    send();
  }
}

function init() {
  setTimeout(function () {
    document.getElementById("msbtm").click();
  }, 100);
  setTimeout(function () {
    document.getElementById("msbtm").click();
  }, 1000);
  setTimeout(function () {
    document.getElementById("msbtm").click();
  }, 2000);
  setInterval(function () {
    updateDates();
  }, 10000);
  message(
    "RREComms is active!",
    "RREComms is active! You will now get an alert when you get a new message."
  );
  document.getElementById("enabled").style.display = "block";
  document.getElementById("disabled").style.display = "none";
  splitMessages();
  window.setInterval(function () {
    getMessages();
  }, 1600);
  if (!createjs.Sound.initializeDefaultPlugins()) {
    console.log("Error loading SoundJS");
    alert("SOUND ERROR - Error Loading SoundJS");
  } else {
    console.log("Success loading SoundJS");
    createjs.Sound.addEventListener("fileload", playSound);
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSounds(
      [
        { id: "messageIn", src: "messageIn.ogg" },
        { id: "messageOut", src: "messageOut.ogg" },
        { id: "messageLoad", src: "messageLoad.ogg" },
        { id: "messageError", src: "messageError.ogg" },
      ],
      "//cdn.glitch.global/7fa50741-117a-440b-9131-6b9e1e32b36c/"
    );
  }
}

function submitData(address, id, params) {
  var iframe = document.createElement("iframe");
  iframe.style = "";
  iframe.name = "iframe" + id;
  document.getElementById("iframes").appendChild(iframe);

  var form = document.createElement("form");
  form.style = "";

  form.action = address;
  form.method = "POST";
  form.target = iframe.name;

  for (var i = 0; i < params.length; i++) {
    var input = document.createElement("input");
    input.type = "password";
    input.name = params[i][0];
    input.value = params[i][1];
    form.appendChild(input);
  }
  document.getElementById("iframes").appendChild(form);
  form.submit();
}

window.addEventListener("load", init);

function playSound(ev) {
  console.log("Preloaded:", ev.id, ev.src);
}

function downloadFile(content, fileName, fileType) {
  //credit to https://www.therogerlab.com/sandbox/pages/how-to-create-and-download-a-file-in-javascript?s=0ea4985d74a189e8b7b547976e7192ae.7213739ce01001e16cc74602189bfa09
  var file = new File(["\ufeff" + content], fileName, { type: fileType });
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
    document.getElementById("chats").value,
    "RLComms_Exported_Chats_" +
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
}

function importChats() {
  document.getElementById("enabled").style.display = "none";
  document.getElementById("importForm").style.display = "block";
}

function message(title, message) {
  if (!window.Notification) {
    //alert('Browser does not support notifications.');
  } else {
    // check if permission is already granted
    if (Notification.permission === "granted") {
      // show notification here
      var notify = new Notification(title, {
        body: message,
        icon: "https://cdn.glitch.global/7fa50741-117a-440b-9131-6b9e1e32b36c/Logo-Plug-WhiteBG.png?v=1686796219050",
      });
    } else {
      // request permission from user
      Notification.requestPermission()
        .then(function (p) {
          if (p === "granted") {
            // show notification here
            var notify = new Notification(title, {
              body: message,
              icon: "https://cdn.glitch.global/7fa50741-117a-440b-9131-6b9e1e32b36c/Logo-Plug-WhiteBG.png?v=1686796219050",
            });
          } else {
            //alert('User blocked notifications.');
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }
}

function image() {
  var source = prompt(
    "Enter the URL of the image to be added to the end of the message you have currently typed:"
  );
  if (source != null) {
    if (source.search("data:") == -1) {
      document.getElementById(
        "post"
      ).value += `<img src="${source}" width="100%" height="auto">`;
    } else {
      alert(
        "You cannot use images without a url; they cannot contain data: in it."
      );
    }
  }
}
function video() {
  var source = prompt(
    "Enter the URL of the video to be added to the end of the message you have currently typed:"
  );
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
function audio() {
  var source = prompt(
    "Enter the URL of the audio file to be added to the end of the message you have currently typed:"
  );
  if (source != null) {
    document.getElementById(
      "post"
    ).value += `<audio width="100%" height="auto" controls>
<source src="${source}" type="audio/ogg">
<source src="${source}" type="audio/mpeg">
Your browser does not support the audio tag.
</audio>`;
  }
}
function link() {
  var source = prompt(
    "Enter the URL of the link to be added to the end of the message you have currently typed:"
  );
  var txt = prompt(
    "Enter the text to display as the link (leave blank to use the URL as the text):"
  );
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
function settings(input) {
  switch (input) {
    case 0:
      document.getElementById("enabled").style.display = "none";
      document.getElementById("settings").style.display = "block";
      break;
    case 1:
      document.getElementById("enabled").style.display = "block";
      document.getElementById("settings").style.display = "none";
      document.getElementById("muteAllSound").innerHTML =
        document.getElementById("muteAllSound2").innerHTML;
      document.getElementById("postSound").innerHTML =
        document.getElementById("postSound2").innerHTML;
      document.getElementById("deleteSound").innerHTML =
        document.getElementById("deleteSound2").innerHTML;
      document.getElementById("newSound").innerHTML =
        document.getElementById("newSound2").innerHTML;
      document.getElementById("delNoMatterWhat").innerHTML =
        document.getElementById("delNoMatterWhat2").innerHTML;
      document.getElementById("forcePreview").innerHTML =
        document.getElementById("forcePreview2").innerHTML;
      break;
    case 2:
      document.getElementById("muteAllSound2").innerHTML =
        document.getElementById("muteAllSound").innerHTML;
      document.getElementById("postSound2").innerHTML =
        document.getElementById("postSound").innerHTML;
      document.getElementById("deleteSound2").innerHTML =
        document.getElementById("deleteSound").innerHTML;
      document.getElementById("newSound2").innerHTML =
        document.getElementById("newSound").innerHTML;
      document.getElementById("delNoMatterWhat2").innerHTML =
        document.getElementById("delNoMatterWhat").innerHTML;
      document.getElementById("forcePreview2").innerHTML =
        document.getElementById("forcePreview").innerHTML;
      document.getElementById("enabled").style.display = "block";
      document.getElementById("settings").style.display = "none";
      splitMessages();
      break;
  }
}

function soundChange(input) {
  var x;
  switch (input) {
    case 0:
      x = document.getElementById("muteAllSound");
      if (x.innerHTML == "Off") {
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
      if (x.innerHTML == "Off") {
        x.innerHTML = "On";
        document.getElementById("muteAllSound").innerHTML = "Off";
      } else {
        x.innerHTML = "Off";
      }
      break;
    case 2:
      x = document.getElementById("deleteSound");
      if (x.innerHTML == "Off") {
        x.innerHTML = "On";
        document.getElementById("muteAllSound").innerHTML = "Off";
      } else {
        x.innerHTML = "Off";
      }
      break;
    case 3:
      x = document.getElementById("newSound");
      if (x.innerHTML == "Off") {
        x.innerHTML = "On";
        document.getElementById("muteAllSound").innerHTML = "Off";
      } else {
        x.innerHTML = "Off";
      }
      break;
  }
}

function dnw() {
  var x = document.getElementById("delNoMatterWhat");
  if (x.innerHTML == "Off") {
    x.innerHTML = "On";
  } else {
    x.innerHTML = "Off";
  }
}

function forcePreview() {
  var x = document.getElementById("forcePreview");
  if (x.innerHTML == "Off") {
    x.innerHTML = "On";
  } else {
    x.innerHTML = "Off";
  }
}
