let getProducts = function (req, res) {
    res.status(200).json({
        message: "get products is ok",
    })
};

let getProductsID = function (req, res) {
    res.status(200).json({
        message: "get products id is ok",
    })
};

let postProducts = function (req, res) {
    res.status(200).json({
        message: "post products is ok",
    })
};

let putProducts = function (req, res) {
    res.status(200).json({
        message: "put products is ok",
    })
};

let delProducts = function (req, res) {
    res.status(200).json({
        message: "del products is ok",
    })
};

module.exports = {getProducts, getProductsID, postProducts, putProducts, delProducts};
