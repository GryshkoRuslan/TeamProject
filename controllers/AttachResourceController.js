const AttachResourceController = (app, controller) => {

    app.get("/", controller.index);
    app.get("/:id", controller.read);
    app.post("/", controller.write);
    app.put("/", controller.update);
    app.delete("/", controller.delete);

};


module.exports = AttachResourceController;
