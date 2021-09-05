require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose');
var morgan = require('morgan');
// Import other required libraries
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { User } = require('./models/userModel');
app.use(cors());
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
app.use(morgan('dev'));
// const { v4: uuidV4 } = require('uuid')
const password = 'testtest'

// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://testtest:"+password+"@cluster0.ndxg6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect("mongodb://localhost/myapp", { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {
  server.listen(process.env.PORT, '0.0.0.0',function () {
    console.log(`Server is starting at port 3030`);
  })
})
  .catch((err) => {
    console.log(err);
})
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('connected to db')
//   client.close();
// });



app.use('/peerjs', peerServer);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));
app.set('view engine', 'ejs');
app.use(express.static('public'))
// var room = uuidV4();
app.get('/', async (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth();
  let year = date_ob.getFullYear();
  let final = date + '-' + month + '-' + year
  
 return res.render('openingpage', {  date: final});
})
// app.get('/', async (req, res) => {
//   return res.redirect(`/${room}`);
// })

// async function generateAuthToken(obj) {
//   const token = jwt.sign()
// }
app.post('/:room', async (req, res) => {
  var user = await User.findOne({ phone: req.body.phone });
  if (!user) {
    user = await User.create({
      name: req.body.name,
      phone: req.body.phone
    }); 
  }
  var call;
  if (req.body.roomId) {
    call = await Call.findOne({ _id: req.body.roomId });
  } else {
    call = await Call.create({
      startedBy: ObjectId(user._id),
      startedOn: Date.now()
    });
  }
  return res.status(200).render('room', { user: user, call: call });
})
app.get('/:room', async (req, res, next) => {
  // var obj = {
  //   table: {} 
  // }
  // obj.table = req.body.name
 
  
  // var json = JSON.stringify(obj);
  // fs.writeFile('./userdata.json', json, function (err) {
  //   if (err) {
  //     throw err;
  //   }
  // });
  // next();
  return res.render('room', );

  // fs.readFile('./userdata.json', 'utf8',function (err, jsonstring) {
  //   if (err) throw err;
  //   else {
  //     try {
  //       const customer = JSON.parse(jsonstring);
  //       // console.log(customer, 'serverfiel');
  //     }
  //     catch (error){
  //       console.log(error);
  //     }
      
  //   }
  // });
 
});

app.post('/taketoroom', async(req, res)=>{
  // console.log(req.body);
  return res.render('room', {roomId:req.body.roomId, jsonstring:req.body.name});
})
// const gTTS = require('gtts');
// app.get('/hear/:text', function (req, res) {
//   var gtts = new gTTS(req.params.text, 'en');
// gtts.save(`/home/thinclients/user5/Desktop/newStructure/ZoomClone-master/${req.params.text}.mp3`, function (err, result) {
//   if(err) { throw new Error(err) }
//   console.log('Success! Open file /tmp/hello.mp3 to hear result.');
// });
// });


// app.get('/hear/listenresponse/:type', async (req, res) => {
//   player.play('./partner.mp3', function(err){
//     if (err) throw err
//   })
//   return res.status(200).send('ok')
// })



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






// Creates a client
