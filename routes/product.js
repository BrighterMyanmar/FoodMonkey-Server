const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateBody, validateToken, validateRole } = require("../utils/validator");

const { Product, Rest } = require('../utils/facade');
const Model = require('../models/product');
const role = "Owner";

router.post("/", [validateBody(Schema.productSave), validateToken(), validateRole(role)], async (req, res) => await Product.add(res, req.body));
router.get("/", async (req, res) => await Rest.filter(Model, res));

router.route("/:id")
    .get(validateParam(Schema.id, 'id'), async (req, res) => await Rest.get(Model, res, req.params.id,['category', 'subcat','childcat','tag','warranty','delivery']))
    .delete([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => await Rest.drop(Model, res, req.params.id))
    .patch([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => await Rest.patch(Model, res, req.params.id, req.body))

module.exports = router