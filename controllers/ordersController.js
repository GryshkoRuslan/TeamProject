const Order = require('../models/orders');
const createError = require('http-errors');
const Errors = require('../models/Errors');

class ordersController {
    static async index (req, res, next) {
        let order = await new Order().getOrdersByUser(req.body['user_id']);
        if (order.status && Number.isInteger(order.status)) {
            next(order);
        } else {
            res.status(200).json({
                data: order,
                message: "get orders is ok",
                responseCode: 0,
            })
        }
    }

    static async read (req, res, next) {
        let order = await new Order().getOrderWithProducts(req.params.id);
        if(order==undefined) {
            next(Errors('404'))
        } else if (order.status && Number.isInteger(order.status)) {
            next(order);
        } else {
            res.status(200).json({
                data: order,
                message: "get orders id is ok",
                responseCode: 0,
            })
        }
    }

    static async write (req, res, next) {
        let order = await new Order().createOrderWithProducts(req.body);
        if (order.status && Number.isInteger(order.status)) {
            next(order);
        } else {
            res.status(200).json({
                data: order,
                message: "post order is ok",
                responseCode: 0,
            })
        }
    }

    static async update (req, res, next) {
        let order = await new Order().store(req.body);
        if (order.status && Number.isInteger(order.status)) {
            next(order);
        } else {
            res.status(200).json({
                data: order,
                message: "put orders is ok",
                responseCode: 0,
            })
        }
    }

    static async delete (req, res, next) {
        let order = await new Order().remove(req.body.id);
        if (order.status && Number.isInteger(order.status)) {
            next(order);
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
