let ordersController = {
    index (req, res) {
        res.status(200).json({
            message: "get orders is ok",
        })
    },

    read (req, res) {
        res.status(200).json({
            message: "get orders id is ok",
        })
    },

    write (req, res) {
        res.status(200).json({
            message: "post orders is ok",
        })
    },

    update (req, res) {
        res.status(200).json({
            message: "put orders is ok",
        })
    },

    delete (req, res) {
        res.status(200).json({
            message: "del orders is ok",
        })
    }
};

module.exports = ordersController;
