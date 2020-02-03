const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const routes = require("./routes/");
const serviceLocator = require('./services/service.locator');


serviceLocator.register('db', require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'postgres',
        database : 'mindk_eshop'
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

routes(app);

app.get("/", function (req, res) {
    res.status(200).json({
        message: "Ok"
    });
});

app.listen(port);
