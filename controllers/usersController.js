const User = require('../models/users');

class usersController {
    static async index (req, res) {
        let user = await new User().getList();
        if (user.responseCode===1) {
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
    }

    static async read (req, res) {
        let user = await new User().find(req.params.id);
        if (user.responseCode===1) {
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
        let user = await new User().create(req.body);
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
