const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
// const http = require('http').Server(app);
// const socketio = require('socket.io')(http);

const usersRouter = require('./routes/users');
// const roomsRouter = require('./routes/rooms');
// const messagesRouter = require('./routes/messages');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/users', usersRouter);
// app.use('/api/rooms', roomsRouter);
// app.use('/api/messages', messagesRouter);

const serverPort = process.env.PORT || 3108;
const server = app.listen(serverPort, () => {
    console.log(`-------------------------------------------------------`)
    console.log(`  EPSI Backend Server started on port ${serverPort}`)
    console.log(`-------------------------------------------------------`)
});