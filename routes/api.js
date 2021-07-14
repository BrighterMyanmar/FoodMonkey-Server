const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateToken, validateRole, validateBody } = require("../utils/validator");
const Helper = require('../utils/helper');

const { Order, FMCToken, Rest } = require('../utils/facade');
const CategoryModel = require('../models/category');
const TagModel = require('../models/tag');
const DeliveryModel = require('../models/delivery');
const WarrantyModel = require('../models/warranty');
const AdsModel = require('../models/ads');
const ProductModel = require('../models/product');
const OrderModel = require('../models/order');

const role = "User";

router.get('/categories', async (req, res) => await Rest.filter(CategoryModel, res));
router.get('/tags', async (req, res) => await Rest.filter(TagModel, res));
router.get('/deliveries', async (req, res) => await Rest.filter(DeliveryModel, res));
router.get('/warranties', async (req, res) => await Rest.filter(WarrantyModel, res));
router.get('/ads', async (req, res) => await Rest.filter(AdsModel, res));
router.get('/products/:skip?', validateParam(Schema.skip, 'skip'), async (req, res) => await Rest.filter(ProductModel, res, {}, '', req.params.skip));
router.get('/product/:id', validateParam(Schema.id, 'id'), async (req, res) => await Rest.get(ProductModel, res, req.params.id));
router.get('/appversion', async (req, res, next) => Helper.fMsg(res, 'App Version!', "1.0"));

// router.post("/order", async (req, res) => {
    // console.log("Order Body",req.body);
    // res.send({"con":"true"});
// });
router.post("/order", async (req, res) => await Order.add(req, res));
// router.post("/order", [validateBody(Schema.orderSave), validateToken(), validateRole(role)], async (req, res) => await Order.add(req, res));


router.get("/order/:id", validateParam(Schema.id, 'id'), async (req, res) => await Rest.get(OrderModel, res, req.params.id, 'items'));
router.get("/userorder/:id", validateParam(Schema.id, 'id'), async (req, res) => await Rest.filter(OrderModel, res, { user: req.params.id }, 'items'));

router.get("/productbytag/:id/:skip?",[validateParam(Schema.id, 'id'),validateParam(Schema.skip, 'skip')],async (req, res) => await Rest.filter(ProductModel, res, {tag:req.params.id},'',req.params.skip))
router.get("/productbycat/:id/:skip?",[validateParam(Schema.id, 'id'),validateParam(Schema.skip, 'skip')],async (req, res) => await Rest.filter(ProductModel, res, {category:req.params.id},'',req.params.skip))
router.get("/productbysubcat/:id/:skip?",[validateParam(Schema.id, 'id'),validateParam(Schema.skip, 'skip')],async (req, res) => await Rest.filter(ProductModel, res, {subcat:req.params.id},'',req.params.skip))
router.get("/productbychildcat/:id/:skip?",[validateParam(Schema.id, 'id'),validateParam(Schema.skip, 'skip')],async (req, res) => await Rest.filter(ProductModel, res, {childcat:req.params.id},'',req.params.skip))

router.post('/fmctoken', async (req, res, next) => await FMCToken.add(res,req.body));

// router.post('/order/bike/take', validateToken(), OrderController.orderTakeByBiker);




module.exports = router