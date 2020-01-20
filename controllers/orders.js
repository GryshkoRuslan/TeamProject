let getOrders = function (req, res) {
    res.status(200).json({
        message: "get orders is ok",
    })
};

let getOrdersID = function (req, res) {
    res.status(200).json({
        message: "get orders id is ok",
    })
};

let postOrders = function (req, res) {
    res.status(200).json({
        message: "post orders is ok",
    })
};

let putOrders = function (req, res) {
    res.status(200).json({
        message: "put orders is ok",
    })
};

let delOrders = function (req, res) {
    res.status(200).json({
        message: "del orders is ok",
    })
};

module.exports = {getOrders, getOrdersID, postOrders, putOrders, delOrders};
