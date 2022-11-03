//============FILE FOR TESTING======================================================================================================================== =================================================================================================================   ============================================================
const socket = io('/')
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});
// DOM Elements
const openJoinRoomBox = document.getElementById("open-join-room-box");
const createRoomBox = document.getElementById("create-room-box");
const roomIdInput = document.getElementById("room-id");
const cancelCreateActionBtn = document.getElementById("cancel-create-action");
const gameplayChoices = document.getElementById("gameplay-choices");
const createRoomBtn = document.getElementById("create-room-btn");
const gameplayScreen = document.querySelector(".gameplay-screen");
const startScreen = document.querySelector(".start-screen");
const cancelJoinActionBtn = document.getElementById("cancel-join-action");
const joinBoxRoom = document.getElementById("join-room-box");
const joinRoomBtn = document.getElementById("join-room-btn");
const joinRoomInput = document.getElementById("join-room-input");
const joinRandomBtn = document.getElementById("join-random");
const errorMessage = document.getElementById("error-message");
const playerOne = document.getElementById("player-1");
const playerTwo = document.getElementById("player-2");
const waitMessage = document.getElementById("wait-message");
const split = document.getElementById("split");
const steal = document.getElementById("steal");
const myScore = document.getElementById("my-score");
const enemyScore = document.getElementById("enemy-score");
const playerOneTag = document.getElementById("player-1-tag");
const playerTwoTag = document.getElementById("player-2-tag");
const winMessage = document.getElementById("win-message");
const GeneratedPot = document.getElementById("pot");

//  Game variables
let canChoose = false;
let playerOneConnected = false;
let playerTwoIsConnected = false;
let playerId = 0;
let myChoice = "";
let enemyChoice = "";
let roomId = "";
let myScorePoints = 0;
let enemyScorePoints = 0;



split.addEventListener("click", function () {
  if (
    canChoose &&
    myChoice === "" &&
    playerOneConnected &&
    playerTwoIsConnected
  ) {
    myChoice = "split";
    choose(myChoice);
    socket.emit("make-move", { playerId, myChoice, roomId });
  }
});

steal.addEventListener("click", function () {
  if (
    canChoose &&
    myChoice === "" &&
    playerOneConnected &&
    playerTwoIsConnected
  ) {
    myChoice = "steal";
    choose(myChoice);
    socket.emit("make-move", { playerId, myChoice, roomId });
  }
});
// Socket
socket.on("room-created", (id) => {
  playerId = 1;
  roomId = id;

  setPlayerTag(1);
});

socket.on("room-joined", (id) => {
  playerId = 2;
  roomId = id;

  playerOneConnected = true;
  playerJoinTheGame(1);
  setPlayerTag(2);
  setWaitMessage(false);
  socket.emit("generatepot");
});

socket.on("player-1-connected", () => {
  playerJoinTheGame(1);
  playerOneConnected = true;
});

socket.on("player-2-connected", () => {
  playerJoinTheGame(2);
  playerTwoIsConnected = true;
  canChoose = true;
  setWaitMessage(false);
});

socket.on("player-1-disconnected", () => {
  window.location.assign("/");
});

socket.on("player-2-disconnected", () => {
  window.location.assign("/");
});


socket.on('pot', (Pot) => {
  GeneratedPot.innerHTML = Pot;
  
});


socket.on('full-room', () => {
  socket.emit('lock-room');
  
});
socket.on("bothsteal", (message) => {
  setWinningMessage(message);
  myScorePoints = 0;
  enemyScorePoints = 0;
  displayScore();
});

socket.on("bothsplit", (message) => {
  setWinningMessage(message);
  myScorePoints++;
  enemyScorePoints++;
  displayScore();
});

socket.on("player-1-wins", ({ myChoice, enemyChoice }) => {
  if (playerId === 1) {
    let message = "You Stole!";
    setWinningMessage(message);
    myScorePoints++;
  } else {
    let message = "He stole from you!";
    setWinningMessage(message);
    enemyScorePoints++;
  }

  displayScore();
});

socket.on("player-2-wins", ({ myChoice, enemyChoice }) => {
  if (playerId === 2) {
    let message = "You Stole!";
    setWinningMessage(message);
    myScorePoints++;
  } else {
    let message = "You choose split and the enemy choose steal So you lose!";
    setWinningMessage(message);
    enemyScorePoints++;
  }

  displayScore();
});

// Functions
function setPlayerTag(playerId) {
  if (playerId === 1) {
    playerOneTag.innerText = "You (Player 1)";
    playerTwoTag.innerText = "Enemy (Player 2)";
  } else {
    playerOneTag.innerText = "Enemy (Player 2)";
    playerTwoTag.innerText = "You (Player 1)";
  }
}

function playerJoinTheGame(playerId) {
  if (playerId === 1) {
    playerOne.classList.add("connected");
  } else {
    playerTwo.classList.add("connected");
  }
}

function setWaitMessage(display) {
  if (display) {
    let p = document.createElement("p");
    p.innerText = "Waiting for another player to join...";
    waitMessage.appendChild(p);
  } else {
    waitMessage.innerHTML = "";
  }
}


function reset() {
  canChoose = false;
  playerOneConnected = false;
  playerTwoIsConnected = false;
  startScreen.style.display = "block";
  gameplayChoices.style.display = "block";
  gameplayScreen.style.display = "none";
  joinBoxRoom.style.display = "none";
  createRoomBox.style.display = "none";
  playerTwo.classList.remove("connected");
  playerOne.classList.remove("connected");
  myScorePoints = 0;
  enemyScorePoints = 0;
  displayScore();
  setWaitMessage(true);
}

function playerTwoLeftTheGame() {
  playerTwoIsConnected = false;
  playerTwo.classList.remove("connected");
}

function displayScore() {
  myScore.innerText = myScorePoints;
  enemyScore.innerText = enemyScorePoints;
}

function choose(choice) {
  if (choice === "split") {
    split.classList.add("my-choice");
  } else if (choice === "steal") {
    steal.classList.add("my-choice");
  }
  canChoose = false;
}

function removeChoice(choice) {
  if (choice === "split") {
    split.classList.remove("my-choice");
  } else if (choice === "steal") {
    steal.classList.remove("my-choice");
  }

  canChoose = true;
  myChoice = "";
}

function setWinningMessage(message) {
  let p = document.createElement("p");
  p.innerText = message;

  winMessage.appendChild(p);

  setTimeout(() => {
    removeChoice(myChoice);
    winMessage.innerHTML = "";
  }, 2500);
}
//================================================================================================================================
//Videochat
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
      socket.emit("join-room", roomId);
    });
  });

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on("open", (id) => {
  socket.emit("create-room", ROOM_ID, id);
});


function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
