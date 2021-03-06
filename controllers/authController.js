const passport = require('../auth/passport');
const User = require('../models/users');
const md5 = require('md5');
const createError = require('http-errors');
const Roles = require('../auth/acl').Roles;

class authController {
    static login (req, res, next) {
        passport.authenticate('local', { session: false }, (err, user) => {
            if(err) {
                if (+err===404) {
                    next(createError(404, "Пользователь не найден"));
                } else {
                    throw new Error(err);
                }
            }
            res.status(200).json({
                data: user,
                message: "login success",
                responseCode: 0,
            })
        })(req, res)
    }

    static async logout (req, res, next) {
        let UserModel = new User();
        let user = await UserModel.find(req.query.id);
        if(!user) {
            next(createError(404, "Пользователь не найден"));
        } else {
            user.token = null;
            let result = await UserModel.store(user);
            if (result[0].id === user.id) {
                res.status(200).json({
                    data: result[0],
                    message: "logout success",
                    responseCode: 0,
                })
            } else {
                return next(result); //в result ошибка
            }
        }
    }

    static async register (req, res, next) {
        let UserModel = new User();
        req.query.pass=md5(req.query.pass);
        let user = await UserModel.create(req.query);
        if (user.status) {
            next(user);
        } else {
            res.status(200).json({
                data: user,
                message: "register success",
                responseCode: 0,
            })
        }
    }

    static me (req, res, next) {
        if (req.user.role === Roles.GUEST) {
            res.status(200).json({
                data: {},
                message: "you are not authorized",
                responseCode: 1,
            })
        } else {
            delete req.user.role;
            res.status(200).json({
                data: req.user,
                message: "login success",
                responseCode: 0,
            })
        }
    }
}
module.exports = authController;
