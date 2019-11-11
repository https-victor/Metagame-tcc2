const mongoose = require('mongoose');
const Game = require('../models/Game');
const Token = require('../models/Token');

/**
 * Função executada ao entrar um novo cliente na sala
 * @param {*} client Socket do client
 * @param {*} gameId Id da sessão de jogo
 */
exports.onNewClient = async function(io, client, gameId) {
  client.join(gameId);
  const gameData = await Game.findById(gameId);
  io.to(gameId).emit('refresh_game', gameData);
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
  const newList = await Token.find({ gameId: gameId });
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
    gameId: gameId
  });
  await token.save();
  const newList = await Token.find({ gameId: gameId });
  await Game.findByIdAndUpdate(gameId, { tokens: newList });
  io.to(gameId).emit('token_update', newList);
};

/**
 * Função executada ao modificar o setup do token
 * @param {*} client Socket do client
 * @param {*} gameId Id da sessão de jogo
 */
exports.onDiceRoll = async function(io, gameId, newNumber
    ) {
  io.to(gameId).emit('dice_roll', newNumber
  );
};
