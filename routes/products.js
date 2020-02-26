const express = require('express');
const router = express.Router();

const productsController = require("../controllers/productsController");
const AttachResourceController = require("../controllers/AttachResourceController");

router.use(function(req, res, next) {
    AttachResourceController(router, productsController);
/*    router.get("/", productsController.getWithFilters);*/
    next();
});


module.exports = router;
