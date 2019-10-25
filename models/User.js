const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  registerDate: {
    type: Date,
    default: Date.now
  },
  gender: {
    type: String
  },
  birthdate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    default: true
  },
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'game'
    }
  ],
  role: {
    type: String,
    default: 1
  }
});

module.exports = mongoose.model('user', UserSchema);
