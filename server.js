require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose')
var fs = require('fs');
var bodyParser = require('body-parser')
const cors = require('cors');
// const moment = require('moment');
app.use(cors());
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

const { v4: uuidV4 } = require('uuid')

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(()=>console.log('DB connection successful'))


app.use('/peerjs', peerServer);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', async (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth();
  let year = date_ob.getFullYear();
  let final = date+'-'+month+'-'+year
 return res.render('openingpage', { room: uuidV4(), date: final});
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

server.listen(process.env.PORT, function () {
  console.log(`Server is starting at port 3030`);
})
