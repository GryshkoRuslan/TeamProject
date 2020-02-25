const Category = require('../models/categories');

class categoriesController {
    static async index (req, res, next) {
        let category = await new Category().getList();
        if (category.status) {
            next(category);
        } else {
            res.status(200).json({
                data: category,
                message: "get categories is ok",
                responseCode: 0,
            })
        }
    }

    static async read (req, res, next) {
        let category = await new Category().find(req.params.id);
        if (category.status) {
            next(category);
        } else {
            res.status(200).json({
                data: category,
                message: "get categories id is ok",
                responseCode: 0,
            })
        }
    }

    static async write (req, res, next) {
        let category = await new Category().createCategorie(req.body);
        if (category.status) {
            next(category);
        } else {
            res.status(200).json({
                data: category,
                message: "post categories is ok",
                responseCode: 0,
            })
        }
    }

    static async update (req, res, next) {
        let category = await new Category().updateCategory(req.body);
        if (category.status) {
            next(category);
        } else {
            res.status(200).json({
                message: `Данные категории - ${category} обновлены`,
                responseCode: 0,
            })
        }
    }

    static async delete (req, res, next) {
        let category = await new Category().remove(req.body.id);
        if (category.status) {
            next(category);
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
