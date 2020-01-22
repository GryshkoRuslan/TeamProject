const orders = require("./orders");
const categories = require("./categories");
const products = require("./products");

module.exports = (app) => {
  app.use('/orders', orders);
  app.use('/categories', categories);
  app.use('/products', products);
};
