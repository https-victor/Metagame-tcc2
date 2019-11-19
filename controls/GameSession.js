const mongoose = require('mongoose');
const Game = require('../models/Game');
const User = require('../models/User');
const Token = require('../models/Token');
const Chat = require('../models/Chat');
const jwt = require('jsonwebtoken');
const config = require('config');
var ObjectId = mongoose.Types.ObjectId;

/**
 * Função executada ao entrar um novo cliente na sala
 * @param {*} client Socket do client
 * @param {*} gameId Id da sessão de jogo
 */
exports.onNewClient = async function(io, client, gameId, token) {
  client.join(gameId);
  const { user } = jwt.verify(token, config.get('jwtSecret'));
  const oldChat = await Chat.findOne({ gameId: gameId });
  const userName = await User.findById(user.id, 'name');
  const chatLog = await Chat.findOneAndUpdate(
    { gameId },
    {
      $set: {
        log: [
          {
            _id: ObjectId(),
            sender: { _id: user.id, name: userName.name },
            msg: `${userName.name} entrou no jogo!`,
            date: Date.now()
          },
          ...oldChat.log
        ]
      }
    },
    { new: true }
  );
  // const gameData = await Game.findById(gameId);
  io.to(gameId).emit('receive_msg', chatLog);
  // console.log(gameData)
  // client.emit('refresh_game', gameData);
};

/**
 * Função executada ao modificar o setup do token
 * @param {*} client Socket do client
 * @param {*} gameId Id da sessão de jogo
 */
exports.onUpdateTokenSetup = async function(io, gameId, tokenId, data) {
  
  await Token.findByIdAndUpdate(
    tokenId,
    { $set: { tokenSetup: data } },
    { new: true }
  );
  const newList = await Token.find({ gameId: gameId, status: true });
  io.to(gameId).emit('token_update', newList);
};

/**
 * Função executada ao modificar o setup do token
 * @param {*} client Socket do client
 * @param {*} gameId Id da sessão de jogo
 */
exports.onCreateToken = async function(io, gameId, name, description) {
  token = new Token({
    name: name,
    description: description,
    gameId: gameId,
  });
  await token.save();
  const newList = await Token.find({ gameId: gameId, status: true });
  await Game.findByIdAndUpdate(gameId, { tokens: newList });
  io.to(gameId).emit('token_update', newList);
};

/**
 * Função executada ao modificar o setup do token
 * @param {*} client Socket do client
 * @param {*} gameId Id da sessão de jogo
 */
exports.onUpdateToken = async function(io, gameId, tokenId, token, fields) {
  if(fields!=='no-payload'){
    const { user } = jwt.verify(token, config.get('jwtSecret'));
    const userName = await User.findById(user.id, 'name');
    const tokenFields = {
      name: fields.name,
      description: fields.description ? fields.description : undefined,
      type: fields.type ? fields.type : undefined,
      authorizedPlayers: [{ _id: user.id, name: userName.name }],
      updatedAt: Date.now()
    };
    await Token.findByIdAndUpdate(tokenId, { $set: tokenFields }, { new: true });
  }
  const newList = await Token.find({ gameId: gameId, status: true });
  io.to(gameId).emit('token_update', newList);
};

/**
 * Função executada ao modificar o setup do token
 * @param {*} client Socket do client
 * @param {*} gameId Id da sessão de jogo
 */
exports.onDeleteToken = async function(io, gameId, tokenId) {
  await Token.findByIdAndUpdate(
    tokenId,
    { $set: { status: false } },
    { new: true }
  );
  const newList = await Token.find({ gameId: gameId, status: true });
  io.to(gameId).emit('token_update', newList);
};

/**
 * Função executada ao modificar o setup do token
 * @param {*} client Socket do client
 * @param {*} gameId Id da sessão de jogo
 */
exports.onDiceRoll = async function(io, gameId, token, newNumber) {
  const { user } = jwt.verify(token, config.get('jwtSecret'));
  const oldChat = await Chat.findOne({ gameId: gameId });
  const userName = await User.findById(user.id, 'name');
  const chatLog = await Chat.findOneAndUpdate(
    { gameId },
    {
      $set: {
        log: [
          {
            _id: ObjectId(),
            sender: { _id: user.id, name: userName.name },
            msg: `${userName.name} rolou o dado e tirou ${newNumber}!`,
            date: Date.now()
          },
          ...oldChat.log
        ]
      }
    },
    { new: true }
  );
  io.to(gameId).emit('receive_msg', chatLog);
  io.to(gameId).emit('dice_roll', newNumber);
};

/**
 * Função executada ao modificar o setup do token
 * @param {*} client Socket do client
 * @param {*} gameId Id da sessão de jogo
 */
exports.onNewMsg = async function(io, gameId, token, msg) {
  const { user } = jwt.verify(token, config.get('jwtSecret'));
  const oldChat = await Chat.findOne({ gameId: gameId });
  const userName = await User.findById(user.id, 'name');
  const chatLog = await Chat.findOneAndUpdate(
    { gameId },
    {
      $set: {
        log: [
          {
            _id: ObjectId(),
            sender: { _id: user.id, name: userName.name },
            msg,
            date: Date.now()
          },
          ...oldChat.log
        ]
      }
    },
    { new: true }
  );
  io.to(gameId).emit('receive_msg', chatLog);
};
