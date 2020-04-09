const express = require('express');
const router = express.Router();

const ordersController = require("../controllers/ordersController");
const AttachResourceController = require("../controllers/AttachResourceController");

router.use(function(req, res, next) {
        AttachResourceController(router, ordersController);
        next();
});


module.exports = router;
