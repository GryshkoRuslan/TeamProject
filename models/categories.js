const BaseModel = require('./base.model');
const serviceLocator = require('../services/service.locator');
const Errors = require('./Errors');
const createError = require('http-errors');

class Category extends BaseModel {
    constructor() {
        super('categories');
        this.categoriesAttributesTable = serviceLocator
            .get('db')
            .table('categories_attributes');
        this.productAttributesTable = serviceLocator
            .get('db')
            .table('product_attributes');
    }

    async createCategory(category) {
        let attributes = category.attributes;
        delete category.attributes;
        try {
            let result = await serviceLocator.get('db').transaction(async trx => {
                let categoryID = await trx('categories').insert(category, 'id');
                if (attributes) {
                    attributes.forEach(attr=> attr['id_categories'] = categoryID[0]);
                    await trx('categories_attributes').insert(attributes);
                }
                return categoryID[0]
            });
            return result
        } catch (err) {
            return Errors(err.code)
        }
    }

    async updateCategory(category) {
        let attributes = category.attributes;
        delete category.attributes;
        let newAttributes = category.newAttributes;
        delete category.newAttributes;
        let oldAttributes = category.oldAttributes;
        delete category.oldAttributes;
        try {
            await serviceLocator.get('db').transaction(async trx => {
                await trx('categories').where('id', category.id).update(category, 'id').transacting(trx);
                if (attributes!==undefined) {
                    for(let i=0; i<attributes.length; i++) {
                        await trx('categories_attributes').where('id', attributes[i].id).update(attributes[i]);
                    }
                }
                if (newAttributes) {
                    newAttributes.forEach(attr=> attr['id_categories'] = category.id);
                    await trx('categories_attributes').insert(newAttributes);
                }
                if (oldAttributes) {
                    for(let i=0; i<oldAttributes.length; i++) {
                        await trx('categories_attributes').where('id', oldAttributes[i].id).del();
                    }
                }
            });
            return category.name
        } catch (err) {
            return Errors(err.code)
        }
    }

    async deleteCategory(id) {
        try {
            await serviceLocator.get('db').transaction(async trx => {
                await trx('categories_attributes').where('id_categories', id).del();
                await trx('categories').where('id', id).del();
            });
            return id;
        } catch (err) {
            return Errors(err.code);
        }
    }

    async getAttributesByCategory(categoryID) {
        let attributesLists = await this.categoriesAttributesTable
            .select('id_product_attributes')
            .where('id_categories', categoryID)
            .catch(err=> {
                return Errors(err.code);
            });

        if (attributesLists.status) {
            return attributesLists
        }
        if (attributesLists.length === 0) {
            return createError(404, "У данной категории нет доступных для использования атрибутов")
        }
        let idAttributes = attributesLists.map(id=> id["id_product_attributes"]);
        let attributes = await this.productAttributesTable
            .select('*')
            .whereIn('id', idAttributes)
            .catch(err=> {
                return Errors(err.code);
            });
        return attributes
    }
}

module.exports = Category;
