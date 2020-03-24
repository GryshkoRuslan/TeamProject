const BaseModel = require('./base.model');
const Products = require('./products');
const serviceLocator = require('../services/service.locator');
const Errors = require('./Errors');
const createError = require('http-errors');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const {dateConversion} = require("../services/dateConversion");
dayjs.extend(utc);

class Order extends BaseModel {
    constructor() {
        super('orders');
        this.ordersListsTable = serviceLocator
            .get('db')
            .table('orders_lists');
    }

    async getOrdersByUser(user_id) {
        let orders = await this.table.select('*').where('id_users', user_id)
            .catch(err=> {
                return Errors(err.code);
            });
        let result = orders.map(o=> {
            o["date_start"] = dateConversion(o["date_start"]);
            o["date_end"] = dateConversion(o["date_end"]);
            return o
        });
        return result
    }

    async getOrderWithProducts(idOrder, idUser) {
        let order = await this.table.select('*').where('id', idOrder)
            .catch(err=> {
                return Errors(err.code);
            });
        if (order.length === 0) {
            return Errors('404')
        }
        if (order[0]["id_users"]!==idUser) {
            return createError(403, "Не хватает прав")
        }
        let products = await this.ordersListsTable.select('*').where('id_orders', idOrder)
            .catch(err=> {
            return Errors(err.code);
        });
        let productsWithAttributes = await (async (products) => {
            for (let i=0; i<products.length; i++) {
                products[i].fullProductInfo = await new Products().getProductWithCategories(products[i]["id_products"]);
            }
            return products;
        })(products);
        order[0].products = productsWithAttributes;
        order[0]["date_start"] = dateConversion(order[0]["date_start"]);
        order[0]["date_end"] = dateConversion(order[0]["date_end"]);
        return order[0]
    }

    async createOrderWithProducts(data, idUser) {
        let order = data;
        let products = order.products;
        delete order.products;
        order["id_users"] = idUser;
        try {
            let id_order = await serviceLocator.get('db').transaction(async trx => {
                let orderID = await trx('orders').insert(order, 'id');
                products.forEach(prod=> prod['id_orders'] = orderID[0]);
                await trx('orders_lists').insert(products);
                return orderID[0]
            });
            return id_order
        } catch (err) {
            return Errors(err.code)
        }
    }

    async updateOrder(order) {
        let products = order.products;
        delete order.products;
        let newProducts = order.newProducts;
        delete order.newProducts;
        let oldProducts = order.oldProducts;
        delete order.oldProducts;
        try {
            await serviceLocator.get('db').transaction(async trx => {
                await trx('orders').where('id', order.id).update(order, 'id').transacting(trx);
                if (products!==undefined) {
                    for(let i=0; i<products.length; i++) {
                        await trx('orders_lists').where('id', products[i].id).update(products[i]);
                    }
                }
                if (newProducts) {
                    newProducts.forEach(attr=> attr['id_orders'] = order.id);
                    await trx('orders_lists').insert(newProducts);
                }
                if (oldProducts) {
                    for(let i=0; i<oldProducts.length; i++) {
                        await trx('orders_lists').where('id', oldProducts[i].id).del();
                    }
                }
            });
            return order.id
        } catch (err) {
            return Errors(err.code)
        }
    }

    async deleteOrder(id) {
        try {
            await serviceLocator.get('db').transaction(async trx => {
                await trx('orders_lists').where('id_orders', id).del();
                await trx('orders').where('id', id).del();
            });
            return id;
        } catch (err) {
            return Errors(err.code);
        }
    }
}

module.exports = Order;
