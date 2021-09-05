const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    startedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    startedOn: { type: Date },
    
})