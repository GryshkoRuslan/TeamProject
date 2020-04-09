const BaseModel = require('./base.model');
const md5 = require('md5');
const Errors = require('./Errors');

class User extends BaseModel {
    constructor() {
        super('users')
    }

    getUserByCredentials(username, password) {
        return this.table.select(['login', 'id', 'email', 'isadmin', 'first_name', 'second_name', 'mobile_phone'])
            .where({
                login: username,
                pass: md5(password),
            })
            .first()
            .catch(err=> {
                return Errors(err.code);
            })
    }

    getUserByToken(token) {
        return this.table.select(['login', 'id', 'email', 'isadmin', 'first_name', 'second_name', 'mobile_phone'])
            .where({
                token: token,
            })
            .first()
            .catch(err=> {
                return Errors(err.code);
            })
    }
}

module.exports = User;
