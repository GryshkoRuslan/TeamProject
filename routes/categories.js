const express = require('express');
const router = express.Router();

const categoriesController = require("../controllers/categoriesController");
const AttachResourceController = require("../controllers/AttachResourceController");

router.use(function(req, res, next) {
    AttachResourceController(router, categoriesController);
    next();
});


module.exports = router;
