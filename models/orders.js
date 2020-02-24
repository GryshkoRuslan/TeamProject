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

    async addProductInOrder(product) {
        let orderList = await this.ordersListsTable.insert(product, 'id')
            .catch(err=>{
                return Errors(err.code);
            })
    }

    async createOrderWithProducts(data) {
        let order = data;
        let products = order.products;
        delete order.products;
        order["total_price"] = products.reduce((sum, product)=> {
            return sum+product["total_price"]
        }, 0);
        try {
            let id_order = await serviceLocator.get('db').transaction(async trx => {
                let orderID = await trx('orders').insert(order, 'id');
                products.forEach(prod=> prod['id_orders'] = orderID[0]);
                await trx('orders_lists').insert(products);
                return orderID[0]
            });
            return {"id": id_order}
        } catch (err) {
            return Errors(err.code)
        }
    }
}

module.exports = Order;
