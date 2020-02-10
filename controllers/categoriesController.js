const Category = require('../models/categories');

class categoriesController {
    static async index (req, res) {
        let category = await new Category().getList();
        if (category.responseCode===1) {
            let status = category.status;
            delete category.status;
            res.status(status).json(category)
        } else {
            res.status(200).json({
                data: category,
                message: "get categories is ok",
                responseCode: 0,
            })
        }
    }

    static async read (req, res) {
        let category = await new Category().find(req.params.id);
        if (category.responseCode===1) {
            let status = category.status;
            delete category.status;
            res.status(status).json(category)
        } else {
            res.status(200).json({
                data: category,
                message: "get categories id is ok",
                responseCode: 0,
            })
        }
    }

    static async write (req, res) {
        let category = await new Category().create(req.body);
        if (category.responseCode===1) {
            let status = category.status;
            delete category.status;
            res.status(status).json(category)
        } else {
            res.status(200).json({
                data: category,
                message: "post categories is ok",
                responseCode: 0,
            })
        }
    }

    static async update (req, res) {
        let category = await new Category().store(req.body);
        if (category.responseCode===1) {
            let status = category.status;
            delete category.status;
            res.status(status).json(category)
        } else {
            res.status(200).json({
                data: category,
                message: "put categories is ok",
                responseCode: 0,
            })
        }
    }

    static async delete (req, res) {
        let category = await new Category().remove(req.body.id);
        console.log(category);
        if (category.responseCode===1) {
            let status = category.status;
            delete category.status;
            res.status(status).json(category)
        } else {
            res.status(200).json({
                data: [],
                message: "del categories is ok",
                responseCode: 0,
            })
        }
    }
}

module.exports = categoriesController;
