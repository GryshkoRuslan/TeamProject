const BaseModel = require('./base.model');
const serviceLocator = require('../services/service.locator');
const Errors = require('./Errors');

class Categorie extends BaseModel {
    constructor() {
        super('categories');
        this.categoriesAttributesTable = serviceLocator
            .get('db')
            .table('categories_attributes');
    }

    async createCategorie(categorie) {
        let attributes = categorie.attributes;
        delete categorie.attributes;
        try {
            let result = await serviceLocator.get('db').transaction(async trx => {
                let categorieID = await trx('categories').insert(categorie, 'id');
                if (attributes) {
                    attributes.forEach(attr=> attr['id_categories'] = categorieID[0]);
                    await trx('categories_attributes').insert(attributes);
                }
                return categorieID[0]
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
}

module.exports = Categorie;
