const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get('mongoURI');
const io = require('socket.io').listen(process.env.PORT || 4000).sockets
const socket = require('./ws');

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