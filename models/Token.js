const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    hp: {
      type: Number,
      default: 100
    },
    tokenSetup: {
      x:{ type: Number, default: 40},
      y:{ type: Number, default: 40},
      alpha: { type: Number, default: 1},
      scale: {type: Number,default: 1},
      
    },
    img: { buffer: Buffer, contentType: String },
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
    authorizedPlayers: [{
      _id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'},
      name: String
    }
    ],
  });

module.exports = mongoose.model('token', TokenSchema);
