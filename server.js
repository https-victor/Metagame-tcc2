const express = require('express');

const app = express();

app.get('/', (req,res)=> res.json({msg: 'Welcome to Metagame!'}))


// Define Routes

app.use('/api/users', require('./routes/users'));
app.use('/api/games', require('./routes/games'));
app.use('/api/auth', require('./routes/auth'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));