const passport = require('../auth/passport');
const User = require('../models/users');
const md5 = require('md5');
const createError = require('http-errors');

class authController {
    static login (req, res) {
        passport.authenticate('local', { session: false }, (err, user) => {
            if(err) {
                throw new Error(err)
            }
            res.send(user);
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
}
module.exports = authController;
