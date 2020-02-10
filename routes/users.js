const express = require('express');
const router = express.Router();

const usersController = require("../controllers/usersController");
const AttachResourceController = require("../controllers/AttachResourceController");

router.use(function(req, res, next) {
    AttachResourceController(router, usersController);
    next();
});


module.exports = router;
