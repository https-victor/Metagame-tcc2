const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
  gmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('game', GameSchema);
