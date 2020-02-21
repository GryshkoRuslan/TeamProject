const serviceLocator = require('../services/service.locator');
const Errors = require('./Errors');

class BaseModel {

    constructor(tableName) {
        this.table = serviceLocator
            .get('db')
            .table(tableName)
    }

    getList() {
        return this.table.select('*')
            .catch(err=> {
            return Errors(err.code);
        })
    }

    find(id) {
        return this.table.where('id', id)
            .select('*')
            .first()
            .catch(err=> {
                return Errors(err.code);
            })
    }

    create(data) {
        return this.table.insert(data, ['id'])
            .catch(err=> {
            return Errors(err.code);
        })
    }

    store(data) {
        return this.table.where('id', data.id)
            .update(data, ['id'])
            .catch(err=> {
                return Errors(err.code);
            })
    }

    remove (id) {
        return this.table.where('id', id)
            .del()
            .catch(err=> {
                return Errors(err.code);
            })
    }



}

module.exports = BaseModel;
