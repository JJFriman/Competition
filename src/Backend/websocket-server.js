// websocket-server.js is responsible for sending and receiving web socket requests between users

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Websocket Setup

const app = express();
const httpServer = http.createServer(app);
app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

// Variables 

let selectedGroup = null;
let finishedTimes = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    console.log('Received message:', data);
    socket.emit('response', 'Message received');
  });

// Broadcast selectedGroup (selectedGroup is the current round and all the competitors in it)

socket.on('selectedGroup', (selectedGroupData) => {
  console.log('Received selected group:', selectedGroupData);
  selectedGroup = selectedGroupData;
  socket.broadcast.emit('selectedGroupUpdate', selectedGroupData);
  console.log('Selected Group Data:', selectedGroupData);
});

// Send out the teams time for round

socket.on('finishedTime', (finishedTimeData) => {
  console.log('Received finished time:', finishedTimeData);
  const { teamId, era, taskName, finishedTime } = finishedTimeData;
  finishedTimes[teamId] = finishedTimes[teamId] || {};
  finishedTimes[teamId][era] = finishedTimes[teamId][era] || {};
  finishedTimes[teamId][era][taskName] = { finishedTime };
  io.emit('finishedTimeUpdate', finishedTimes);
  console.log('Finished Times:', JSON.stringify(finishedTimes, null, 2));
});

// Send out startTimer request

socket.on('startTimer', () => {
  console.log('Received start timer request');
  const timestamp = Date.now();
  io.emit('timerStart', { timestamp });
  console.log('Start Timer');
});

// Send out stopTimer request

socket.on('stopTimer', () => {
  console.log('Received stop timer request');
  const timestamp = Date.now();
  io.emit('stopTimer', { timestamp });
  console.log('Stop Timer');
});

// Send out teams individual tasks time

socket.on('lapTimer', (lapTimerData) => {
  console.log('Received lap timer:', lapTimerData);
  io.emit('lapTimerUpdate', lapTimerData);
  console.log('Lap Times:', JSON.stringify(lapTimerData, null, 2));
});

// Listen for all the teams to be ready to start the timer

socket.on('teamReady', (readyData) => {
  console.log('Received team ready event:', readyData);
  io.emit('teamReadyUpdate', readyData);
  console.log('Team Ready:', readyData);
});
  
socket.on('disconnect', () => {
  console.log('User disconnected');
  });
});

// API point for selected group

app.get('/api/selectedGroup', (req, res) => {
  res.json(selectedGroup);
});

// End of sockets and listening

httpServer.listen(8000, () => {
  console.log('Server is running on port 8000');
});
