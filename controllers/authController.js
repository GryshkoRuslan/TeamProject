const passport = require('../auth/passport');
const User = require('../models/users');
const md5 = require('md5');

class authController {
    static login (req, res) {
        passport.authenticate('local', { session: false }, (err, user) => {
            if(err) {
                throw new Error(err)
            }
            res.send(user);
        })(req, res)
    }

    static async logout (req, res) {
        let UserModel = new User();
        let user = await UserModel.find(req.query.id);
        if(!user) {
            res.status(404).json({
                message:'Пользователь не найден',
                responseCode: 1,
            })
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
                let status = result.status;
                delete result.status;
                res.status(status).json(result);
            }
        }
    }

    static async register (req, res) {
        let UserModel = new User();
        req.query.pass=md5(req.query.pass);
        let user = await UserModel.create(req.query);
        if (user.responseCode===1) {
            let status = user.status;
            delete user.status;
            res.status(status).json(user)
        } else {
            res.status(200).json({
                data: user,
                message: "post users is ok",
                responseCode: 0,
            })
        }
    }
}
module.exports = authController;
