const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{type:String, required:true},
  token:{type:String, default:""},
  callLogs:[{
    
    uid:{
      
  }
    
  
  }]
})
