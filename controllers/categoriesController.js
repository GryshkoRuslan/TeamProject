const Category = require('../models/categories');
const Errors = require('../models/Errors');
const Roles = require('../auth/acl').Roles;
const createError = require('http-errors');

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
        if(category==undefined) {
            next(Errors('404'))
        } else if (category.status) {
            next(category);
        } else {
            res.status(200).json({
                data: category,
                message: "get category id is ok",
                responseCode: 0,
            })
        }
    }

    static async readAttributtes (req, res, next) {
        if (req.user.role  == Roles.ADMIN) {
            let category = await new Category().getAttributesByCategory(req.params.id);
            if (category == undefined) {
                next(Errors('404'))
            } else if (category.status) {
                next(category);
            } else {
                res.status(200).json({
                    data: category,
                    message: "Атрибуты для данной категории получены успешно",
                    responseCode: 0,
                })
            }
        } else {
            next(createError(403, "Не хватает прав"));
        }
    }

    static async write (req, res, next) {
        if (req.user.role  == Roles.ADMIN) {
            let category = await new Category().createCategory(req.body);
            if (category.status) {
                next(category);
            } else {
                res.status(200).json({
                    data: category,
                    message: `Новая категория успешно создана`,
                    responseCode: 0,
                })
            }
        } else {
            next(createError(403, "Не хватает прав"));
        }
    }

    static async update (req, res, next) {
        if (req.user.role  == Roles.ADMIN) {
            let category = await new Category().updateCategory(req.body);
            if (category.status) {
                next(category);
            } else {
                res.status(200).json({
                    message: `Данные категории - ${category} обновлены`,
                    responseCode: 0,
                })
            }
        } else {
            next(createError(403, "Не хватает прав"));
        }
    }

    static async delete (req, res, next) {
        if (req.user.role  == Roles.ADMIN) {
            let category = await new Category().deleteCategory(req.body.id);
            if (category.status) {
                next(category);
            } else {
                res.status(200).json({
                    message: "Категория успешно удалена",
                    responseCode: 0,
                })
            }
        } else {
            next(createError(403, "Не хватает прав"));
        }
    }
}

module.exports = categoriesController;
