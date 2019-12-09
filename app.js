const express = require('express')

const app = express()
const port = 3000


app.use(express.json());

// route modules
const ordersRouter = require('./routes/orders');
const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);

 

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
