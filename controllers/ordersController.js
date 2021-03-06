const Order = require('../models/orders');
const Errors = require('../models/Errors');
const Roles = require('../auth/acl').Roles;
const createError = require('http-errors');

class ordersController {
    static async index (req, res, next) {
        if (req.user.role === Roles.GUEST) {
            next(createError(401, "Авторизируйтесь"));
        } else {
            let order = await new Order().getOrdersByUser(req.user.id);
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
    }

    static async read (req, res, next) {
        if (req.user.role === Roles.GUEST) {
            next(createError(401, "Авторизируйтесь"));
        } else {
            let order = await new Order().getOrderWithProducts(req.params.id, req.user.id);
            if (order == undefined) {
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
    }

    static async write (req, res, next) {
        if (req.user.role === Roles.GUEST) {
            next(createError(401, "Авторизируйтесь"));
        } else {
            let order = await new Order().createOrderWithProducts(req.body, req.user.id);
            if (order.status && Number.isInteger(order.status)) {
                next(order);
            } else {
                res.status(200).json({
                    message: `Заказ создан под номером ${order}`,
                    responseCode: 0,
                })
            }
        }
    }

    static async update (req, res, next) {
        if (req.user.role  == Roles.ADMIN) {
            let order = await new Order().updateOrder(req.body);
            if (order.status && Number.isInteger(order.status)) {
                next(order);
            } else {
                res.status(200).json({
                    message: `Данные заказа №${order} успешно изменены`,
                    responseCode: 0,
                })
            }
        } else {
            next(createError(403, "Не хватает прав"));
        }
    }

    static async delete (req, res, next) {
        if (req.user.role  == Roles.ADMIN) {
            let order = await new Order().deleteOrder(req.body.id);
            if (order.status && Number.isInteger(order.status)) {
                next(order);
            } else {
                res.status(200).json({
                    message: `Заказ №${order} успешно удален`,
                    responseCode: 0,
                })
            }
        } else {
            next(createError(403, "Не хватает прав"));
        }
    }
}

module.exports = ordersController;
