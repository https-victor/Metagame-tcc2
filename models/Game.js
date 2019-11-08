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
