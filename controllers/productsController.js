const Product = require('../models/products');

class productsController {
    static async index (req, res, next) {
        let result = await new Product().getProductList();
        if (result.status) {
            next(result);
        } else {
            res.status(200).json({
                data: result.products,
                count: result.count,
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
        let product = await new Product().saveProduct(req.body);
        if (product.status) {
            next(product);
        } else {
            res.status(200).json({
                message: `${product} - добавлен`,
                responseCode: 0,
            })
        }
    }

    static async update (req, res, next) {
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

    static async delete (req, res, next) {
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

module.exports = productsController;
