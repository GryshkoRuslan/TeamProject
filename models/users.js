const BaseModel = require('./base.model');

class User extends BaseModel {
    constructor() {
        super('users')
    }

    getUserByCredentials(username, password) {
        return this.table.select(['login', 'id', 'email', 'isAdmin'])
            .where({
                login: username,
                pass: password,
            })
            .first()
    }

    getUserByToken(token) {
        return this.table.select(['login', 'id', 'email', 'isAdmin'])
            .where({
                token: token,
            })
            .first()
    }
}

module.exports = User;
