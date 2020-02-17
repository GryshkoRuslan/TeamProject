const BaseModel = require('./base.model');
const md5 = require('md5');

class User extends BaseModel {
    constructor() {
        super('users')
    }

    getUserByCredentials(username, password) {
        return this.table.select(['login', 'id', 'email', 'isadmin'])
            .where({
                login: username,
                pass: md5(password),
            })
            .first()
    }

    getUserByToken(token) {
        return this.table.select(['login', 'id', 'email', 'isadmin'])
            .where({
                token: token,
            })
            .first()
    }
}

module.exports = User;
