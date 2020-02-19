const BaseModel = require('./base.model');
const serviceLocator = require('../services/service.locator');
const Errors = require('./Errors');

class Product extends BaseModel {
    constructor() {
        super('products');
        this.categoriesProductTable = serviceLocator
            .get('db')
            .table('categories_lists');
        this.productAttributesValueTable = serviceLocator
            .get('db')
            .table('product_attributes_value');
        this.manufacturerTable = serviceLocator
            .get('db')
            .table('manufacturer');
    }

    async getProductWithCategories(id) {
        let product = await this.find(id);
        if (product.status) {
            return product
        }
        let attributes_value = await this.productAttributesValueTable
            .select('product_attributes_value.id', 'value', 'name')
            .leftJoin('product_attributes', 'product_attributes_value.id_product_attributes', 'product_attributes.id')
            .where('product_attributes_value.id_products', id)
            .catch(err=> {
                return Errors(err.code);
            });
        if (attributes_value.status) {
            return attributes_value
        }
        let manufacturer = await this.manufacturerTable.where('id', product["id_manufacturer"])
            .select('*')
            .first()
            .catch(err=> {
                return Errors(err.code);
            });
        if (manufacturer.status) {
            return manufacturer
        }
        let categories = await this.categoriesProductTable
            .select('categories_lists.id', 'name', 'parent_id', 'categories.id as categories_id')
            .leftJoin('categories', 'categories_lists.id_categories', 'categories.id')
            .where('categories_lists.id_products', id)
            .catch(err=> {
                return Errors(err.code);
            });
        if (categories.status) {
            return categories
        }
        product.manufacturer = manufacturer;
        product.attributes = attributes_value;
        product.categories = categories;
        return product
    }

}

module.exports = Product;
