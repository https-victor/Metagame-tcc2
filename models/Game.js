const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('game', GameSchema);
