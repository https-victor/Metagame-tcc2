const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    img: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        default: 'character'
    },
    gameId: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'game'
    },
    tokenId: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'token'
    },
    status: {
        type: Boolean,
        default: true
    },
    authorizedPlayers: [
        {
        _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'},
        name: {
            type: String,
            required: true
        },
    }
    ],
});

module.exports = mongoose.model('note', NoteSchema);
