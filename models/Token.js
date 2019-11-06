const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hp: {
    type: float,
    default: 100
  },
  tokenSetup: {
    props:{
      x:{ type: float, default: 0},
      y:{ type: float, default: 0}
    },
    scale: {type: int,default: 1},
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
    ref: 'note'
  },
  gameId: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'game'
  },
  authorizedPlayers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
  ],

});

module.exports = mongoose.model('token', TokenSchema);
