require('dotenv').config()
import express from "express"
import configViewEngine from "./configs/viewEngine"
import initWebRoutes from "./routes/web"
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser'
import session from "express-session"
import connectFlash from "connect-flash"
import passport from "passport"

let app = express()
let http = require('http')
let server = http.createServer(app)

//cookie parser
app.use(cookieParser('secret'))

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}))

// Enable body parser post data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Config view engine
configViewEngine(app)

//Enable flash message
app.use(connectFlash())

//Config passport middleware
app.use(passport.initialize())
app.use(passport.session())

// init all web routes
initWebRoutes(app)

// Modules


//Libraries

const path = require("path");
const socketio = require("socket.io");



app.use(express.static(path.join(__dirname, "public")));
//for ejs to work
app.set("view engine", "ejs");

const io = socketio(server);
//Functions
const {
  userConnected,
  connectedUsers,
  initializeChoices,
  moves,
  makeMove,
  choices,
  GeneratePot,
} = require("./util/users");
const { createRoom, joinRoom, exitRoom, } = require("./util/rooms");
const { exitCode } = require("process");
const { v4: uuidV4 } = require("uuid");
const { count } = require("console");

//When User Connects to Socket
io.on("connection", (socket) => {
    socket.on("create-room", (roomId, userId) => {
      rooms.push(roomId);
      console.log(rooms);
      socket.join(roomId);
      socket.to(roomId).broadcast.emit("user-connected", userId);
      userConnected(socket.client.id);
      socket.emit("room-created", roomId);
      socket.emit("player-1-connected");
  
      socket.on("join-room", (roomId) => {
        usercount = io._nsps.get("/").adapter.rooms.get(`${roomId}`).size;
        if (usercount === 2) {
          userConnected(socket.client.id);
          socket.join(roomId);
          socket.emit('full-room');
          socket.emit("room-joined", roomId);
          socket.emit("player-2-connected");
          socket.broadcast.to(roomId).emit("player-2-connected");
          initializeChoices(roomId);
        } 
      });
      socket.on("generatepot", () => {
        Pot = (Math.floor(Math.random() * 1000000) + 100);
        splittedPot = (Pot / 2);
        io.to(roomId).emit("pot", Pot, splittedPot);
      });
  
      socket.on("lock-room", () => {
        index = rooms.indexOf(roomId);
        if (index > -1) {
          rooms.splice(index, 2);
        }
        console.log("room deleted from array");
        console.log(rooms);
      });
      
  
      socket.on("disconnect", () => {
        socket.to(roomId).broadcast.emit("user-disconnected", userId);
        index = rooms.indexOf(roomId);
        if (index > -1) {
          rooms.splice(index, 1);
          console.log(rooms);
        }
      });
    });
    socket.on("make-move",({ playerId, myChoice, roomId,}) => {
  
      //disconnect users from room after game
      function Disconnect(){
        io.to(roomId).emit("player-1-disconnected");
        io.to(roomId).emit("player-2-disconnected");
      
      }
      const DisconnectTimer = setTimeout(Disconnect, 10000);
      
      makeMove(roomId, playerId, myChoice);
  
  
      if (choices[roomId][0] !== "" && choices[roomId][1] !== "") {
        let playerOneChoice = choices[roomId][0];
        let playerTwoChoice = choices[roomId][1];
  
        if (playerOneChoice === "steal" && playerTwoChoice === "steal") {
          let BothSteal = `Both chose to Steal so you get $0!`;
          io.to(roomId).emit("bothsteal", BothSteal);
          DisconnectTimer 
          
          //Both get Nothing 
          //SQL not needed 
        } else if (playerOneChoice === "split" && playerTwoChoice === "split") {
          let BothSplit = `Both chose to Split so you get $${splittedPot}!`;
          io.to(roomId).emit("bothsplit", BothSplit);
          DisconnectTimer
          
          //Split Pot 50/50 between playerone and playertwo
          //SQL INSERT ? INTO cash WHERE userid = ?,userid,splittedPot
        } else if (moves[playerOneChoice] === playerTwoChoice) {
          let enemyChoice = "";
  
          if (
            playerId === 1 &&
            playerOneChoice === "steal" &&
            playerTwoChoice === "split"
          ) {
            enemyChoice = playerTwoChoice;
          } else {
            enemyChoice = playerOneChoice;
          }
  
          io.to(roomId).emit("player-2-wins", { myChoice, enemyChoice});
          //SQL INSERT ? INTO cash WHERE userid = ?,userid,Pot
          DisconnectTimer
        } else {
          let enemyChoice = "";
  
          if (
            playerId === 1 &&
            playerOneChoice === "split" &&
            playerTwoChoice === "steal"
          ) {
            enemyChoice = playerTwoChoice;
          } else {
            enemyChoice = playerOneChoice;
          }
  
          io.to(roomId).emit("player-1-wins", { myChoice, enemyChoice,Pot });
          //SQL INSERT ? INTO cash WHERE userid = ?,userid,Pot
          DisconnectTimer
        }
  
        choices[roomId] = ["", ""];
      }
    });
  });

let port = process.env.PORT || 8080
server.listen(port, () => console.log(`Running on port ${port}...`))
