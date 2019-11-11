
const GameSession = require('../controls/GameSession.js');

module.exports = function (io) {    

    return function (client) {
        client.on('connect_session', function(gameId){
            GameSession.onNewClient(io,client, gameId);
        })

        client.on('update_token', function( {gameId, tokenId, data}){
            GameSession.onUpdateTokenSetup(io, gameId, tokenId, data);
        })

        client.on('create_token', function({gameId, name, description}){
            GameSession.onCreateToken(io, gameId, name, description);
        })

        client.on('dice_roll', function({gameId, newNumber}){
            GameSession.onDiceRoll(io, gameId, newNumber);
        })
        console.log('Socket connected');
    }
}