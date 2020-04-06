const BaseModel = require('./base.model');
const serviceLocator = require('../services/service.locator');
const Errors = require('./Errors');
const {filtersAttributesForCategories} = require("../services/filtersAttributesForCategories");

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
        let offset = (page-1)*12;
        let products = await this.table.select('*').limit(12).offset(offset).groupBy('id')
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

    async getProductsWithFilters (query) {
        if (query.id) {
            //Для отбора нескольких товаров по id
            let ids = query.id.split(',');
            let products = await this.table.select('*')
                .whereIn('id', ids)
                .groupBy('id')
                .catch(err=> {
                    return Errors(err.code);
                });
            for (let i=0; i<products.length; i++) {
                let img = await serviceLocator.get('db').table('product_attributes_value').select('value').where({'id_product_attributes': 42, 'id_products': products[i].id}).first();
                img ? products[i].img = img.value : products[i].img = '';
            }
            return {products: products}
        }
        let page = +query.page || 1;
        let offset = (page-1)*10;
        let idCategory = query.category;
        let idProductsObjects = await this.categoriesProductTable
            .select('id_products as id')
            .where('id_categories', idCategory)
            .catch(err=> {
                return Errors(err.code);
            });
        let idProducts = idProductsObjects.map(p=> p.id);

        let attributtesForFilters = filtersAttributesForCategories(idCategory);
        let categoryName = attributtesForFilters.categoryName;
        let attributtesIdForFilters = attributtesForFilters.ids;
        let filtersData = {};
        if (attributtesIdForFilters) {
            let attributesValueForFilters = await serviceLocator.get('db').table('product_attributes_value')
                .select('id_product_attributes', 'value')
                .whereIn('id_products', idProducts)
                .catch( err => {
                    return Errors(err.code);
                });
            let filtersValue = attributesValueForFilters.filter(a => {
                return a.id_product_attributes == attributtesIdForFilters.filter(id => id===a.id_product_attributes);
            });
            let attributesNameAndId = await serviceLocator.get('db').table('product_attributes')
                .select('id', 'name')
                .whereIn('id', attributtesIdForFilters)
                .catch( err => {
                    return Errors(err.code);
                });
            filtersData.attributes = attributesNameAndId;
            filtersData.values = filtersValue;
            filtersData.categoryName = categoryName;
        }

        let products = await this.table.select('*')
            .whereIn('id', idProducts)
            .limit(10)
            .offset(offset)
            .groupBy('id')
            .orderBy('id')
            .catch(err=> {
                return Errors(err.code);
            });
        for (let i=0; i<products.length; i++) {
            let img = await serviceLocator.get('db').table('product_attributes_value').select('value').where({'id_product_attributes': 42, 'id_products': products[i].id}).first();
            img ? products[i].img = img.value : products[i].img = '';
        }

        return {products: products, count: idProducts.length, filtersData: filtersData}
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

    async createProduct(product) {
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
