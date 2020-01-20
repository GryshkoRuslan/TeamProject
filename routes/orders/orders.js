const {getOrders, getOrdersID, postOrders, putOrders, delOrders} = require("../../controllers/orders");


const orders = (app) => {
    app.get("/orders", getOrders);
    app.get("/orders/:id", getOrdersID);
    app.post("/orders", postOrders);
    app.put("/orders", putOrders);
    app.delete("/orders", delOrders);
};
module.exports = orders;
