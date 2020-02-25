const BaseModel = require('./base.model');
const serviceLocator = require('../services/service.locator');
const Errors = require('./Errors');

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
        return orders
    }

    async getOrderWithProducts(id) {
        let order = await this.table.select('*').where('id', id)
            .catch(err=> {
                return Errors(err.code);
            });
        let products = await this.ordersListsTable.select('*').where('id_orders', id)
            .catch(err=> {
            return Errors(err.code);
        });
        order[0].products = products;
        return order[0]
    }

    async createOrderWithProducts(data) {
        let order = data;
        let products = order.products;
        delete order.products;
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
