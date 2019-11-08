const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
  gmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  players: [
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
  notes: [
    {
      _id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'note'},
      name: {
        type: String,
        required: true
      },
    }
  ],
  tokens: [
    {
      _id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'token'},
      name: {
        type: String,
        required: true
      },
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
  },
});

module.exports = mongoose.model('game', GameSchema);
