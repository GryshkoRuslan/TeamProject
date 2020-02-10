const Order = require('../models/orders');

class ordersController {
    static async index (req, res) {
        let order = await new Order().getList();
        if (order.responseCode===1) {
            let status = order.status;
            delete order.status;
            res.status(status).json(order)
        } else {
            res.status(200).json({
                data: order,
                message: "get orders is ok",
                responseCode: 0,
            })
        }
    }

    static async read (req, res) {
        let order = await new Order().find(req.params.id);
        if (order.responseCode===1) {
            let status = order.status;
            delete order.status;
            res.status(status).json(order)
        } else {
            res.status(200).json({
                data: order,
                message: "get orders id is ok",
                responseCode: 0,
            })
        }
    }

    static async write (req, res) {
        let order = await new Order().create(req.body);
        if (order.responseCode===1) {
            let status = order.status;
            delete order.status;
            res.status(status).json(order)
        } else {
            res.status(200).json({
                data: order,
                message: "post orders is ok",
                responseCode: 0,
            })
        }
    }

    static async update (req, res) {
        let order = await new Order().store(req.body);
        if (order.responseCode===1) {
            let status = order.status;
            delete order.status;
            res.status(status).json(order)
        } else {
            res.status(200).json({
                data: order,
                message: "put orders is ok",
                responseCode: 0,
            })
        }
    }

    static async delete (req, res) {
        let order = await new Order().remove(req.body.id);
        console.log(order);
        if (order.responseCode===1) {
            let status = order.status;
            delete order.status;
            res.status(status).json(order)
        } else {
            res.status(200).json({
                data: [],
                message: "del orders is ok",
                responseCode: 0,
            })
        }
    }
}

module.exports = ordersController;
