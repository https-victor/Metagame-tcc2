const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
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
  tokenId: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'token'
  },
  status: {
    type: Boolean,
    default: true
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
