let getCategories = function (req, res) {
    res.status(200).json({
        message: "get categories is ok",
    })
};

let getCategoriesID = function (req, res) {
    res.status(200).json({
        message: "get categories id is ok",
    })
};

let postCategories = function (req, res) {
    res.status(200).json({
        message: "post categories is ok",
    })
};

let putCategories = function (req, res) {
    res.status(200).json({
        message: "put categories is ok",
    })
};

let delCategories = function (req, res) {
    res.status(200).json({
        message: "del categories is ok",
    })
};

module.exports = {getCategories, getCategoriesID, postCategories, putCategories, delCategories};
