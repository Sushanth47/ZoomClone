require('dotenv').config
const express = require('express')
const app = express();
var fs = require('fs');
var bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors());
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', async(req, res) => {
 return res.render('openingpage', { room: uuidV4() });
})

app.post('/room', async (req, res) => {
  var obj = {
    table: {} 
  }
  obj.table= req.body.name
  // obj.table.save()
  console.log(obj.table, 'obj.table')
  var json = JSON.stringify(obj)
  fs.writeFile('./userdata.json', json, function (err) {
    if (err) {
      throw err;
    }
  });
  fs.readFile('./userdata.json', 'utf8',function (err, jsonstring) {
    if (err) throw err;
    else {
      try {
        const customer = JSON.parse(jsonstring);
        // console.log(customer, 'serverfiel');
      return res.render('room', { roomId: req.params.room, jsonstring:customer});
      }
      catch (error){
        console.log(error);
      }
      
    }
  });
 
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

server.listen(3030, function () {
  console.log(`Server is starting at port 3030`);
})
