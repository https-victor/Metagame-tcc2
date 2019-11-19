const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
  gmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  players: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
  }
  ],
  backgroundImg: { buffer: Buffer, contentType: String },
  img: { buffer: Buffer, contentType: String },
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

GameSchema.index({name:'text',description:'text'});

module.exports = mongoose.model('game', GameSchema);
