const orders = require("./orders");
const categories = require("./categories");
const products = require("./products");
const users = require("./users");
const auth = require("./auth");

module.exports = (app) => {
  app.use('/orders', orders);
  app.use('/categories', categories);
  app.use('/products', products);
  app.use('/users', users);
  app.use(auth);
};
