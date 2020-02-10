const BaseModel = require('./base.model');

class Order extends BaseModel {
    constructor() {
        super('orders')
    }
}

module.exports = Order;
