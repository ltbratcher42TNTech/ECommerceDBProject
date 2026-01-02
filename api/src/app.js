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
const categoriesRouter = require('./routes/categories.routes');
const productsRouter = require('./routes/products.routes');


app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);


module.exports = app;
