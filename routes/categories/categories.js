const {getCategories, getCategoriesID, postCategories, putCategories, delCategories} = require("../../controllers/categories");


const categories = (app) => {
    app.get("/categories", getCategories);
    app.get("/categories/:id", getCategoriesID);
    app.post("/categories", postCategories);
    app.put("/categories", putCategories);
    app.delete("/categories", delCategories);
};
module.exports = categories;
