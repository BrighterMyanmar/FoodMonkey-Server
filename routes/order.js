const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateToken, validateRole, validateBody } = require("../utils/validator");
const Helper = require('../utils/helper');

const { Order, Rest } = require('../utils/facade');
const Model = require('../models/order');
const role = "Owner";

router.post("/", [validateBody(Schema.orderSave), validateToken()], async (req, res) => await Order.add(req, res));
router.get("/", async (req, res) => { let cats = await Rest.filter(Model, res, {}, 'items') });

router.route("/:id")
    .get(validateParam(Schema.id, 'id'), async (req, res) => await Rest.get(Model, res, req.params.id,'items'))
    .delete([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => await Rest.drop(Model, res, req.params.id))
    .patch([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => await Rest.patch(Model, res, req.params.id, req.body));

module.exports = router

// Remain
/*
let search = async (req, res, next) => {

    let cacheUser = await Helper.getUserFromToken(req);
    let orders = null;
    if (cacheUser.level == 0) {
        orders = await OrderService.paginate({}, req.params.skip, 'user items');
    } else if (cacheUser.level == 1) {
        orders = await OrderService.paginate({ status: false, biker: { $exists: 0 } }, req.params.skip, 'items');
    } else if (cacheUser.level == 2) {
        orders = await OrderService.paginate({ user: cacheUser._id }, req.params.skip, 'items');
    }
    Helper.fMsg(res, "Orders ", orders);
}

let changeStatus = async (req, res, next) => {

    let order = await OrderService.get(req.params.id);
    order.status = !order.status;
    OrderService.patch(order._id, order);

    order.items.forEach(async (itemId) => {
        await OrderService.updateItem(itemId, { "status": order.status });
    });
    let updatedOrder = await OrderService.get(req.params.id);

    Helper.fMsg(res, "Orders Updated ", updatedOrder);
}

let orderTakeByBiker = async (req, res, next) => {
    await OrderService.orderBikerUpdate(req.body.orderId, { biker: req.body.bikerId });
    let updateOrder = await OrderService.get(req.body.orderId);
    Helper.fMsg(res, "Orders Taken Accept ", updateOrder);
}

*/