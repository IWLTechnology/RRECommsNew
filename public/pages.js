var chatHome = `<div id="enabled">
      <div class="w3-top">
      <div class="w3-bar w3-black">
        <h3 style="" class="w3-bar-item w3-button w3-show-inline-block start"><span class="logo"></span><span></span><span class="head">Chat | RREComms</span></h3>
        <h3 onclick="logout()" class="w3-bar-item w3-button w3-right ab w3-show-inline-block"><span class="logo"></span><span></span><span class="head">Logout</span></h3>
        <h3 onclick="settings(0)" class="w3-bar-item w3-button w3-right ab w3-show-inline-block"><span class="logo"></span><span></span><span class="head">Settings</span></h3>
      </div>
    </div>
    <div class="w3-center">
    <br/><br/><br/><br/><br/><br/>
        <h1>
          Welcome!
        </h1>
      <hr>
    
  </div>
  <div id="messageBox" class="w3-center">
    <div id="messages" class="w3-center w3-bar">
      
    </div>
    <br/>
    <br/>
    <br/>
  </div>
          <a class="w3-bar" href="#msbtm" style="width: 100%;" id="msbtm">
    </a>
  <br />
  <br />
  <br />
      <br />
  <br />
  <br />
    <div class="w3-bottom w3-black">
      <div class="w3-bar">
        <h3 class="w3-bar-item ab w3-show-inline-block">
          <textarea id="post" type="text" name="post" onkeydown="processKeyPress(event)" placeholder="Enter your message" class=" w3-bar-item w3-input w3-bar-item w3-round-large w3-border w3-border-black w3-ripple messageBox"></textarea><span class="w3-bar-item"></span>
        </h3>
      <h3 onclick="openMedia(0)" class="w3-bar-item w3-button w3-show-inline-block messageBtn"><span class="w3-bar-item w3-input w3-bar-item w3-round-large w3-border w3-border-blue w3-ripple sendLogoBase"><img src="https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/imgicon.png?v=1709691737708" class="sendLogo"></span></h3>
        <h3 onclick="openMedia(1)" class="w3-bar-item w3-button w3-show-inline-block messageBtn"><span class="w3-bar-item w3-input w3-bar-item w3-round-large w3-border w3-border-blue w3-ripple sendLogoBase"><img src="https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/videoicon.png?v=1709692127041" class="sendLogo"></span></h3>
        <h3 onclick="openMedia(2)" class="w3-bar-item w3-button w3-show-inline-block messageBtn"><span class="w3-bar-item w3-input w3-bar-item w3-round-large w3-border w3-border-blue w3-ripple sendLogoBase"><img src="https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/audioicon.png?v=1709692770699" class="sendLogo"></span></h3>
        <h3 onclick="openMedia(3)" class="w3-bar-item w3-button w3-show-inline-block messageBtn"><span class="w3-bar-item w3-input w3-bar-item w3-round-large w3-border w3-border-blue w3-ripple sendLogoBase"><img src="https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/linkicon.png?v=1709693004932" class="sendLogo"></span></h3>
        <h3 onclick="sendBtn()" class="w3-bar-item w3-button w3-show-inline-block messageBtn"><span class="w3-bar-item w3-input w3-bar-item w3-round-large w3-border w3-border-purple w3-ripple postBtn" id="postbtn">Post</span></h3>
      </div>
    </div>
  </div>
  <div id="image-div" style="display: none!important;" title="Insert image">
				<p>
					Please enter the details of the image:
					<input
						type="text"
						placeholder="URL (Click copy link on Google)"
						id="image-input"
					><br><button
						class="w3-purple w3-btn w3-round-xlarge w3-border w3-border-purple w3-ripple"
						onclick="closeimage(0)"
					>
						Cancel
					</button>
					<button
						class="w3-purple w3-btn w3-round-xlarge w3-border w3-border-purple w3-ripple"
						onclick="closeimage(1)"
					>
						Insert
					</button>
				</p>
			</div>
    <div id="video-div" style="display: none!important;" title="Insert video">
				<p>
					Please enter the details of the video:
					<input
						type="text"
						placeholder="URL"
						id="video-input"
					><br><button
						class="w3-purple w3-btn w3-round-xlarge w3-border w3-border-purple w3-ripple"
						onclick="closevideo(0)"
					>
						Cancel
					</button>
					<button
						class="w3-purple w3-btn w3-round-xlarge w3-border w3-border-purple w3-ripple"
						onclick="closevideo(1)"
					>
						Insert
					</button>
				</p>
			</div>
      <div id="audio-div" style="display: none!important;" title="Insert audio">
				<p>
					Please enter the details of the audio:
					<input
						type="text"
						placeholder="URL"
						id="audio-input"
					><br><button
						class="w3-purple w3-btn w3-round-xlarge w3-border w3-border-purple w3-ripple"
						onclick="closeaudio(0)"
					>
						Cancel
					</button>
					<button
						class="w3-purple w3-btn w3-round-xlarge w3-border w3-border-purple w3-ripple"
						onclick="closeaudio(1)"
					>
						Insert
					</button>
				</p>
			</div>
      <div id="link-div" style="display: none!important;" title="Insert link">
				<p>
					Please enter the details of the link:
					<input
						type="text"
						placeholder="URL"
						id="link-input-1"
					><br>
          <input
						type="text"
						placeholder="Text to display"
						id="link-input-2"
					><br><button
						class="w3-purple w3-btn w3-round-xlarge w3-border w3-border-purple w3-ripple"
						onclick="closelink(0)"
					>
						Cancel
					</button>
					<button
						class="w3-purple w3-btn w3-round-xlarge w3-border w3-border-purple w3-ripple"
						onclick="closelink(1)"
					>
						Insert
					</button>
				</p>
			</div>
		</div>
  </div>
  <div id="settings" style="display: none;">
    <div class="w3-top">
    <div class="w3-bar w3-black">
      <h3 style="" class="w3-bar-item w3-button w3-show-inline-block start"><span class="logo"></span><span></span><span class="head">Chat | RREComms</span></h3>
      <h3 onclick="logout()" class="w3-bar-item w3-button w3-right ab w3-show-inline-block"><span class="logo"></span><span></span><span class="head">Logout</span></h3>
    </div>
  </div>
  <div class="w3-center">
  <br/><br/><br/><br/><br/><br/>
    <h1>Volume:</h1>
    <hr>
  <br />
    <p>Mute all sound: <span>&nbsp;</span><button class="w3-btn w3-border-blue w3-border w3-blue w3-round-large w3-ripple" onclick="switchSettings(0)" id="muteAllSound">Off</button></p>
    <p>Play sound when I post messages: <span>&nbsp;</span><button class="w3-btn w3-border-blue w3-border w3-blue w3-round-large w3-ripple" onclick="switchSettings(1)" id="postSound">On</button></p>
    <p>Play sound when I delete messages: <span>&nbsp;</span><button class="w3-btn w3-border-blue w3-border w3-blue w3-round-large w3-ripple" onclick="switchSettings(2)" id="deleteSound">On</button></p>
    <p>Play sound when the messages change: <span>&nbsp;</span><button class="w3-btn w3-border-blue w3-border w3-blue w3-round-large w3-ripple" onclick="switchSettings(3)" id="newSound">On</button></p>
  <br />
    <h1>Misc:</h1>
    <hr>
    <br>
     <p>Show the delete button no matter what: <span>&nbsp;</span><button class="w3-btn w3-border-blue w3-border w3-blue w3-round-large w3-ripple" id="delNoMatterWhat" onclick="switchSettings(4)">Off</button></p>
    <p>Force preivew before post: <span>&nbsp;</span><button class="w3-btn w3-border-blue w3-border w3-blue w3-round-large w3-ripple" id="forcePreview" onclick="switchSettings(5)">On</button></p>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
  <div class="w3-bottom w3-black">
    <div class="w3-bar">
    <h3 onclick="settings(1)" class="w3-bar-item w3-button w3-show-inline-block messageBtn"><span class="w3-bar-item w3-input w3-bar-item w3-white w3-round-large w3-border w3-border-blue w3-ripple sendLogoBase">Cancel</span></h3>
      <h3 onclick="settings(2)" class="w3-bar-item w3-button w3-show-inline-block messageBtn"><span class="w3-bar-item w3-input w3-bar-item w3-white w3-round-large w3-border w3-border-blue w3-ripple sendLogoBase">Accept</span></h3>
    </div>
  </div>
  </div>
  </div>`;

var defaultHead = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="description" content="A secure and private chat app for you."><link rel="stylesheet" href="./w3.css"><link href="./fonts.css" rel="stylesheet"><link rel="icon" href="https://cdn.glitch.global/aac3c734-7514-4e68-898a-66574e5cc449/logofav1-3.png?v=1731038687620"><link rel="stylesheet" href="./jquery-ui.css"><title>Loading... | RREComms</title>`;
