const Product = require('../models/products');

class productsController {
    static async index (req, res) {
        res.status(200).json({
            data: await new Product().getList(),
            message: "get products is ok",
        })
    }

    static async read (req, res) {
        res.status(200).json({
            data: await new Product().find(req.params.id),
            message: "get products id is ok",
        })
    }

    static async write (req, res) {
        let product = await new Product().create(req.body);
        res.status(200).json({
            data: product,
            message: "post products is ok",
        })
    }

    static async update (req, res) {
        let product = await new Product().store(req.body);
        res.status(200).json({
            data: product,
            message: "put products is ok",
        })
    }

    static async delete (req, res) {
        let product = await new Product().remove(req.body.id);
        console.log(product);
        res.status(200).json({
            message: "del products is ok",
        })
    }
}

module.exports = productsController;
