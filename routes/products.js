const express = require('express');
const router = express.Router();

const productsController = require("../controllers/products");
const AttachResourceController = require("../controllers/AttachResourceController");

router.use(function(req, res, next) {
    AttachResourceController(router, productsController);
    next();
});


module.exports = router;
