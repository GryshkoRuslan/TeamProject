const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const routes = require("./routes/");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

routes(app);

app.get("/", function (req, res) {
    res.status(200).json({
        message: "Ok"
    });
});

app.listen(port);
