const Product = require('../models/products');
const Roles = require('../auth/acl').Roles;
const createError = require('http-errors');

class productsController {
    static async index (req, res, next) {
        let result;
        if (Object.keys(req.query).length==0 || Object.keys(req.query).length==1 && req.query.hasOwnProperty("page")) {
            result = await new Product().getProductList(req.query.page);
        } else {
            result = await new Product().getProductsWithFilters(req.query);
        }
        if (result.status) {
            next(result);
        } else {
            res.status(200).json({
                data: result.products,
                count: result.count,
                filtersData: result.filtersData,
                message: "get products is ok",
                responseCode: 0,
            })
        }
    }

    static async read (req, res, next) {
        let product = await new Product().getProductWithCategories(req.params.id);
        if (product.status) {
            next(product);
        } else {
            res.status(200).json({
                data: product,
                message: "get products id is ok",
                responseCode: 0,
            })
        }
    }

    static async write (req, res, next) {
        if (req.user.role  !== Roles.ADMIN) {
            next(createError(403, "Не хватает прав"));
        } else {
            let product = await new Product().createProduct(req.body);
            if (product.status) {
                next(product);
            } else {
                res.status(200).json({
                    message: `${product} - добавлен`,
                    responseCode: 0,
                })
            }
        }
    }

    static async update (req, res, next) {
        if (req.user.role  !== Roles.ADMIN) {
            next(createError(403, "Не хватает прав"));
        } else {
            let product = await new Product().updateProduct(req.body);
            if (product.status) {
                next(product);
            } else {
                res.status(200).json({
                    message: `Данные ${product} изменены`,
                    responseCode: 0,
                })
            }
        }
    }

    static async delete (req, res, next) {
        if (req.user.role  !== Roles.ADMIN) {
            next(createError(403, "Не хватает прав"));
        } else {
            let product = await new Product().deleteProduct(req.body.id);
            if (product.status) {
                next(product);
            } else {
                res.status(200).json({
                    message: "Товар успешно удален",
                    responseCode: 0,
                })
            }
        }
    }
}

module.exports = productsController;
