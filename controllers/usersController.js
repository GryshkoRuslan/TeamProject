const User = require('../models/users');

class usersController {
    static async index (req, res) {
        res.status(200).json({
            data: await new User().getList(),
            message: "get users is ok",
        })
    }

    static async read (req, res) {
        res.status(200).json({
            data: await new User().find(req.params.id),
            message: "get users id is ok",
        })
    }

    static async write (req, res) {
        let user = await new User().create(req.body);
        res.status(200).json({
            data: user,
            message: "post users is ok",
        })
    }

    static async update (req, res) {
        let user = await new User().store(req.body);
        res.status(200).json({
            data: user,
            message: "put users is ok",
        })
    }

    static async delete (req, res) {
        let user = await new User().remove(req.body.id);
        console.log(user);
        res.status(200).json({
            message: "del users is ok",
        })
    }
}

module.exports = usersController;
