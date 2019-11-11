const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    log: [
        {
        _id:{
            type: mongoose.Schema.Types.ObjectId
        },
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        msg: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
    ],
    gameId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'game'
    },
});

module.exports = mongoose.model('chat', ChatSchema);
