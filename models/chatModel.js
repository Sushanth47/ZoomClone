const mongoose = require('mongoose');

const chatScehma = new mongoose.Schema({
    chats: [{
        chat: [{
            one: { type: String },
            two: { type: String }
        }],
        callId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Call'
        }
    }]
}, {
    timestamps: true
});

const Chat = mongoose.model('Chat', chatScehma);
module.exports = Chat;
