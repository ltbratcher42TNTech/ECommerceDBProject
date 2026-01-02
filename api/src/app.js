const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Temporary test route
app.get('/', (req, res) => {
  res.send('Ecommerce API is running');
});

const usersRoutes = require('./routes/users.routes');
app.use('/api/users', usersRoutes);


module.exports = app;
