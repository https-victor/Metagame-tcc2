const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    tokenSetup: {
      x:{ type: Number, default: 40},
      y:{ type: Number, default: 40},
      alpha: { type: Number, default: 1},
      scale: {type: Number,default: 1},
      hp: {
        type: Number,
        default: 100
      },
    },
    img: {
      type: String,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    gameId: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'game'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      default: 'character'
    },
    status: {
      type: Boolean,
      default: true
    },
    noteId: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'note',
    },
    authorizedPlayers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
    ],
  });

module.exports = mongoose.model('token', TokenSchema);
