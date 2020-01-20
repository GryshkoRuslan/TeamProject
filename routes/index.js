const orders = require("./orders/orders");
const categories = require("./categories/categories");
const products = require("./products/products");

module.exports = (app) => {
  orders(app);
  categories(app);
  products(app);
};
