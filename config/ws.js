
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

        client.on('dice_roll', function({gameId,token, newNumber}){
            GameSession.onDiceRoll(io, gameId,token, newNumber);
        })

        client.on('send_msg', function({gameId, token, msg}){
            GameSession.onNewMsg(io, gameId, token,
                msg);
        })
        console.log('Socket connected');
    }
}