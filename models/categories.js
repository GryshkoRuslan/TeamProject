const BaseModel = require('./base.model');

class Categorie extends BaseModel {
    constructor() {
        super('categories')
    }
}

module.exports = Categorie;
