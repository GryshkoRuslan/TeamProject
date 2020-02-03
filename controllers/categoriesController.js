const Categorie = require('../models/categories');

class categoriesController {
    static async index (req, res) {
        res.status(200).json({
            data: await new Categorie().getList(),
            message: "get categories is ok",
        })
    }

    static async read (req, res) {
        res.status(200).json({
            data: await new Categorie().find(req.params.id),
            message: "get categories id is ok",
        })
    }

    static async write (req, res) {
        let categorie = await new Categorie().create(req.body);
        res.status(200).json({
            data: categorie,
            message: "post categories is ok",
        })
    }

    static async update (req, res) {
        let categorie = await new Categorie().store(req.body);
        res.status(200).json({
            data: categorie,
            message: "put categories is ok",
        })
    }

    static async delete (req, res) {
        let categorie = await new Categorie().remove(req.body.id);
        console.log(categorie);
        res.status(200).json({
            message: "del categories is ok",
        })
    }
}

module.exports = categoriesController;
