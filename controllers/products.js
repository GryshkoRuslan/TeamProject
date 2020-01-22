let productsController = {
    index (req, res) {
        res.status(200).json({
            message: "get products is ok",
        })
    },

    read (req, res) {
        res.status(200).json({
            message: "get products id is ok",
        })
    },

    write (req, res) {
        res.status(200).json({
            message: "post products is ok",
        })
    },

    update (req, res) {
        res.status(200).json({
            message: "put products is ok",
        })
    },

    delete (req, res) {
        res.status(200).json({
            message: "del products is ok",
        })
    }
};

module.exports = productsController;
