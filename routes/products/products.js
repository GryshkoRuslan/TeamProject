const {getProducts, getProductsID, postProducts, putProducts, delProducts} = require("../../controllers/products");


const products = (app) => {
    app.get("/products", getProducts);
    app.get("/products/:id", getProductsID);
    app.post("/products", postProducts);
    app.put("/products", putProducts);
    app.delete("/products", delProducts);
};
module.exports = products;
