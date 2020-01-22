let categoriesController = {
    index (req, res) {
        res.status(200).json({
            message: "get categories is ok",
        })
    },

    read (req, res) {
        res.status(200).json({
            message: "get categories id is ok",
        })
    },

    write (req, res) {
        res.status(200).json({
            message: "post categories is ok",
        })
    },

    update (req, res) {
        res.status(200).json({
            message: "put categories is ok",
        })
    },

    delete (req, res) {
        res.status(200).json({
            message: "del categories is ok",
        })
    }
};

module.exports = categoriesController;
