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
  }
});

module.exports = mongoose.model('user', UserSchema);
