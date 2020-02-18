const Product = require('../models/products');

class productsController {
    static async index (req, res, next) {
        let product = await new Product().getList();
        if (product.status) {
            next(product);
        } else {
            res.status(200).json({
                data: product,
                message: "get products is ok",
                responseCode: 0,
            })
        }
    }

    static async read (req, res, next) {
        let product = await new Product().find(req.params.id);
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
        let product = await new Product().create(req.body);
        if (product.status) {
            next(product);
        } else {
            res.status(200).json({
                data: product,
                message: "post products is ok",
                responseCode: 0,
            })
        }
    }

    static async update (req, res, next) {
        let product = await new Product().store(req.body);
        if (product.status) {
            next(product);
        } else {
            res.status(200).json({
                data: product,
                message: "put products is ok",
                responseCode: 0,
            })
        }
    }

    static async delete (req, res, next) {
        let product = await new Product().remove(req.body.id);
        if (product.status) {
            next(product);
        } else {
            res.status(200).json({
                data: [],
                message: "del products is ok",
                responseCode: 0,
            })
        }
    }
}

module.exports = productsController;
