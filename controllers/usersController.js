const User = require('../models/users');
const md5 = require('md5');

class usersController {
    static async index (req, res) {
        if (req.user && req.user.isAdmin == true) {
            let user = await new User().getList();
            if (user.responseCode === 1) {
                let status = user.status;
                delete user.status;
                res.status(status).json(user)
            } else {
                res.status(200).json({
                    data: user,
                    message: "get users is ok",
                    responseCode: 0,
                })
            }
        } else if (!req.user) {
            res.status(401).json({
                message: "Авторизируйтесь",
                responseCode: 1,
            })
        } else {
            res.status(403).json({
                message: "Не хватает прав",
                responseCode: 1,
            })
        }
    }

    static async read (req, res) {
        let user = await new User().find(req.params.id);
        if(!user) {
            res.status(404).json({
                message:'Пользователь не найден',
                responseCode: 1,
            })
        } else if (user!==undefined && user.responseCode===1) {
            let status = user.status;
            delete user.status;
            res.status(status).json(user)
        } else {
            res.status(200).json({
                data: user,
                message: "get users id is ok",
                responseCode: 0,
            })
        }
    }

    static async write (req, res) {
        req.body.pass=md5(req.body.pass);
        let user = await new User().create(req.body);
        if(!user) {
            res.status(404).json({
                message:'Пользователь не найден',
                responseCode: 1,
            })
        } else if (user!==undefined && user.responseCode===1) {
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

    static async update (req, res) {
        let user = await new User().store(req.body);
        if (user.responseCode===1) {
            let status = user.status;
            delete user.status;
            res.status(status).json(user)
        } else {
            res.status(200).json({
                data: user,
                message: "put users is ok",
                responseCode: 0,
            })
        }
    }

    static async delete (req, res) {
        let user = await new User().remove(req.body.id);
        if (user.responseCode===1) {
            let status = user.status;
            delete user.status;
            res.status(status).json(user)
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
