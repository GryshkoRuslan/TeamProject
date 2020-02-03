const Order = require('../models/orders');

class ordersController {
    static async index (req, res) {
        res.status(200).json({
            data: await new Order().getList(),
            message: "get orders is ok",
        })
    }

    static async read (req, res) {
        res.status(200).json({
            data: await new Order().find(req.params.id),
            message: "get orders id is ok",
        })
    }

    static async write (req, res) {
        let order = await new Order().create(req.body);
        res.status(200).json({
            data: order,
            message: "post orders is ok",
        })
    }

    static async update (req, res) {
        let order = await new Order().store(req.body);
        res.status(200).json({
            data: order,
            message: "put orders is ok",
        })
    }

    static async delete (req, res) {
        let order = await new Order().remove(req.body.id);
        console.log(order);
        res.status(200).json({
            message: "del orders is ok",
        })
    }
}

module.exports = ordersController;
