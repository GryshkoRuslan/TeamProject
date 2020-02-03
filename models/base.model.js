const serviceLocator = require('../services/service.locator');

class BaseModel {

    constructor(tableName) {
        this.table = serviceLocator
            .get('db')
            .table(tableName)
    }

    getList() {
        return this.table.select('*')
    }

    find(id) {
        return this.table.where('id', id)
            .select('*')
    }

    create(data) {
        return this.table.insert(data, ['id'])
    }

    store(data) {
        return this.table.where('id', data.id)
            .update(data, ['id'])
    }

    remove (id) {
        return this.table.where('id', id)
            .del()
    }



}

module.exports = BaseModel;
