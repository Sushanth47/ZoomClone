const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  // password:{type:String, required:true},
  name: { type: String, required: true },
  token: { type: String, default: "" },
  callLogs: [{
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    call: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Call'
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat'
    }
  }],

});

const User = mongoose.model('User', userSchema);
module.exports = User;
