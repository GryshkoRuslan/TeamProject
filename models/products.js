const BaseModel = require('./base.model');

class Product extends BaseModel {
    constructor() {
        super('products')
    }
}

module.exports = Product;
