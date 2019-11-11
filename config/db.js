const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get('mongoURI');
const socket = require('./ws');

const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server).sockets; 
server.listen(process.env.PORT || 4000);

const connectDB = async () => {
    try{
        await mongoose.connect(mongoURI, { 
        useNewUrlParser:true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify:false
    })
    console.log('MongoDB Connected');

    io.on('connection',socket(io))

    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;