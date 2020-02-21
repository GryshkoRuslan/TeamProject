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

    async getProductList (page=1) {
        let offset = (page-1)*10;
        let products = await this.table.select('*').limit(10).offset(offset).groupBy('id')
            .catch(err=> {
                return Errors(err.code);
            });
        for (let i=0; i<products.length; i++) {
            let img = await serviceLocator.get('db').table('product_attributes_value').select('value').where({'id_product_attributes': 42, 'id_products': products[i].id}).first();
            img ? products[i].img = img.value : products[i].img = '';
        }
        let count = await serviceLocator.get('db').table('products').count('id');
        return {products: products, count: count[0].count}
    }

    async getProductWithCategories(id) {
        let product = await this.find(id);
        if (product==undefined) {
            return Errors('404')
        }
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

    async saveProduct(product) {
        let attributes = product.attributes;
        delete product.attributes;
        let categories = product.categories;
        delete product.categories;
        try {
            await serviceLocator.get('db').transaction(async trx => {
                let productID = await trx('products').insert(product, 'id').transacting(trx);
                if (attributes!==undefined) {
                    attributes.forEach(attr=> attr['id_products'] = productID[0]);
                    await trx('product_attributes_value').insert(attributes);
                }
                if (categories!==undefined) {
                    categories.forEach(categ=> categ['id_products'] = productID[0]);
                    await trx('categories_lists').insert(categories);
                }

            });
            return product.name;
        } catch (err) {
            return Errors(err.code);
        }
    }

    async updateProduct(product) {
        let attributes = product.attributes;
        delete product.attributes;
        let newAttributes = product.newAttributes;
        delete product.newAttributes;
        let newCategories = product.newCategories;
        delete product.newCategories;
        let oldAttributes = product.oldAttributes;
        delete product.oldAttributes;
        let oldCategories = product.oldCategories;
        delete product.oldCategories;
        try {
            await serviceLocator.get('db').transaction(async trx => {
                await trx('products').where('id', product.id).update(product, 'id').transacting(trx);
                if (attributes!==undefined) {
                   for(let i=0; i<attributes.length; i++) {
                       await trx('product_attributes_value').where('id', attributes[i].id).update(attributes[i]);
                   }
                }
                if (newAttributes) {
                    newAttributes.forEach(attr=> attr['id_products'] = product.id);
                    await trx('product_attributes_value').insert(newAttributes);
                }
                if (newCategories) {
                    newCategories.forEach(categ=> categ['id_products'] = product.id);
                    await trx('categories_lists').insert(newCategories);
                }
                if (oldAttributes!==undefined) {
                    for(let i=0; i<oldAttributes.length; i++) {
                        await trx('product_attributes_value').where('id', oldAttributes[i].id).del();
                    }
                }
                if (oldCategories!==undefined) {
                    for(let i=0; i<oldCategories.length; i++) {
                        await trx('categories_lists').where('id', oldCategories[i].id).del();
                    }
                }
            });
            return product.name;
        } catch (err) {
            return Errors(err.code);
        }
    }

    async deleteProduct(id) {
        try {
            await serviceLocator.get('db').transaction(async trx => {
                await trx('categories_lists').where('id_products', id).del();
                await trx('product_attributes_value').where('id_products', id).del();
                await trx('products').where('id', id).del();

            });
            return id;
        } catch (err) {
            return Errors(err.code);
        }
    }

}

module.exports = Product;
