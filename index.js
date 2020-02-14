const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require("./routes/");
const serviceLocator = require('./services/service.locator');
const config = require('./config');
const authMiddleware = require('./auth/authMiddleware');

serviceLocator.register('db', require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
        host : config.database.host,
        user : config.database.user,
        password : config.database.password,
        database : config.database.database
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(authMiddleware);
routes(app);

app.get("/", function (req, res) {
    res.status(200).json({
        message: "Ok"
    });
});

app.listen(config.server.port);
