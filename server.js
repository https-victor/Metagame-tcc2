const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
const path=require('path');
const socketIO = require('socket.io');
const socket = require('./config/ws');
const bodyParser = require('body-parser');
const app = express();
// Connect Database
connectDb();
app.use(cors());
// Init Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended:false }));


// Define Routes

app.use('/api/users', require('./routes/users'));
app.use('/api/games', require('./routes/games'));
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/auth', require('./routes/auth'));

// Serve static assets in production
if(process.env.NODE_ENV === 'production'){
    // Set static folder

    app.use(express.static('client/build'));

    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'client/build/index.html')));
}
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));
const io = socketIO(server);
io.on('connection',socket(io));