const User = require('../models/users');
const md5 = require('md5');
const Roles = require('../auth/acl').Roles;
const createError = require('http-errors');

class usersController {
    static async index (req, res, next) {
        if (req.user.role  == Roles.ADMIN) {
            let user = await new User().getList();
            if (user.responseCode === 1) {
                let status = user.status;
                delete user.status;
                res.status(status).json(user);
            } else {
                res.status(200).json({
                    data: user,
                    message: "get users is ok",
                    responseCode: 0,
                })
            }
        } else if (req.user.role === Roles.GUEST) {
            next(createError(401, "Авторизируйтесь"));
        } else {
            next(createError(403, "Не хватает прав"));
        }
    }

    static async read (req, res, next) {
        if (req.user.role === Roles.GUEST) {
            return next(createError(401, "Авторизируйтесь"));
        }
        let user = await new User().find(req.params.id);
        if(!user) {
            next(createError(404, "Пользователь не найден"));
        } else if (user.status) {
            next(user);
        } else {
            if(req.user.role === Roles.USER && req.user.email !== user.email) {
                return next(createError(403, "Не хватает прав"));
            }
            res.status(200).json({
                data: user,
                message: "get users id is ok",
                responseCode: 0,
            })
        }
    }

    static async write (req, res, next) {
        req.body.pass=md5(req.body.pass);
        let user = await new User().create(req.body);
        if(!user) {
            next(createError(404, "Пользователь не найден"));
        } else if (user.status) {
            next(user);
        } else {
            res.status(200).json({
                data: user,
                message: "post users is ok",
                responseCode: 0,
            })
        }
    }

    static async update (req, res, next) {
        let user = await new User().store(req.body);
        if (user.status) {
            next(user);
        } else {
            res.status(200).json({
                data: user,
                message: "put users is ok",
                responseCode: 0,
            })
        }
    }

    static async delete (req, res, next) {
        let user = await new User().remove(req.body.id);
        if (user.status) {
            next(user);
        } else {
            res.status(200).json({
                data: [],
                message: "del users is ok",
                responseCode: 0,
            })
        }
    }
}

module.exports = usersController;
