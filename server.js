const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
path=require('path');

const app = express();
// Connect Database
connectDb();

app.use(cors());
// Init Middleware
app.use(express.json({ extended:false }));


// Define Routes

app.use('/api/users', require('./routes/users'));
app.use('/api/games', require('./routes/games'));
app.use('/api/auth', require('./routes/auth'));

// Serve static assets in production

if(process.env.NODE_ENV === 'production'){
    // Set static folder

    app.use(express.static('client/build'));

    app.get('*',(req,res)=>res.sendFile(path.resolve(___dirname,'client','build','index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));