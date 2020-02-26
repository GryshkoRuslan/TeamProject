const express = require('express');
const router = express.Router();

const categoriesController = require("../controllers/categoriesController");
const AttachResourceController = require("../controllers/AttachResourceController");

router.use(function(req, res, next) {
    AttachResourceController(router, categoriesController);
    router.get("/attributes/:id", categoriesController.readAttributtes);
    next();
});


module.exports = router;
