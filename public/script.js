const express = require('express')
const app = express();
var bodyParser = require('body-parser')
// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
var userdata = [];
app.use('/peerjs', peerServer);
app.use(bodyParser.json());
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('openingpage', { room: uuidV4() });
})

app.post('/clickbutton', (req, res) => {
  console.log(req.body);
  // userdata.push(req.body);
  // res.redirect(`/${uuidV4()}` );
})



io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT||3030, function () {
  console.log(`Server is starting at port 3030`);
})
