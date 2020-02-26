const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const Roles = require('../auth/acl').Roles;

const ordersController = require("../controllers/ordersController");
const AttachResourceController = require("../controllers/AttachResourceController");

router.use(function(req, res, next) {
    if (req.user.role === Roles.GUEST) {
        next(createError(401, "Авторизируйтесь"));
    } else {
        AttachResourceController(router, ordersController);
        next();
    }
});


module.exports = router;
