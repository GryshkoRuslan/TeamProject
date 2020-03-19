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

const allowCrossDomain = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'PROPFIND, PROPPATCH, COPY, MOVE, DELETE, MKCOL, LOCK, UNLOCK, PUT, GETLIB, VERSION-CONTROL, CHECKIN, CHECKOUT, UNCHECKOUT, REPORT, UPDATE, CANCELUPLOAD, HEAD, OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
};
app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(authMiddleware);

routes(app);

app.use(function(err,req,res,next) {
   res.status(err.status);
   res.json({
       message: err.message,
       responseCode: 1,
   })
});

app.get("/", function (req, res) {
    res.status(200).json({
        message: "Ok"
    });
});

app.listen(config.server.port);
